// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Authenticator {
    address public owner;
    mapping(address => string[]) public ipAddresses;

    event IPAddressStored(address indexed user, string ipAddress);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function");
        _;
    }

    function storeIPAddress(string memory ipAddress) public {
        ipAddresses[msg.sender].push(ipAddress);
        emit IPAddressStored(msg.sender, ipAddress);
    }

    function getStoredIPAddresses() public view returns (string[] memory) {
        return ipAddresses[msg.sender];
    }
}
