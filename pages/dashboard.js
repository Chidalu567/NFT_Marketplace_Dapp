import { ethers } from 'ethers';
import web3Modal from 'web3Modal';
import axios from 'axios';
import { nftAddress, nftmarketAddress } from '../.config.js';
import NFT from '../artifacts/contracts/TheNFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarketPlace.sol/NFTMarket.json'
import { useState, useEffect } from 'react';

// Next Ui component
const Dashboard = () => {
    const [nfts, setNfts] = useState({ soldNft: [], createdNft: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        main();
    }, []);

    async function main(){
        const wallet_instance = new web3Modal();
        const connected = await wallet_instance.connect();
        const provider = new ethers.providers.Web3Provider(connected);
        const signer = provider.getSigner();

        // create an instance of the contract
        const nft = new ethers.Contract(nftAddress, NFT.abi, provider);
        const market = new ethers.Contract(nftmarketAddress, Market.abi, signer);

        // fetch the userCreated NFTs from the backend
        const data = await market.getUserCreatedNft();
        const created_nfts = await Promise.all(
            data.map(async (item) => {
                const tokenURI = await nft.tokenURI(item.tokenId);
                const meta = await axios.get(tokenURI);
                const price = ethers.utils.formatUnits(item.price.toString(), 'ether');
                let update = {
                    price,
                    name: meta.data.name,
                    description: meta.data.description,
                    image: meta.data.image,
                    seller: item.sellerAddress,
                    owner: item.ownerAddress
                };
                return update;
            })
        );
        // filter the array for objects which key i.sold is true
        const sold_nfts = created_nfts.filter(i => i.sold);
        setNfts({...nfts,createdNft: created_nfts,soldNft:sold_nfts});
    }
    return (
        <div>
            <div>
                {nfts.createdNft.map((param,i) => {
                    return (
                        <div key={i}>
                            <img src={param.image} width={270} height={270}/>
                            <h4>Name: {param.name}</h4>
                            <h4>Price : { param.price}</h4>
                        </div>
                    )
                })}
            </div>
        </div>
    )
};

export default Dashboard;