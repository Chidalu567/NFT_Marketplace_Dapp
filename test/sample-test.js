const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('NftMarketPlace', () => {
  // group the test cases
  it('TestCase should deploy , create and execute marketsale', async () => {
    // First get a reference to the Contract (marketsale contract)
    const NFTMarket = await ethers.getContractFactory('NFTMarketPlace');
    // we deploy the market
    const nftmarket = await NFTMarket.deploy();
    // then wait for the market to be deployed
    await nftmarketContract.deployed();
    // we get the address it was deployed to which would be a default ethers fake ownerAddress
    const nftMarketContractAddress = await nftmarketContract.address;

    // create an object instance of the NFT contract and deploy it to.
    const NFT = await ethers.getContractFactory(TheNFT);
    const nftContract = await NFT.deploy();
    await nftContract.deployed();
    const nftContractAddress = await nftContract.address;

    // Interaction with the Contracts interface
    const listingPrice = await nftMarketContract_deployed.listingPrice;
    listingPrice = listingPrice.toString(); // convert the price to string

    // The itemPrice is the Price of the NFT
    const itemPrice = await ethers.utils.parseUnits('100', 'ether');

    // we create our first nft tokens using the nft contract
    await nftContract.createToken('https://www.hackingNasaWithGift.com'); //first token
    await nftContract.createToken('https://www.collabwithjohn2pm.com'); // second token
    await nftContract.createToken('EminemsAccountPassword'); //third token

    // List the nft tokens on the Market
    await marketContract.createMarketItem(itemPrice, nftContractAddress, 1, { value: "listingPrice" }); // the value is msg.value
    await marketContract.createMarketItem(itemPrice, nftContractAddress, 2, { value: "listingPrice" });
    await marketContract.createMarketItem(itemPrice, nftContractAddress, 3, { value: "listingPrice" });

    // get accounts for the buyers skipping the first one which is the contract Address or address the contract is deployed on.
    const [_, buyer1, buyer2, buyer3, buyer4] = await ethers.getSigners(); // gets a list of fake addresses for

    // purchase an nft using buyer2, buyer2 becomes the msg.sender
    await marketContract.connect(buyer2).MarketSale(nftContractAddress, 1, { value: "Price_of_Nft" });

    // call the util function to show all the created items stats (sold or unsold)
    const allItems = await marketContract.fetchMarketItems();

    console.log(allItems);

  })
})
