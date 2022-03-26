require("@nomiclabs/hardhat-waffle");

// Configure dotenv for accessing environment variables and
const dotenv = require("dotenv");
dotenv.config();

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${process.env.projectId}`,
      accounts: [`${process.env.DrDavid_P_A}`],
    },
    mainnet: {
      url: `https://polygon-mumbai.infura.io/v3/${process.env.projectId}`,
      accounts: [`${process.env.DrDavid_P_A}`],
    },
  },
};
