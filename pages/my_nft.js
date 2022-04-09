import web3Modal from 'web3Modal';
import { nftAddress, nftmarketAddress } from '../.config.js';
import NFT from '../artifacts/contracts/TheNFT.sol/NFT.json';
import NFTMarket from '../artifacts/contracts/NFTMarketPlace.sol/NFTMarket.json'
import axios from 'axios';
import { useState,useEffect } from 'react';
import {ethers} from 'ethers'

// Next UI component
const UserNft = () => {
    const [nft, setNft] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyNft();
    },[])

    async function fetchMyNft() {
        // connect user to their wallet and get the signer from the provider
        const wallet_instance = new web3Modal();
        const connected = await wallet_instance.connect(0);
        const provider = new ethers.providers.Web3Provider(connected);
        const signer = provider.getSigner();

        // create an instance of your contracts
        const nftContract = new ethers.Contract(nftAddress, NFT.abi, provider);
        const marketContract = new ethers.Contract(nftmarketAddress, NFTMarket.abi, signer);

        // fetch the user purchased NFT from solidity
        const data = await marketContract.getMyNft();

        const items = await Promise.all(
            data.map(async (item) => {
                const tokenURI = await nftContract.tokenURI(item.tokenId)
                const meta = await axios({ method: 'GET', url: tokenURI });
                const price = ethers.utils.formatUnits(item.price.toString(), 'ether');
                let update = {
                    price,
                    owner: item.ownerAddress,
                    seller: item.sellerAddress,
                    name: meta.data.name,
                    image: meta.data.image
                };
            return update;
            })
        );
        console.log("My NFT",items)
        if (items != null) {
            setNft(items);
            setLoading(false);
       }
    }

    if (nft.length == 0 && loading) {
        return (
            <div>
                <h1>No Purchased NFT YET !!!</h1>
            </div>
        )
    }

    return (
        <div>
            <div>
                {nft && nft.map((item,i) => {
                    return (
                        <div key={i}>
                            <img src={item.image} width={270} height={270} />
                            <h4>Name: {item.name}</h4>
                            <h4>Price: {item.price}</h4>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default UserNft;