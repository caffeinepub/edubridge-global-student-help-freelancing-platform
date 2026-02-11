import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Time "mo:core/Time";

module {
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

  type Location = {
    city : Text;
    address : Text;
  };

  type RequestStatus = {
    #pending;
    #accepted;
    #completed;
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

  type Rating = {
    requestId : Nat;
    helperUserId : Principal;
    studentUserId : Principal;
    score : Nat;
    comment : Text;
    createdAt : Time.Time;
  };

  type Message = {
    id : Nat;
    requestId : Nat;
    sender : Principal;
    content : Text;
    timestamp : Time.Time;
    isRead : Bool;
  };

  type TelegramConfig = {
    botToken : Text;
    chatId : Text;
  };

  public type OldActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    requests : Map.Map<Nat, RequestWithTextTasks>;
    nextRequestId : Nat;
    ratings : List.List<Rating>;
    messages : Map.Map<Nat, Message>;
    nextMessageId : Nat;
  };

  public type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    requests : Map.Map<Nat, RequestWithTextTasks>;
    nextRequestId : Nat;
    ratings : List.List<Rating>;
    messages : Map.Map<Nat, Message>;
    nextMessageId : Nat;
    ownerPrincipal : ?Principal;
    telegramConfig : ?TelegramConfig;
  };

  public func run(old : OldActor) : NewActor {
    {
      userProfiles = old.userProfiles;
      requests = old.requests;
      nextRequestId = old.nextRequestId;
      ratings = old.ratings;
      messages = old.messages;
      nextMessageId = old.nextMessageId;
      ownerPrincipal = null;
      telegramConfig = null;
    };
  };
};
