// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Fluffe is ERC721Enumerable, Ownable {

    using ECDSA for bytes;
    using ECDSA for bytes32;

    event URIAdded(string uri, uint256 index);
    event URIIndexSet(uint256 tokenId, uint256 index);

    string[] public uris;
    mapping(uint256 => uint256) public tokenURIIndices;

    constructor() ERC721("Fluffe", "FLF") {}

    function addURI(string memory uri) external onlyOwner {
        uris.push(uri);
        emit URIAdded(uri, uris.length - 1);
    }

    function mint(address to, uint256 tokenId, uint256 uriIndex, bytes memory authorizationSignature) external {

        bytes32 h = abi.encodePacked(msg.sender, tokenId, uriIndex).toEthSignedMessageHash();
        address authorizer = h.recover(authorizationSignature);
        require(authorizer == owner(), "not authorized");

        _mint(to, tokenId);
        tokenURIIndices[tokenId] = uriIndex;
        emit URIIndexSet(tokenId, uriIndex);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        uint256 uriIndex = tokenURIIndices[tokenId];
        return uris[uriIndex];
    }
}
