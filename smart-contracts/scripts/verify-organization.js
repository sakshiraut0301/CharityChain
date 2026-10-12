async function main() {
  const organization = process.env.ORGANIZATION_ADDRESS;
  if (!/^0x[0-9a-fA-F]{40}$/.test(organization || "")) {
    throw new Error("Set ORGANIZATION_ADDRESS to the organization's MetaMask address.");
  }

  const Factory = await ethers.getContractFactory("CharityChain");
  const contract = Factory.attach(process.env.CHARITYCHAIN_CONTRACT_ADDRESS);
  const transaction = await contract.verifyOrganization(organization, true);
  const receipt = await transaction.wait();
  if (receipt.status !== 1) throw new Error("Organization verification transaction was not confirmed.");
  console.log(`Organization approved: ${organization}`);
  console.log(`Transaction: ${transaction.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
