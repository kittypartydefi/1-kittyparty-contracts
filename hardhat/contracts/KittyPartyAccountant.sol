// SPDX-License-Identifier: BSL
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

import "hardhat/console.sol";

import "./interfaces/IKittens.sol";

contract KittyPartyAccountant is ERC1155, AccessControl, Pausable, ERC1155Burnable {
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant TOMCAT_ROLE = keccak256("TOMCAT_ROLE");
    
    ///@dev This is the token that will be given to users which allows them to withdraw their earnings and winnings
    ///@dev The withdrawals will be from the treasury
    ///@dev Besides this every kitty party will mint Non Fungible Tokens and send it to the kitten who successfully completed the rounds

    uint256 public constant KITTYPARTYRECEIPT = 0; //ERC 20 DAI this is a receipt which can be claimed from treasury
    uint256 public constant PLANETARY = 1; //Anyone can join and create a Planetary system
    uint256 public constant STELLAR = 2; // To create a Stellar Civilization need 1 apprentice blessing
    uint256 public constant GALACTIC = 3; // To create a Galactic Civilization needs at least 1 guardian blessing
    uint256 public constant KREATOR = 4;

    address public factoryContract;
    address public treasuryContract;

    bool private _initialized;

    event WinningKittenSelected(address kitten, address kittyparty);
    event CompletionBadgesMinted(address kitten, address kittyparty);

    // TODO: Create a setter for the ipfs URI
    constructor() ERC1155("") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(URI_SETTER_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    function __KittyPartyAccountant_init(address _factoryContract) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(!_initialized, "Initializable: contract is already initialized");
        factoryContract = _factoryContract;
        _mint(_factoryContract, PLANETARY, 10**18, "");
        _mint(_factoryContract, STELLAR, 10**12, "");
        _mint(_factoryContract, GALACTIC, 10**9, "");
        _initialized = true;
    }

    function mintToWinners(
        address kreator,
        address litterAddress, 
        address kittyParty, 
        uint256[] memory winnerIndexes, 
        uint256 amountToSent
    ) 
        external 
        onlyRole(MINTER_ROLE)
    {
        if (_checkApproved(kreator, amountToSent)) {
            bytes memory getList = abi.encodeWithSignature("getList(address)", kittyParty);
            (bool success, bytes memory kittensList) = address(litterAddress).staticcall(getList);
            require(success, "GE");
            (IKittens.Kitten[] memory kittens_) = abi.decode(kittensList, (IKittens.Kitten[]));

                for (uint i = 0; i < winnerIndexes.length; i++) {
                    IKittens.Kitten memory localKitten = kittens_[i];
                    mint(localKitten.kitten, 0, amountToSent, "");
                    emit WinningKittenSelected(localKitten.kitten, kittyParty);
                }
        }
    }

    function _checkApproved(address kreator, uint amountToSent) internal view returns(bool approvalForKreator) {
        if(amountToSent > 1000 * 10 ** 18){
           if(hasRole(TOMCAT_ROLE, kreator)){
               return true;
           }
           else {
               return false;
           }
        }
        else {
            return true;
        }
    }

    /**
    @dev This is to be called by the Kitty party controller in order to safe transfer NFT badges to all the participants of a completed party
    @notice This is the badge that says the kitten is an active citizen of that world
    */
    function transferBadgesOnCompletion(
        address litterAddress, 
        address kittyParty
    ) 
        external 
        onlyRole(MINTER_ROLE)
    {
        bytes memory getList = abi.encodeWithSignature("getList(address)", kittyParty);
        (bool success, bytes memory kittensList) = address(litterAddress).staticcall(getList);
        require(success, "GE");
        (IKittens.Kitten[] memory kittens_) = abi.decode(kittensList, (IKittens.Kitten[]));
            for (uint i = 0; i < kittens_.length; i++) {
                IKittens.Kitten memory localKitten = kittens_[i];
                safeTransferFrom(factoryContract, localKitten.kitten, 1, 1, "0x0");
                emit CompletionBadgesMinted(localKitten.kitten, kittyParty);
            }
    }

    function setupMinter(address kittyParty)
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        _setupRole(MINTER_ROLE, kittyParty);
        //Give approval to the child Contract to move factory tokens
        setApprovalForAll(kittyParty,true);
    }

    function setTreasury(address _treasuryContract)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        treasuryContract = _treasuryContract;
        _setupRole(MINTER_ROLE, _treasuryContract);
    }

    ///@notice Add a tomcat kreator to the whitelist, via a DAO proposal
    function setupTomcatList(address tomcat)
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        _setupRole(TOMCAT_ROLE, tomcat);
    }

    function setURI(string memory newuri) public onlyRole(URI_SETTER_ROLE) {
        _setURI(newuri);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function mint(
        address account, 
        uint256 id, uint256 amount, 
        bytes memory data
    )
        public
        onlyRole(MINTER_ROLE)
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(
        address to, 
        uint256[] memory ids, 
        uint256[] memory amounts, 
        bytes memory data
    )
        public
        onlyRole(MINTER_ROLE)
    {
        _mintBatch(to, ids, amounts, data);
    }

    function _beforeTokenTransfer(
        address operator, 
        address from, 
        address to, 
        uint256[] memory ids, 
        uint256[] memory amounts, 
        bytes memory data
    )
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}