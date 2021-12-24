// SPDX-License-Identifier: BSL
pragma solidity ^0.8.2;

/// @title Kitty Party Types and options
/// @notice Utilized by factory while deciding what party to start
interface IKittens {
    //later we improve the kitten to be something where there is a DID that has verifiable claims as to their credit etc
    struct Kitten {
        address kitten;
        uint256 reputation;
    }

    struct Litter {
        Kitten[] kittenList; // An unordered list of unique values
        mapping(address => bool) exists;
        mapping(address => uint256) index; // Tracks the index of a value
    }
}