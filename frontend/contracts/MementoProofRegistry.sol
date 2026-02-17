// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MementoProofRegistry
 * @author Memento
 *
 * @notice
 * Immutable registry that proves:
 *  - WHO created a file
 *  - WHEN it existed
 *  - WHAT exact file fingerprint was used
 *
 * Designed to be:
 *  - Gas-efficient
 *  - Secure
 *  - Indexable
 *  - Future-extensible
 */
contract MementoProofRegistry {
    /*//////////////////////////////////////////////////////////////
                               ERRORS
    //////////////////////////////////////////////////////////////*/

    error ProofAlreadyExists();
    error InvalidHash();
    error ProofNotFound();

    /*//////////////////////////////////////////////////////////////
                               STRUCTS
    //////////////////////////////////////////////////////////////*/

    struct Proof {
        address creator;      // wallet that sealed proof
        uint64 timestamp;     // block timestamp (fits in 64 bits → gas save)
        bytes32 metadataHash; // optional IPFS / JSON metadata hash
    }

    /*//////////////////////////////////////////////////////////////
                               STORAGE
    //////////////////////////////////////////////////////////////*/

    /// @notice fileHash => Proof
    mapping(bytes32 => Proof) private _proofs;

    /// @notice creator => number of proofs created
    mapping(address => uint256) public creatorProofCount;

    /*//////////////////////////////////////////////////////////////
                               EVENTS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice emitted when a new proof is sealed
     * indexed fields allow fast querying from explorers / The Graph
     */
    event ProofCreated(
        bytes32 indexed fileHash,
        address indexed creator,
        uint64 timestamp,
        bytes32 metadataHash
    );

    /*//////////////////////////////////////////////////////////////
                          PROOF CREATION
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Seal a cryptographic proof for a file hash
     * @param fileHash SHA-256 hash of the file
     * @param metadataHash optional hash of metadata JSON/IPFS
     */
    function createProof(bytes32 fileHash, bytes32 metadataHash) external {
        if (fileHash == bytes32(0)) revert InvalidHash();
        if (_proofs[fileHash].timestamp != 0) revert ProofAlreadyExists();

        uint64 ts = uint64(block.timestamp);

        _proofs[fileHash] = Proof({
            creator: msg.sender,
            timestamp: ts,
            metadataHash: metadataHash
        });

        unchecked {
            creatorProofCount[msg.sender]++;
        }

        emit ProofCreated(fileHash, msg.sender, ts, metadataHash);
    }

    /*//////////////////////////////////////////////////////////////
                          VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /**
     * @notice Get proof data for a file hash
     */
    function getProof(bytes32 fileHash)
        external
        view
        returns (Proof memory)
    {
        Proof memory p = _proofs[fileHash];
        if (p.timestamp == 0) revert ProofNotFound();
        return p;
    }

    /**
     * @notice Check if proof exists (gas-cheap for frontend)
     */
    function proofExists(bytes32 fileHash) external view returns (bool) {
        return _proofs[fileHash].timestamp != 0;
    }

    /**
     * @notice Get creator & timestamp only (cheaper read)
     */
    function getBasicProof(bytes32 fileHash)
        external
        view
        returns (address creator, uint64 timestamp)
    {
        Proof memory p = _proofs[fileHash];
        if (p.timestamp == 0) revert ProofNotFound();
        return (p.creator, p.timestamp);
    }
}
