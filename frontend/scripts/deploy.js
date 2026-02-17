const hre = require("hardhat");

async function main() {
  console.log("Deploying MementoProofRegistry...");

  // Deploy the contract
  const MementoProofRegistry = await hre.ethers.getContractFactory("MementoProofRegistry");
  const mementoProofRegistry = await MementoProofRegistry.deploy();

  await mementoProofRegistry.waitForDeployment();

  const contractAddress = await mementoProofRegistry.getAddress();
  console.log("MementoProofRegistry deployed to:", contractAddress);

  // Verify deployment
  console.log("Deployment verified!");
  console.log("Transaction hash:", mementoProofRegistry.deploymentTransaction().hash);

  // Save contract address and ABI for frontend
  const fs = require("fs");
  const contractInfo = {
    address: contractAddress,
    abi: require("../artifacts/contracts/MementoProofRegistry.sol/MementoProofRegistry.json").abi,
  };

  // Create frontend contract file
  const frontendContractDir = "../src/contracts";
  if (!fs.existsSync(frontendContractDir)) {
    fs.mkdirSync(frontendContractDir, { recursive: true });
  }

  fs.writeFileSync(
    `${frontendContractDir}/MementoProofRegistry.json`,
    JSON.stringify(contractInfo, null, 2)
  );

  console.log("Contract info saved to frontend!");
  console.log("Ready for frontend integration!");

  // Example of how to interact (for testing)
  console.log("\nExample usage:");
  console.log(`const contract = new ethers.Contract("${contractAddress}", abi, signer);`);
  console.log("await contract.createProof(fileHash, metadataHash);");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
