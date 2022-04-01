const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('NftMarketPlace', () => {
  // group the test cases
  it('TestCase should deploy , create and execute marketsale', async () => {
    // First get a reference to the Contract (marketsale contract)
    const NFTMarket = await ethers.getContractFactory('NFTMarket');
    // we deploy the market
    const nftmarketContract = await NFTMarket.deploy();
    // then wait for the market to be deployed
    await nftmarketContract.deployed();
    // we get the address it was deployed to which would be a default ethers fake ownerAddress
    const nftMarketContractAddress =  nftmarketContract.address;

    // create an object instance of the NFT contract and deploy it to.
    const NFT = await ethers.getContractFactory('NFT');
    const nftContract = await NFT.deploy(nftMarketContractAddress);
    await nftContract.deployed();
    const nftContractAddress =  nftContract.address;

    // Interaction with the Contracts interface
    let listingPrice = await nftmarketContract.getListingPrice();
    listingPrice = listingPrice.toString(); // convert the price to string

    // The itemPrice is the Price of the NFT
    const itemPrice =  ethers.utils.parseUnits('100', 'ether');

    // we create our first nft tokens using the nft contract
    await nftContract.createToken('https://www.hackingNasaWithGift.com'); //first token
    await nftContract.createToken('https://www.collabwithjohn2pm.com'); // second token
    await nftContract.createToken('EminemsAccountPassword'); //third token

    // List the nft tokens on the Market
    await nftmarketContract.createMarketItem(itemPrice, nftContractAddress, 1, { value: listingPrice }); // the value is msg.value
    await nftmarketContract.createMarketItem(itemPrice, nftContractAddress, 2, { value: listingPrice });
    await nftmarketContract.createMarketItem(itemPrice, nftContractAddress, 3, { value: listingPrice });

    // get accounts for the buyers skipping the first one which is the contract Address or address the contract is deployed on.
    const [_, buyer1, buyer2, buyer3, buyer4] = await ethers.getSigners(); // gets a list of fake addresses for

    // purchase an nft using buyer2, buyer2 becomes the msg.sender
    await nftmarketContract.connect(buyer2).MarketSale(nftContractAddress, 1, { value: itemPrice });

    // call the util function to show all the created items stats (sold or unsold)
    let allItems  = await nftmarketContract.fetchMarketItems();

    allItems = await Promise.all(allItems.map(async item => {
      const tokenUri = await nftContract.tokenURI(item.tokenId);
      let newitem = {
        price: item.price.toString(),
        tokenId: item.tokenId.toString(),
        seller: item.sellerAddress,
        owner: item.ownerAddress,
        tokenUri,
      }
      return newitem;
    }))

    console.log(allItems);
  })
})
