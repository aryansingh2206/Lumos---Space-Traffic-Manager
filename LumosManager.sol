// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract LumosManager {
    enum Role { None, Admin, RegulatoryBody, GeneralUser }
    enum RequestStatus { Pending, Approved, Rejected }

    address public owner;

    struct Request {
        address submittedBy;
        string details;
        RequestStatus status;
    }

    mapping(address => Role) public roles;
    Request[] public launchRequests;
    Request[] public maneuverRequests;

    mapping(bytes32 => bool) public usedOrbitHashes;

    event RoleAssigned(address indexed user, Role role);
    event LaunchRequested(uint indexed id, address indexed user);
    event ManeuverRequested(uint indexed id, address indexed user, bool autoRejected);
    event LaunchReviewed(uint indexed id, RequestStatus status);
    event ManeuverReviewed(uint indexed id, RequestStatus status);

    constructor() {
        owner = msg.sender;
        roles[msg.sender] = Role.Admin;
        emit RoleAssigned(msg.sender, Role.Admin);
    }

    function assignRole(address user, Role role) external {
        require(msg.sender == owner, "Only owner");
        require(role != Role.None && role != Role.Admin, "Invalid role");
        roles[user] = role;
        emit RoleAssigned(user, role);
    }

    function registerSelf(uint8 role) external {
        require(roles[msg.sender] == Role.None, "Already registered");
        require(role == uint8(Role.RegulatoryBody) || role == uint8(Role.GeneralUser), "Invalid role");
        roles[msg.sender] = Role(role);
        emit RoleAssigned(msg.sender, Role(role));
    }

    function requestLaunch(string calldata details) external {
        launchRequests.push(Request(msg.sender, details, RequestStatus.Pending));
        emit LaunchRequested(launchRequests.length - 1, msg.sender);
    }

    function requestManeuver(string calldata details) external {
        bytes32 orbitHash = keccak256(abi.encodePacked(details));

        RequestStatus status = RequestStatus.Pending;

        if (usedOrbitHashes[orbitHash]) {
            status = RequestStatus.Rejected;
        } else {
            usedOrbitHashes[orbitHash] = true;
        }

        maneuverRequests.push(Request(msg.sender, details, status));
        emit ManeuverRequested(maneuverRequests.length - 1, msg.sender, status == RequestStatus.Rejected);
    }

    function reviewLaunch(uint id, bool approve) external {
        require(id < launchRequests.length, "Invalid ID");
        launchRequests[id].status = approve ? RequestStatus.Approved : RequestStatus.Rejected;
        emit LaunchReviewed(id, launchRequests[id].status);
    }

    function reviewManeuver(uint id, bool approve) external {
        require(id < maneuverRequests.length, "Invalid ID");
        maneuverRequests[id].status = approve ? RequestStatus.Approved : RequestStatus.Rejected;
        emit ManeuverReviewed(id, maneuverRequests[id].status);
    }

    function getLaunchRequests() external view returns (Request[] memory) {
        return launchRequests;
    }

    function getManeuverRequests() external view returns (Request[] memory) {
        return maneuverRequests;
    }
}
