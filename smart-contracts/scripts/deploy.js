async function main() {
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY || "";
  const normalizedPrivateKey = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;
  if (!/^https?:\/\/.+/.test(process.env.SEPOLIA_RPC_URL || "") || !/^0x[0-9a-fA-F]{64}$/.test(normalizedPrivateKey)) {
    throw new Error("Set SEPOLIA_RPC_URL and a valid 64-hex-character DEPLOYER_PRIVATE_KEY in smart-contracts/.env before deploying.");
  }

  const Factory = await ethers.getContractFactory("CharityChain");
  const contract = await Factory.deploy();
  await contract.waitForDeployment();
  console.log("CharityChain deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
