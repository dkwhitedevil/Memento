const hre = require("hardhat");

async function main() {
  console.log("Deploying MementoProofRegistry...");

  // Get the contract factory
  const MementoProofRegistry = await hre.ethers.getContractFactory("MementoProofRegistry");
  
  // Deploy the contract
  const mementoProofRegistry = await MementoProofRegistry.deploy();

  // Wait for deployment to complete
  await mementoProofRegistry.waitForDeployment();

  const contractAddress = await mementoProofRegistry.getAddress();
  console.log("MementoProofRegistry deployed to:", contractAddress);

  // Get network information
  const network = await hre.ethers.provider.getNetwork();
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());

  // Get deployment transaction details
  const deploymentTx = mementoProofRegistry.deploymentTransaction();
  console.log("Deployment transaction hash:", deploymentTx?.hash);

  // Save contract address and ABI for frontend
  const fs = require("fs");
  const path = require("path");
  
  const contractInfo = {
    address: contractAddress,
    abi: require("../artifacts/contracts/MementoProofRegistry.sol/MementoProofRegistry.json").abi,
  };

  // Create frontend contract directory and file
  const frontendContractDir = path.join(__dirname, "../src/contracts");
  if (!fs.existsSync(frontendContractDir)) {
    fs.mkdirSync(frontendContractDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(frontendContractDir, "MementoProofRegistry.json"),
    JSON.stringify(contractInfo, null, 2)
  );

  console.log("Contract info saved to frontend!");
  console.log("Ready for frontend integration!");

  // Save contract address to .env.local for frontend
  const envContent = `# Contract Address (filled after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}
`;

  fs.writeFileSync(path.join(__dirname, "../.env.local"), envContent);
  console.log("Contract address saved to .env.local");

  // Example usage output
  console.log("\n=== DEPLOYMENT SUCCESSFUL ===");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId.toString());
  console.log("Transaction Hash:", deploymentTx?.hash);
  console.log("\nFrontend Integration:");
  console.log(`const contract = new ethers.Contract("${contractAddress}", abi, signer);`);
  console.log("await contract.createProof(fileHash, metadataHash);");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
