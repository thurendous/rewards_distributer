//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {SafeMathUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {MerkleProofUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol";
import {AbstractMerkleDistributer} from "./AbstractMerkleDistributer.sol";

// WARNING: This contract is working-in-progress status. Never use this on production yet.
contract VersioningMerkleDistributer is AbstractMerkleDistributer {
    using SafeMathUpgradeable for uint256;

    struct Detail {
        mapping(address => bool) hasClaimed;
        bytes32 merkleRoot;
    }

    IERC20 private token;
    uint256 public currentVersion; // default value is 0
    mapping(uint256 => Detail) public versionToDetailMap;

    function initialize(address initialToken, bytes32 initialMerkleRoot)
        public
        initializer
    {
        AbstractMerkleDistributer.initialize();

        token = IERC20(initialToken);
        currentVersion = currentVersion.add(1); // Version starts from 1
        versionToDetailMap[currentVersion].merkleRoot = initialMerkleRoot;
    }

    function setMerkleRoot(bytes32 newMerkleRoot)
        public
        onlyAdminOrModeratorRoles
    {
        currentVersion = currentVersion.add(1);
        versionToDetailMap[currentVersion].merkleRoot = newMerkleRoot;
    }

    function setCurrentVersion(uint256 nextVersion)
        public
        onlyAdminOrModeratorRoles
    {
        require(nextVersion > 0, "Invalid version info");

        currentVersion = nextVersion;
    }

    function claim(
        address recipient,
        uint256 amount,
        bytes32[] calldata proof
    ) external override nonReentrant {
        require(msg.sender == recipient, "Cannot claim reward of others.");

        (bool isClaimable, string memory message) = getIsClaimable(
            currentVersion,
            recipient,
            amount,
            proof
        );
        require(isClaimable, message);

        versionToDetailMap[currentVersion].hasClaimed[recipient] = true;
        require(token.transfer(recipient, amount), "Transfer failed");

        emit Claim(recipient, amount);
    }

    function getIsClaimableOnCurrentVersion(
        address recipient,
        uint256 amount,
        bytes32[] calldata proof
    ) public view returns (bool, string memory) {
        return getIsClaimable(currentVersion, recipient, amount, proof);
    }

    function getIsClaimable(
        uint256 version,
        address recipient,
        uint256 amount,
        bytes32[] calldata proof
    ) public view returns (bool, string memory) {
        if (versionToDetailMap[version].hasClaimed[recipient]) {
            return (false, "Recipient already claimed");
        }

        bytes32 leaf = keccak256(abi.encodePacked(recipient, amount));
        bool isValidLeaf = MerkleProofUpgradeable.verify(
            proof,
            versionToDetailMap[version].merkleRoot,
            leaf
        );
        if (!isValidLeaf) {
            return (false, "Not a valid leaf");
        }

        return (true, "Reward is claimable");
    }
}
