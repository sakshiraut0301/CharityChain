# CharityChain setup

## 1. Configure and start MongoDB API

Copy `backend/.env.example` to `backend/.env`, set `MONGODB_URI` and a long `JWT_SECRET`, then run:

```powershell
cd backend
npm run dev
```

The API is available at `http://localhost:5000/api`. Uploaded files currently return safe placeholder metadata (`pending-ipfs-upload://...`). Replace `filesToMetadata` in `backend/src/middleware/upload.js` with a Pinata/IPFS upload service before production.

## 2. Deploy the contract to Sepolia

Copy `smart-contracts/.env.example` to `smart-contracts/.env` and set a Sepolia RPC URL plus a funded test-wallet private key. Never commit this file.

```powershell
cd smart-contracts
npm test
npm run deploy:sepolia
```

Copy the printed contract address.

## 3. Configure and start the frontend

Copy `frontend/.env.example` to `frontend/.env` and set `VITE_CONTRACT_ADDRESS` to the deployed address. Then run:

```powershell
cd frontend
npm run dev
```

Use MetaMask on the Sepolia test network. For an on-chain organization campaign, enter an ETH target when launching it. The organization must first be verified on-chain by calling `verifyOrganization(organizationWallet, true)` from the admin wallet; the web admin approval remains the off-chain verification record.

## Production notes

- Replace local-storage demo reads/writes with the API calls in `frontend/src/lib/api.js`.
- Store documents and utilization proofs on IPFS, saving their CID/URI in MongoDB and campaign metadata.
- Index `DonationMade` contract events in a backend worker to reconcile on-chain donations with MongoDB analytics.
- Do not store passwords, private keys, or JWT secrets in the client or source control.
