// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// openzeppelin imports
import "@openzeppelin/contracts/token/ERC721/ERC721";  // still the ERC721 standard
import "@openzeppelin/contracts/utils/Counters.sol"; // Provides the utility from opensepplin for incrementation like id incrementation
import "openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarket is ReentrancyGuard{
    using Counters for Counters.Counter;
    Counters.Counter private _itemId;  // keep count of the items created
    Counters.Counter private _itemSold; // keep count of the items solidity

    // address of the person deploying or interacting with the market
    address payable owner; // address of the owner 
    // price a person pays for listing on the market
    uint256 listingPrice = 0.25 ether;
    // set the owner of the contract
    constructor(){
        owner = payable(msg.sender); // set the owner to the creator of the contract or caller of the contrat
    }

    // creating the marketItem object
    struct MarketItem{
        uint256 _itemId; // the id of the item
        uint256 _itemSold; // the id of the item sold
        bool sold; // know if the item is sold already
        address payable owner; // address of the owner
        address payable seller; // address of the person selling
        address nftContract; // address of our nftContract
        uint256 price; // price of the item
    }

    // mapping an id to each marketItem created
    mapping(uint256=>MarketItem) private Id_To_MarketItem;
    
    // call the event each time a marketitem is created
    event WhenMarketItemCreated(
        uint256 price;
        uint256 indexed _itemId;
        uint256 indexed _itemSold;
        address payable ownerAddress;
        address payable sellerAddress;
        address indexed nftContractAddress;
        bool sold;
    )

    // utility function to return the listing price
    function getListingPrice() public view return uint256{
        return listingPrice; // return the listing price
    }
}