require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const rpcUrl = process.env.SEPOLIA_RPC_URL;
const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
const normalizedPrivateKey = privateKey && !privateKey.startsWith("0x") ? `0x${privateKey}` : privateKey;
const hasDeploymentCredentials =
  /^https?:\/\/.+/.test(rpcUrl || "") &&
  /^0x[0-9a-fA-F]{64}$/.test(normalizedPrivateKey || "");

module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: hasDeploymentCredentials ? rpcUrl : "",
      accounts: hasDeploymentCredentials ? [normalizedPrivateKey] : [],
    },
  },
};
