// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol"; // ERC721 storage contract from openzepplin
import "@openzeppelin/contracts/utils/Counters.sol"; // Provides the utility from opensepplin for incrementation like id incrementation

// openzepplin enables use to optimize coding smartcontracts by providing help to bolier plate codes

contract NFT is ERC721URIStorage { // inheritance from parent class
    using Counters for Counters.Counter; // we get the Counters.Counter from the Counter contract
    Counters.Counter private _tokenIds; // This is a private variable for storing the incremented tokenids each time a token is minted
    address contractAddress; // the address of the marketplace address

    constructor(address MarketPlaceAddress) ERC721("ChiGif Tokens","CIGI"){
        contractAddress = MarketPlaceAddress; // set the contract address to the value of marketplace address
    }

    function createToken(string memory tokenUri) return (uint256){
        _tokenIds.increment(); // Each time the function is called increment the token id 
        uint256 newTokenId = _tokensIds.current(); // This keeps track of the current token Id, or stores the token Id value
       // We mint the token passing the caller of the function address (msg.sender) and id of the token to mint
        _mint(msg.sender,newTokenId); // We mint the token
       //  We set the Token uri of the token
        _setTokenURI(newTokenId,tokenURI); // set token uri
        // Set approval for the contract address which is the marketplace address
        setApprovalForAll(contractAddress,true); // set Approval for all, this gives the marketplace right to change ownership
        return newTokenId; // return the newTokenId or the current Id
    }
}
