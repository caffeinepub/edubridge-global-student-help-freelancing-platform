import Text "mo:core/Text";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Outcall "http-outcalls/outcall";
import Migration "migration";

(with migration = Migration.run)
actor {
  // === User Profiles ===

  type UserRole = {
    #student;
    #helper;
    #business;
    #admin;
  };

  type UserProfile = {
    name : Text;
    biography : ?Text;
    skills : ?Text;
    organization : ?Text;
    role : UserRole;
  };

  module UserProfile {
    public func compare(a : UserProfile, b : UserProfile) : Order.Order {
      Text.compare(a.name, b.name);
    };

    public func compareByName(a : UserProfile, b : UserProfile) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  // === User System Integration (AUTHZ) ===

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();

  // === Initialization Guard ===
  // Only the canister creator can call this once
  var initializationCompleted = false;
  public shared ({ caller }) func completeInitialization() : async () {
    if (not initializationCompleted) {
      initializationCompleted := true;
    };
  };

  // === Single Owner Enforcement ===
  // Track if an admin/owner has been created
  var ownerPrincipal : ?Principal = null;

  func hasOwner() : Bool {
    switch (ownerPrincipal) {
      case (null) { false };
      case (?_) { true };
    };
  };

  func isOwner(user : Principal) : Bool {
    switch (ownerPrincipal) {
      case (null) { false };
      case (?owner) { owner == user };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      return "Unauthorized: Only users can save profiles";
    };

    // Enforce single owner rule
    switch (profile.role) {
      case (#admin) {
        if (hasOwner() and not isOwner(caller)) {
          return "Unauthorized: Only one admin/owner is allowed. The business owner has already been set.";
        };
        if (not hasOwner()) {
          ownerPrincipal := ?caller;
        };
      };
      case (_) {};
    };

    userProfiles.add(caller, profile);

    // Sync role to AccessControl system
    switch (profile.role) {
      case (#admin) {
        AccessControl.assignRole(accessControlState, caller, caller, #admin);
      };
      case (_) {
        // All other roles are regular users
        AccessControl.assignRole(accessControlState, caller, caller, #user);
      };
    };
    "Profile saved successfully";
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    // Allow users to view their own profile or admins to view any profile
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  func getUserRole(user : Principal) : ?UserRole {
    switch (userProfiles.get(user)) {
      case (null) { null };
      case (?profile) { ?profile.role };
    };
  };

  func isStudent(user : Principal) : Bool {
    switch (getUserRole(user)) {
      case (?#student) { true };
      case (_) { false };
    };
  };

  func isHelper(user : Principal) : Bool {
    switch (getUserRole(user)) {
      case (?#helper) { true };
      case (_) { false };
    };
  };

  func isBusiness(user : Principal) : Bool {
    switch (getUserRole(user)) {
      case (?#business) { true };
      case (_) { false };
    };
  };

  // === Help Requests Data Models ===

  type RequestStatus = {
    #pending;
    #accepted;
    #completed;
  };

  type Location = {
    city : Text;
    address : Text;
  };

  type RequestWithTextTasks = {
    id : Nat;
    owner : Principal;
    title : Text;
    description : Text;
    status : RequestStatus;
    locationInfo : ?Location;
    createdAt : Time.Time;
    tasks : [Text];
    assignedHelper : ?Principal;
  };

  module RequestWithTextTasks {
    public func compare(a : RequestWithTextTasks, b : RequestWithTextTasks) : Order.Order {
      if (a.id < b.id) { #less } else if (a.id > b.id) { #greater } else {
        #equal;
      };
    };

    public func compareByStatus(a : RequestWithTextTasks, b : RequestWithTextTasks) : Order.Order {
      func toNat(status : RequestStatus) : Nat {
        switch (status) {
          case (#pending) { 0 };
          case (#accepted) { 1 };
          case (#completed) { 2 };
        };
      };
      let natA = toNat(a.status);
      let natB = toNat(b.status);
      if (natA < natB) { #less } else if (natA > natB) { #greater } else {
        #equal;
      };
    };
  };

  let requests = Map.empty<Nat, RequestWithTextTasks>();

  var nextRequestId = 1;

  // === Telegram Configuration ===
  type TelegramConfig = {
    botToken : Text;
    chatId : Text;
  };

  var telegramConfig : ?TelegramConfig = null;

  public shared ({ caller }) func setTelegramConfig(botToken : Text, chatId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the owner can configure Telegram notifications");
    };
    telegramConfig := ?{
      botToken;
      chatId;
    };
  };

  public query ({ caller }) func getTelegramConfigStatus() : async {
    isConfigured : Bool;
    chatId : ?Text;
  } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the owner can view Telegram configuration status");
    };
    switch (telegramConfig) {
      case (null) {
        { isConfigured = false; chatId = null };
      };
      case (?config) {
        { isConfigured = true; chatId = ?config.chatId };
      };
    };
  };

  public query ({ caller }) func transform(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    Outcall.transform(input);
  };

  func postTelegramNotification(message : Text) : async () {
    switch (telegramConfig) {
      case (null) {
        // Silently skip if not configured
        return;
      };
      case (?config) {
        let url = "https://api.telegram.org/bot" # config.botToken # "/sendMessage";

        let body = "{\"chat_id\": \"" # config.chatId # "\"," #
          "\"text\": \"" # message # "\"}";

        try {
          ignore await Outcall.httpPostRequest(url, [], body, transform);
        } catch (_) {};
      };
    };
  };

  public shared ({ caller }) func createRequest(
    title : Text,
    description : Text,
    location : ?Location,
    telegramChannelUrl : Text,
  ) : async Nat {
    // Allow any authenticated user to create requests
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create requests");
    };

    let newRequest : RequestWithTextTasks = {
      id = nextRequestId;
      owner = caller;
      title;
      description;
      status = #pending;
      locationInfo = location;
      createdAt = Time.now();
      tasks = [];
      assignedHelper = null;
    };

    requests.add(nextRequestId, newRequest);

    // Send Telegram notification
    let telegramMessage = "New work request submitted: " # title # " - " # description # " Location: " # (
      switch (location) {
        case (?loc) { loc.city # ", " # loc.address };
        case (null) { "N/A" };
      }
    ) # "\nCheck the channel: " # telegramChannelUrl;
    await postTelegramNotification(telegramMessage);

    nextRequestId += 1;
    newRequest.id;
  };

  public query ({ caller }) func getAllRequests() : async [RequestWithTextTasks] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view requests");
    };

    if (AccessControl.isAdmin(accessControlState, caller)) {
      return requests.values().toArray().sort();
    };

    if (isHelper(caller)) {
      return requests.values().toArray().filter(
        func(req) {
          req.status == #pending or (switch (req.assignedHelper) {
            case (?helper) { helper == caller };
            case (null) { false };
          })
        }
      ).sort();
    };

    requests.values().toArray().filter(
      func(req) { req.owner == caller }
    ).sort();
  };

  public query ({ caller }) func getRequestsByStatus(status : RequestStatus) : async [RequestWithTextTasks] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view requests");
    };

    let filtered = requests.values().toArray().filter(
      func(req) { req.status == status }
    );

    if (AccessControl.isAdmin(accessControlState, caller)) {
      return filtered;
    };

    if (isHelper(caller)) {
      return filtered.filter(
        func(req) {
          req.status == #pending or (switch (req.assignedHelper) {
            case (?helper) { helper == caller };
            case (null) { false };
          })
        }
      );
    };

    filtered.filter(
      func(req) { req.owner == caller }
    );
  };

  public query ({ caller }) func getMyRequests() : async [RequestWithTextTasks] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view requests");
    };

    requests.values().toArray().filter(
      func(req) { req.owner == caller }
    ).sort();
  };

  public query ({ caller }) func getAvailableRequests() : async [RequestWithTextTasks] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view requests");
    };

    if (not isHelper(caller)) {
      Runtime.trap("Unauthorized: Only helpers can view available requests");
    };

    requests.values().toArray().filter(
      func(req) { req.status == #pending }
    ).sort();
  };

  public query ({ caller }) func getMyAssignedRequests() : async [RequestWithTextTasks] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view requests");
    };

    if (not isHelper(caller)) {
      Runtime.trap("Unauthorized: Only helpers can view assigned requests");
    };

    requests.values().toArray().filter(
      func(req) {
        switch (req.assignedHelper) {
          case (?helper) { helper == caller };
          case (null) { false };
        }
      }
    ).sort();
  };

  public shared ({ caller }) func acceptRequest(requestId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can accept requests");
    };

    if (not isHelper(caller)) {
      Runtime.trap("Unauthorized: Only helpers can accept requests");
    };

    switch (requests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        if (request.status != #pending) {
          Runtime.trap("Request is not available");
        };
        let updatedRequest = {
          request with 
          status = #accepted;
          assignedHelper = ?caller;
        };
        requests.add(requestId, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func completeRequest(requestId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete requests");
    };

    if (not isHelper(caller)) {
      Runtime.trap("Unauthorized: Only helpers can complete requests");
    };

    switch (requests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        switch (request.assignedHelper) {
          case (null) { Runtime.trap("Request is not assigned") };
          case (?helper) {
            if (helper != caller) {
              Runtime.trap("Unauthorized: Only the assigned helper can complete this request");
            };
          };
        };

        if (request.status != #accepted) {
          Runtime.trap("Request is not in accepted state");
        };

        let updatedRequest = {
          request with status = #completed;
        };
        requests.add(requestId, updatedRequest);
      };
    };
  };

  public shared ({ caller }) func addTask(requestId : Nat, task : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add tasks");
    };

    switch (requests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        if (caller != request.owner) {
          Runtime.trap("Unauthorized: Only the request owner can add tasks");
        };
        let updatedTasks = request.tasks.concat([task]);
        let updatedRequest = {
          request with tasks = updatedTasks;
        };
        requests.add(requestId, updatedRequest);
      };
    };
  };

  // === Ratings ===

  type Rating = {
    requestId : Nat;
    helperUserId : Principal;
    studentUserId : Principal;
    score : Nat;
    comment : Text;
    createdAt : Time.Time;
  };

  module Rating {
    public func compare(a : Rating, b : Rating) : Order.Order {
      if (a.score < b.score) { #less } else if (a.score > b.score) {
        #greater;
      } else { #equal };
    };
  };

  let ratings = List.empty<Rating>();

  public shared ({ caller }) func addRating(requestId : Nat, helperUser : Principal, score : Nat, comment : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add ratings");
    };

    switch (requests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        if (request.owner != caller) {
          Runtime.trap("Unauthorized: Only the request owner can rate the helper");
        };
        if (request.status != #completed) {
          Runtime.trap("Can only rate completed requests");
        };
        switch (request.assignedHelper) {
          case (null) { Runtime.trap("Request has no assigned helper") };
          case (?helper) {
            if (helper != helperUser) {
              Runtime.trap("Helper mismatch");
            };
          };
        };
      };
    };

    let newRating : Rating = {
      requestId;
      helperUserId = helperUser;
      studentUserId = caller;
      score;
      comment;
      createdAt = Time.now();
    };
    ratings.add(newRating);
  };

  public query ({ caller }) func getAllRatings() : async [Rating] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all ratings");
    };

    ratings.toArray().sort();
  };

  public query ({ caller }) func getRatingsByUser(user : Principal) : async [Rating] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view ratings");
    };

    // Only allow viewing ratings for yourself (as helper or student) or if admin
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own ratings");
    };

    ratings.toArray().filter(
      func(rating) { rating.helperUserId == user or rating.studentUserId == user }
    );
  };

  public query ({ caller }) func getMyRatingsAsHelper() : async [Rating] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view ratings");
    };

    if (not isHelper(caller)) {
      Runtime.trap("Unauthorized: Only helpers can view their ratings");
    };

    ratings.toArray().filter(
      func(rating) { rating.helperUserId == caller }
    );
  };

  // === Address Filtering ===

  public query ({ caller }) func filterRequestsByCity(city : Text) : async [RequestWithTextTasks] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can filter requests");
    };

    let filtered = requests.values().toArray().filter(
      func(req) {
        switch (req.locationInfo) {
          case (null) { false };
          case (?location) { location.city == city };
        };
      }
    );

    if (AccessControl.isAdmin(accessControlState, caller)) {
      return filtered;
    };

    if (isHelper(caller)) {
      return filtered.filter(
        func(req) {
          req.status == #pending or (switch (req.assignedHelper) {
            case (?helper) { helper == caller };
            case (null) { false };
          })
        }
      );
    };

    filtered.filter(
      func(req) { req.owner == caller }
    );
  };

  public query ({ caller }) func getPendingRequestsForUser(user : Principal) : async [RequestWithTextTasks] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view requests");
    };

    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own pending requests");
    };

    requests.values().toArray().filter(
      func(req) {
        req.owner == user and req.status == #pending
      }
    );
  };

  // === Chat/Messaging ===

  type Message = {
    id : Nat;
    requestId : Nat;
    sender : Principal;
    content : Text;
    timestamp : Time.Time;
    isRead : Bool;
  };

  module Message {
    public func compare(a : Message, b : Message) : Order.Order {
      if (a.id < b.id) { #less } else if (a.id > b.id) { #greater } else {
        #equal;
      };
    };
  };

  let messages = Map.empty<Nat, Message>();
  var nextMessageId = 1;

  public shared ({ caller }) func sendMessage(requestId : Nat, content : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    switch (requests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        let isOwner = request.owner == caller;
        let isAssignedHelper = switch (request.assignedHelper) {
          case (?helper) { helper == caller };
          case (null) { false };
        };
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);

        // Admin can participate in any chat thread
        if (not (isOwner or isAssignedHelper or isAdmin)) {
          Runtime.trap("Unauthorized: Only the request owner, assigned helper, or admin can send messages");
        };

        let newMessage : Message = {
          id = nextMessageId;
          requestId;
          sender = caller;
          content;
          timestamp = Time.now();
          isRead = false;
        };

        messages.add(nextMessageId, newMessage);
        nextMessageId += 1;
        newMessage.id;
      };
    };
  };

  public query ({ caller }) func getMessages(requestId : Nat) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view messages");
    };

    switch (requests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        let isOwner = request.owner == caller;
        let isAssignedHelper = switch (request.assignedHelper) {
          case (?helper) { helper == caller };
          case (null) { false };
        };
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);

        // Admin can read any chat thread
        if (not (isOwner or isAssignedHelper or isAdmin)) {
          Runtime.trap("Unauthorized: Only the request owner, assigned helper, or admin can view messages");
        };

        messages.values().toArray().filter(
          func(msg) { msg.requestId == requestId }
        ).sort();
      };
    };
  };

  public shared ({ caller }) func markMessageAsRead(messageId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark messages as read");
    };

    switch (messages.get(messageId)) {
      case (null) { Runtime.trap("Message not found") };
      case (?message) {
        if (message.sender == caller) {
          Runtime.trap("Cannot mark your own message as read");
        };

        switch (requests.get(message.requestId)) {
          case (null) { Runtime.trap("Request not found") };
          case (?request) {
            let isOwner = request.owner == caller;
            let isAssignedHelper = switch (request.assignedHelper) {
              case (?helper) { helper == caller };
              case (null) { false };
            };
            let isAdmin = AccessControl.isAdmin(accessControlState, caller);

            // Admin can mark messages as read in any chat thread
            if (not (isOwner or isAssignedHelper or isAdmin)) {
              Runtime.trap("Unauthorized: Only the request owner, assigned helper, or admin can mark messages as read");
            };

            let updatedMessage = {
              message with isRead = true;
            };
            messages.add(messageId, updatedMessage);
          };
        };
      };
    };
  };

  public query ({ caller }) func getUnreadMessageCount(requestId : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view unread count");
    };

    switch (requests.get(requestId)) {
      case (null) { Runtime.trap("Request not found") };
      case (?request) {
        let isOwner = request.owner == caller;
        let isAssignedHelper = switch (request.assignedHelper) {
          case (?helper) { helper == caller };
          case (null) { false };
        };
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);

        // Admin can view unread count for any chat thread
        if (not (isOwner or isAssignedHelper or isAdmin)) {
          Runtime.trap("Unauthorized: Only the request owner, assigned helper, or admin can view unread count");
        };

        let unreadMessages = messages.values().toArray().filter(
          func(msg) {
            msg.requestId == requestId and not msg.isRead and msg.sender != caller
          }
        );

        unreadMessages.size();
      };
    };
  };

  // === Admin Functions ===

  public query ({ caller }) func getAllUsers() : async [(Principal, UserProfile)] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };

    userProfiles.entries().toArray();
  };

  public shared ({ caller }) func deleteUser(user : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete users");
    };

    // Prevent deleting the owner
    if (isOwner(user)) {
      Runtime.trap("Cannot delete the business owner account");
    };

    userProfiles.remove(user);
  };

  public shared ({ caller }) func deleteRequest(requestId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete requests");
    };

    requests.remove(requestId);
  };

  public query ({ caller }) func getAnalytics() : async {
    totalUsers : Nat;
    totalRequests : Nat;
    pendingRequests : Nat;
    acceptedRequests : Nat;
    completedRequests : Nat;
    totalRatings : Nat;
    averageRating : Float;
  } {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view analytics");
    };

    let allRequests = requests.values().toArray();
    let allRatings = ratings.toArray();

    let pendingCount = allRequests.filter(func(req) { req.status == #pending }).size();
    let acceptedCount = allRequests.filter(func(req) { req.status == #accepted }).size();
    let completedCount = allRequests.filter(func(req) { req.status == #completed }).size();

    var totalScore = 0;
    for (rating in allRatings.vals()) {
      totalScore += rating.score;
    };

    let avgRating = if (allRatings.size() > 0) {
      totalScore.toFloat() / allRatings.size().toFloat();
    } else {
      0.0;
    };

    {
      totalUsers = userProfiles.size();
      totalRequests = allRequests.size();
      pendingRequests = pendingCount;
      acceptedRequests = acceptedCount;
      completedRequests = completedCount;
      totalRatings = allRatings.size();
      averageRating = avgRating;
    };
  };
};
