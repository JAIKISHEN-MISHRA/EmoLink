const { Sepolia } = require("@thirdweb-dev/chains");
const { ThirdwebSDK } = require("@thirdweb-dev/sdk");

// Create instances of ThirdwebSDK with Sepolia provider
const Ip = new ThirdwebSDK(Sepolia, {
    clientId: "5b22d7ecdc64decc22d23cfda2e48af4",
});

const RS = new ThirdwebSDK(Sepolia, {
    clientId: "5b22d7ecdc64decc22d23cfda2e48af4",
});

// Function to store IP address
async function storeIPAddress(ipAddress, Ipcontract) {
    try {
        console.log("Attempting to store IP address:", ipAddress);
        await Ipcontract.writeContract.storeIPAddress(ipAddress);
        console.log("IP address stored successfully:", ipAddress);
    } catch (error) {
        console.error("Error storing IP address:", error);
    }
}

// Function to get stored IP addresses
async function getStoredIPAddresses(Ipcontract) {
    try {
        console.log("Attempting to get stored IP addresses...");
        const storedIPs = await Ipcontract.readContract.getStoredIPAddresses();
        console.log("Stored IP addresses:", storedIPs);
    } catch (error) {
        console.error("Error getting stored IP addresses:", error);
    }
}

// Get contracts asynchronously
async function getContracts() {
    try {
        console.log("Attempting to get contracts...");
        // Get IP contract
        const Ipcontract = await Ip.getContract("0x66DDC61C1D226557B96682D7487AE5BeaC762A9d");
        console.log("IP Contract:", Ipcontract);

        // Get Reputation System contract
        const RScontract = await RS.getContract("0x7875A7cc2aF0FBb9A1F920dA53a6127CeD2F5b4a");
        console.log("Reputation System Contract:", RScontract);

        return Ipcontract;
    } catch (error) {
        console.error("Error getting contracts:", error);
        return null;
    }
}

// Call the function to get contracts
getContracts()
    .then((Ipcontract) => {
        if (Ipcontract) {
            storeIPAddress("192.168.1.1", Ipcontract);
            getStoredIPAddresses(Ipcontract);
        } else {
            console.error("Failed to retrieve IP contract.");
        }
    })
    .catch((error) => {
        console.error("Error:", error);
    });
