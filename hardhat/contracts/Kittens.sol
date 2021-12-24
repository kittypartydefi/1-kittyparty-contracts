// SPDX-License-Identifier: BSL
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/AccessControl.sol";

import "./interfaces/IKittens.sol";

/// @title Kitty Party Types and options
/// @notice Utilized by factory while deciding what party to start
/// There are three parties
contract Kittens is IKittens, AccessControl {
    bytes32 public constant KITTYPARTY = keccak256("KITTYPARTY");

    event KittenAddedToParty(address Kitten, address KittyParty);
    event KittenCreated(address Kitten);

    //later we improve the kitten to be something where there is a DID that has verifiable claims as to their credit etc
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    Litter masterLitter;
    mapping(address => Litter) myLitter; //the mapping of the kittens belonging to a kittyparty

    function addKitten(address value) external onlyRole(KITTYPARTY) {
        //Add this kitten to the particular party
        // Modify this to wait for Kitten to accept inviteKitten
        if (!masterLitter.exists[value]) {
            masterLitter.index[value] = masterLitter.kittenList.length;
            masterLitter.exists[value] = true;
            masterLitter.kittenList.push(Kitten(value, 0));
            emit KittenCreated(value);
        }
        //if the kitten exists in the contract then revert
        if (myLitter[msg.sender].exists[value]) revert("EXISTS");
        myLitter[msg.sender].index[value] = myLitter[msg.sender].kittenList.length;
        myLitter[msg.sender].exists[value] = true;
        myLitter[msg.sender].kittenList.push(Kitten(value, 0));
        emit KittenAddedToParty(value, msg.sender);
    }

    function setupKittyParty(address childContract) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _setupRole(KITTYPARTY, childContract);
    }

    function getList(address kittyParty) external view returns (Kitten[] memory) {
        return myLitter[kittyParty].kittenList;
    }

    function getLength(address kittyParty) external view returns (uint256) {
        return myLitter[kittyParty].kittenList.length - 1;
    }

    function getValueAt(address kittyParty, uint256 i) external view returns (Kitten memory) {
        return myLitter[kittyParty].kittenList[i];
    }

    function getIndex(address kittyParty, address _kitten) external view returns (uint256) {
        return myLitter[kittyParty].index[_kitten];
    }

    function checkExists(address kittyParty, address _kitten) external view returns (bool exists) {
        if (myLitter[kittyParty].exists[_kitten]) return true;
    }

    function getAllList() external view returns (Kitten[] memory) {
        return masterLitter.kittenList;
    }

    function getAllLength() external view returns (uint256) {
        return masterLitter.kittenList.length - 1;
    }

    function getAllValueAt(uint256 i) external view returns (Kitten memory) {
        return masterLitter.kittenList[i];
    }

    function getIndex(address _kitten) external view returns (uint256) {
        return masterLitter.index[_kitten];
    }

    function checkAllExists(address _kitten) external view returns (bool exists) {
        if (masterLitter.exists[_kitten]) return true;
    } 
}