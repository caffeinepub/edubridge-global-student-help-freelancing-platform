import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";

module {
  type OldUserProfile = {
    name : Text;
    biography : ?Text;
    skills : ?Text;
    organization : ?Text;
    role : {
      #student;
      #helper;
      #business;
      #admin;
    };
  };

  type OldRequestWithTextTasks = {
    id : Nat;
    owner : Principal.Principal;
    title : Text;
    description : Text;
    status : {
      #pending;
      #accepted;
      #completed;
      #rejected;
    };
    locationInfo : ?{
      city : Text;
      address : Text;
    };
    createdAt : Int;
    tasks : [Text];
    assignedHelper : ?Principal.Principal;
  };

  type OldMessengerState = {
    userProfiles : Map.Map<Principal.Principal, OldUserProfile>;
    requests : Map.Map<Nat, OldRequestWithTextTasks>;
    ratings : List.List<{
      requestId : Nat;
      helperUserId : Principal.Principal;
      studentUserId : Principal.Principal;
      score : Nat;
      comment : Text;
      createdAt : Int;
    }>;
    messages : Map.Map<Nat, {
      id : Nat;
      requestId : Nat;
      sender : Principal.Principal;
      content : Text;
      timestamp : Int;
      isRead : Bool;
    }>;
    nextRequestId : Nat;
    nextMessageId : Nat;
    accessControlState : AccessControl.AccessControlState;
    initializationCompleted : Bool;
    ownerPrincipal : ?Principal.Principal;
    telegramConfig : ?{
      botToken : Text;
      chatId : Text;
    };
  };

  type NewUserProfile = {
    name : Text;
    biography : ?Text;
    skills : ?Text;
    organization : ?Text;
    role : {
      #student;
      #helper;
      #business;
      #admin;
      #client;
    };
  };

  type NewRequestWithTextTasks = {
    id : Nat;
    owner : Principal.Principal;
    title : Text;
    description : Text;
    status : {
      #pending;
      #accepted;
      #completed;
      #rejected;
    };
    locationInfo : ?{
      city : Text;
      address : Text;
    };
    createdAt : Int;
    tasks : [Text];
    assignedHelper : ?Principal.Principal;
    submissionMode : { #online; #offline };
    submissionLocation : ?Text;
  };

  type NewMessengerState = {
    userProfiles : Map.Map<Principal.Principal, NewUserProfile>;
    requests : Map.Map<Nat, NewRequestWithTextTasks>;
    ratings : List.List<{
      requestId : Nat;
      helperUserId : Principal.Principal;
      studentUserId : Principal.Principal;
      score : Nat;
      comment : Text;
      createdAt : Int;
    }>;
    messages : Map.Map<Nat, {
      id : Nat;
      requestId : Nat;
      sender : Principal.Principal;
      content : Text;
      timestamp : Int;
      isRead : Bool;
    }>;
    nextRequestId : Nat;
    nextMessageId : Nat;
    accessControlState : AccessControl.AccessControlState;
    initializationCompleted : Bool;
    ownerPrincipal : ?Principal.Principal;
    telegramConfig : ?{
      botToken : Text;
      chatId : Text;
    };
  };

  public func run(old : OldMessengerState) : NewMessengerState {
    let newUserProfiles = old.userProfiles.map<Principal.Principal, OldUserProfile, NewUserProfile>(
      func(_p, oldProf) { oldProf }
    );
    let newRequests = old.requests.map<Nat, OldRequestWithTextTasks, NewRequestWithTextTasks>(
      func(_id, oldRequest) {
        {
          oldRequest with
          submissionMode = #online;
          submissionLocation = null;
        };
      }
    );
    {
      old with
      userProfiles = newUserProfiles;
      requests = newRequests;
    };
  };
};
