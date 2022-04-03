const hre = require("hardhat");

async function main() {

  // We get the contract to deploy
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  // deploy the contract
  const nftMarket = await NFTMarket.deploy();
  // wait for contract to deploy
  await nftMarket.deployed();

  console.log("NFTMarket Contract deployed to:", nftMarket.address);

  // We get the NFT contract to deploy
  const NFT = await hre.ethers.getContractFactory('NFT');
  // deploy contract to marketplace address
  const nft = await NFT.deploy(nftMarket.address);
  // wait for contract to deploy
  await nft.deployed();

  console.log(`NFT Contract deployed to:${nft.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
