import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import web3Modal from "web3Modal";

// The addresses of the deployed contract files
import { nftAddress, nftmarketAddress } from "../.config";
// The ABI of the Contracts
import MarketContractJson from "../artifacts/contracts/NFTMarketPlace.sol/NFTMarket.json";
import NftContractJson from "../artifacts/contracts/TheNFT.sol/NFT.json";

export default function Home() {
  // States to store loading and fetched-nfts
  const [important, setImportant] = useState({
    nfts: [],
    loaded: "not-loaded",
  });

  // call the fetchNFTs function at the first rendering of the page
  useEffect(() => {
    fetchNfts();
  }, []);

  // function that loads the nfts
  const fetchNfts = async () => {
    // provider is a connection to the ethereum network
    const provider = new ethers.providers.JsonRpcProvider();
    // connect to the ethereumnode to create an instance of the nftContract
    const nftContract = new ethers.Contract(
      nftAddress,
      NftContractJson.abi,
      provider
    );
    //  connect to the ethereumnode to create an instance of nftMArket contract
    const nftmarketContract = new ethers.Contract(
      nftmarketAddress,
      MarketContractJson.abi,
      provider
    );
    // fetch all the created items from the marketcontract
    const data = await nftmarketContract.fetchMarketItems();

    // modified items
    const items = await Promise.all(
      data.map(async (item) => {
        // tokenURI to use in ipfs to fetch the meta data of the token
        const tokenUri = await nftContract.tokenURI(item.tokenId);
        // fetch the meta data of the token using the tokenURI
        const meta = await axios.get(tokenUri);
        // convert  from bignumber to a smaller number
        const price = ethers.utils.formatUnits(item.price.toString(), "ether");
        let appropriateItem = {
          price,
          tokenId: item.tokenId.toNumber(),
          seller: item.sellerAddress,
          owner: item.ownerAddress,
          image: meta.data.image,
          name: meta.data.name,
          descriptons: meta.data.descripton,
        };

        return appropriateItem;
      })
    );
    setImportant({ nfts: items, loaded: "loaded" });
  };

  const buyNFT = async (nft) => {
    // create a web3Modal that allows user to connect to their wallets
    const web3Modal = new web3Modal();
    const web3Modal_instance = await web3Modal.connect();
    const provider = new ethers.providers.web3Modal(web3Modal_instance);
    const signer = await provider.getSigner();

    // connect to the nftMarketcontract
    const nftMarketContract = new ethers.Contract(
      nftmarketAddress,
      MarketContractJson.abi,
      signer
    );

    // returns a bignumber representation of the values
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether"); // get the price of the nft user wants to purchase

    // Create a marketsale
    const transaction = await nftMarketContract.MarketSale(
      nftAddress,
      nft.tokenId,
      { value: price }
    );
    // wait for transaction to complete
    await transaction.wait();
    // call the function to load again and only show the unsold nfts
    fetchNfts();
  };

  // CHECK IF THE nftS ARRAY IS NOT EMPTY
  if (important.loaded == "loaded" && important.nfts.length == 0) {
    return (
      <div>
        <h1>No Items in the MarketPlace. Create an Item</h1>
      </div>
    );
  }

  return (
    <div>
      <section className="NFT_body">
        <div>
          {important.nfts.map((item,id) => {
            return (
              <div className={styles.card_container} key={id}>
                <div><img src={item.image}/></div>
                <div>
                  <h4>Name: {item.name}</h4>
                  <h4>Description: {item.descriptons}</h4>
                  <h4>Price: {item.price}</h4>
                </div>
                <div>
                  <button type="button" onClick={()=>buyNFT(item)}>Buy</button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
