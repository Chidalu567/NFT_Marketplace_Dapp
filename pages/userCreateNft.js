// ALl Next import
import { useRouter } from 'next/router'
import Image from 'next/image'
// Import the contractJsonAbi
import NFT from '../artifacts/contracts/TheNFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarketPlace.sol/NFTMarket.json';
// import the address gotten after deploying script to local node
import { nftmarketAddress,nftAddress } from '../.config';
// import ipfsHttpClient
import {create as ipfsHttpClient} from 'ipfs-http-client'
import { useState } from 'react';
// All clientSide integration interaction with Smartcontract
import web3Modal from 'web3modal'
import { ethers } from 'ethers';



// create an ipfs client instance
const client = ipfsHttpClient('https://infura-ipfs.io:5001/api/v0');



// Next UI component to create NFT
const CreatePage = () => {
    const [userData, setUserData] = useState({ name: '', description: '', price: '' })
    const [fileUrl, setFileUrl] = useState(null);
    const router = useRouter();

    // function to add the file to ipfs and update the fileUrl to the url of ipfs
    const handleChangeFile = async (e) => {
        // get the file user uploaded
        const fileUploaded = e.target.files[0];

        try {
            // add the file to ipfs
            let uploadedToIpfs = await client.add(fileUploaded); // add file uploaded to ipfs
            // link to where the file is stored
            const url_Of_Uploaded_File = `https://infura-ipfs.io/ipfs/${uploadedToIpfs.path}`;
            console.log("path_to_uploaded_file :", url_Of_Uploaded_File);
            // update the state with the file
            setFileUrl(url_Of_Uploaded_File);
        } catch (err) {
            console.log(err);
        }

    }

    // function to Call when user clicks on the submit button
    // adds all the datas to ipfs and calls the MarketSale function
    const handleSubmit =async () => {
        if (userData) {
            // convert the data to string
            const data = JSON.stringify({ name: userData.name, description: userData.description, price: userData.price, image: fileUrl });
            try {
                // upload the data to ipfs
                const uploaded_data_to_ipfs = await client.add(data);
                const url_to_nft_data = `https://infura-ipfs.io/ipfs/${uploaded_data_to_ipfs.path}`;
                console.log("url_to_nft_data:",url_to_nft_data);
                createItem(url_to_nft_data);
            } catch (e) {
                console.log(e)
            }

        }
    }

    // Main function
    async function createItem(url) {
        const web3Modal_instance = new web3Modal();
        const connected_web3Modal = await web3Modal_instance.connect();
        const provider = new ethers.providers.Web3Provider(connected_web3Modal);
        const signer = provider.getSigner();

        // create an instance of the NFT contract or connect to the contract (NFT)
        const nftContract = new ethers.Contract(nftAddress, NFT.abi, signer);
        // create and wait for the transaction of creating tokens
        const transaction_nft = await nftContract.createToken(url);
        let tx = await transaction_nft.wait();

        // get the Price user spent on creating NFT from the form aND CONVERT TO uints
        const price = ethers.utils.parseUnits(userData.price, 'ether'); // cvt the price to ether for the contract

        // connect to the MarketContract
        const marketContract = new ethers.Contract(nftmarketAddress, Market.abi, signer);
        // get the listing Price
        let listingPrice = await marketContract.getListingPrice();
        listingPrice = listingPrice.toString();
        // get the token tokenId
        let event = tx.events[0]; // select the first event
        let value = event.args[2]; // get the tokenID
        // important tokenId of the nft
        const tokenId = value.toNumber(); // cvt to number

        // create marketsale
        const transaction_market = await marketContract.createMarketItem(price, nftAddress, tokenId, { value: listingPrice });
        await transaction_market.wait();

        // send user back to HomePage
        router.push('/');
    };

    return (
        <div>
            <div>
                <form>
                    <input type="text" name="name" id="name" placeholder="Name" onChange={(e)=>{setUserData({...userData,name: e.target.value})}}/>
                    <input type="text" name="description" id="des" placeholder="Description" onChange={(e)=>{setUserData({...userData,description: e.target.value})}}/>
                    <input type="number" name="price" id="price" placeholder="Price" onChange={(e)=>{setUserData({...userData,price:e.target.value})}}/>
                    <input type="file" name="file" onChange={handleChangeFile} />
                    {fileUrl && <img src={fileUrl} width={270} height={270}/>}
                    <button type="button" onClick={handleSubmit}> Submit</button>
                </form>
            </div>
    </div>
)
};

// export for external file to use
export default CreatePage;