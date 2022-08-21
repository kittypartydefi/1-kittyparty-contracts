// SPDX-License-Identifier: BSL
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";

import "./interfaces/IKittens.sol";

/**
 * @dev This is the contract that takes care of the accounting of different users
 * We make use of soulbound tokens for those users who commit fraud as decided by the group 
 * invite tokens called Planetary are issued by the guild, keeping the same invite tokens can lead to better credit access
*/

contract KittyPartyAccountant is ERC1155Upgradeable, AccessControlUpgradeable, PausableUpgradeable, ERC1155BurnableUpgradeable {
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint8 public constant KITTYPARTYRECEIPT = 0; //ERC 20 DAI receipt which can be claimed from treasury
    uint8 public constant PLANETARY = 1; // DAO approved kreator check
    uint8 public constant STELLAR = 2; // DAO approved kreator check
    uint8 public constant GALACTIC = 3; // DAO approved kreator check
    uint8 public constant KREATOR = 4; // participation NFT used for airdrops
    uint8 public constant HARKONNENS = 5; // blacklist some kreators in case of sybil attacks
    uint8 public constant SPACINGGUILD = 6; // Members of the banking guild

    address public daoAddress;
    address public factoryContract;
    address public treasuryContract;

    uint256 constant decimals = 10 ** 18;

    bool private _initialized;

    event KPReceiptIssued(address kitten, address kittyparty, uint256 amountIssued);
    event CompletionBadgesMinted(address kitten, address kittyparty);

    function initialize(address _daoAddress)  initializer public {
        __ERC1155_init("");
        __ERC1155Burnable_init();
        daoAddress = _daoAddress;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(DEFAULT_ADMIN_ROLE, _daoAddress);
        _setupRole(URI_SETTER_ROLE, _daoAddress);
        _setupRole(PAUSER_ROLE, _daoAddress);
        _setupRole(MINTER_ROLE, _daoAddress);
    }

    function __KittyPartyAccountant_init(address _factoryContract) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        require(!_initialized, "Contract is already initialized");
        factoryContract = _factoryContract;
        _setupRole(DEFAULT_ADMIN_ROLE, _factoryContract);
        _mint(msg.sender, PLANETARY, 20, "");// one to the deployer
        _mint(daoAddress, PLANETARY, 10**18, "");// additional emissions on winning
        _mint(daoAddress, STELLAR, 10**12, "");
        _mint(daoAddress, GALACTIC, 10**9, "");
        _mint(daoAddress, HARKONNENS, 10**6, "");
        _mint(daoAddress, SPACINGGUILD, 10**6, "");
        _initialized = true;
    }

    function mintToKittens(
        address litterAddress, 
        address kittyParty, 
        uint256[] memory kittenIndexes, 
        uint256[] memory amountToSent
    ) 
        external 
        onlyRole(MINTER_ROLE)
    {
        bytes memory getList = abi.encodeWithSignature("getList(address)", kittyParty);
        (bool success, bytes memory kittensList) = address(litterAddress).staticcall(getList);
        require(success, "GE");
        (IKittens.Kitten[] memory kittens_) = abi.decode(kittensList, (IKittens.Kitten[]));
        uint256[] memory tokenTypes = new uint256[](2);
        uint256[] memory tokenAmounts = new uint256[](2);
        tokenTypes[0] = 0;
        tokenTypes[1] = 1;
        
        tokenAmounts[1] = 1;
        for (uint i = 0; i < kittenIndexes.length; i++) {
            IKittens.Kitten memory localKitten = kittens_[kittenIndexes[i]];
            tokenAmounts[0] = amountToSent[i];
            mintBatch(localKitten.kitten, tokenTypes, tokenAmounts, ""); //receipt and planetary emissions
            emit KPReceiptIssued(localKitten.kitten, kittyParty, amountToSent[i]);
        }
    }

    function setupMinter(address kittyParty)
        external 
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns(bool minterSet)
    {
        grantRole(MINTER_ROLE, kittyParty);
        //Give approval to the child Contract to move factory tokens
        setApprovalForAll(kittyParty,true);
        return true;
    }

    function setTreasury(address _treasuryContract)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _revokeRole(MINTER_ROLE, treasuryContract);
        treasuryContract = _treasuryContract;
        grantRole(MINTER_ROLE, _treasuryContract);
    }

    function setFactory(address _factoryContract)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _revokeRole(DEFAULT_ADMIN_ROLE, factoryContract);
        factoryContract = _factoryContract;
        grantRole(DEFAULT_ADMIN_ROLE, factoryContract);
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
        //Non transferabble Harkonnen
        for (uint i=0; i < ids.length; i++) {
            require(i != 5, "Cannot transfer Harkonnen");
        }

        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}