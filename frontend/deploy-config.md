# Deployment Configuration

To deploy the Memento contract, you need to set up environment variables:

## 1. Create .env.local file with:

```bash
# Base Sepolia Testnet Configuration
BASE_SEPOLIA_URL=https://sepolia.base.org
PRIVATE_KEY=your_private_key_here
BASESCAN_API_KEY=your_basescan_api_key_here
```

## 2. Get Testnet ETH:
- Visit Base Sepolia faucet: https://www.base.org/faucets
- Get testnet ETH sent to your wallet

## 3. Get Private Key:
- Export from MetaMask: Settings → Security & Privacy → Reveal Secret Phrase
- OR use a dedicated test wallet (recommended)

## 4. Get BaseScan API Key:
- Sign up at https://basescan.org/api-keys
- Create API key for contract verification

## 5. Deploy Commands:

```bash
# Compile contract
npx hardhat compile

# Deploy to Base Sepolia
npx hardhat run scripts/deploy.ts --network baseSepolia

# Verify contract (optional)
npx hardhat verify --network baseSepolia DEPLOYED_CONTRACT_ADDRESS
```

## 6. After Deployment:
- Contract address will be saved to .env.local automatically
- ABI will be updated in src/contracts/MementoProofRegistry.json
- Ready for frontend integration
