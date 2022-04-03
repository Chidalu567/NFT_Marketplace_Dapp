// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// openzeppelin imports
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";  // still the ERC721 standard
import "@openzeppelin/contracts/utils/Counters.sol"; // Provides the utility from opensepplin for incrementation like id incrementation
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarket is ReentrancyGuard{
    using Counters for Counters.Counter;
    Counters.Counter private _itemId;  // keep count of the items created
    Counters.Counter private _itemSold; // keep count of the items solidity

    // address of the person deploying or interacting with the market
    address payable owner; // address of the owner
    // price a person pays for listing on the market
    uint256 listingPrice = 0.025 ether;
    // set the owner of the contract
    constructor(){
        owner = payable(msg.sender); // set the owner to the creator of the contract or caller of the contrat
    }

    // creating the marketItem object
    struct MarketItem{
        uint256 price; // price of the item
        uint256 itemId; // the id of the item
        uint256 tokenId; // the Id of the token
        address payable ownerAddress; // address of the owner or whosoever bought the marketItem
        address payable sellerAddress; // address of the person selling the marketItem which is the address of the contract
        address nftContractAddress; // address of our nftContract
        bool sold; // know if the item is sold already
    }

    // mapping an id to each marketItem created
    mapping(uint256=>MarketItem) private Id_To_MarketItem;

    // call the event each time a marketitem is created
    event WhenMarketItemCreated(
        uint256 price,
        uint256 indexed itemId,
        uint256 indexed tokenId,
        address  ownerAddress,
        address  sellerAddress,
        address indexed nftContractAddress,
        bool sold
    );

    // utility function to return the listing price
    function getListingPrice() public view returns (uint256) {
        return listingPrice; // return the listing price
    }


    // Create MarketItem function.
    // This function creates the marketItem and assign the change of ownership power to the contract
    function createMarketItem (uint256 price, address nftContractAddress, uint256 tokenId) public payable nonReentrant {

       // validate that the price is greater than zero
        require(price > 0,"Your price must be greater than Zero");

        // validate that the sender of the contract sends a value so that it is also transferred to whosoever buys it
        require(msg.value == listingPrice,"The value must be equal to the listing Price");

        // Once the function is called we increment the tokenId so that we can mapp the marketItem created
        _itemId.increment();
        uint256 C_item_id = _itemId.current();
        Id_To_MarketItem[C_item_id] = MarketItem(
            price,
            C_item_id,
            tokenId,
            payable(address(0)),
            payable(msg.sender),
            nftContractAddress,
            false
        );

        // A statement that transfer the ownership of the NFT from contract to the buyer
        IERC721(nftContractAddress).transferFrom(msg.sender,address(this),tokenId);

        // emit the event
        emit WhenMarketItemCreated(
            price,
            C_item_id,
            tokenId,
            address(0),
            msg.sender,
            nftContractAddress,
            false
        );
    }

    // Function to call for a MArketSales
    // A buyer buys an nft paying a price, we transfer the ownership
    // from the contract to the buyer. We pay the creator of the marketplace a commission
    function MarketSale(address nftContractAddress,uint256 itemId) public payable nonReentrant{
        // get the price of nft and tokenId from the marketItem created.
        uint256 Price_of_NFT = Id_To_MarketItem[itemId].price;
        uint256 tokenId = Id_To_MarketItem[itemId].tokenId;

        // Make sure the  buyer pays the actual money to purchase the nft
        require(msg.value == Price_of_NFT,"Amount must be equal to the amount of the NFT to purchase");

        Id_To_MarketItem[itemId].sellerAddress.transfer(msg.value);

        // transfer ownership from contract to the buyer
        IERC721(nftContractAddress).transferFrom(address(this),msg.sender,tokenId);

        // set the owner of the nft to the buyer
        Id_To_MarketItem[itemId].ownerAddress = payable(msg.sender);

        // set the sold nft boll to true after marketsales
        Id_To_MarketItem[itemId].sold = true;

        _itemSold.increment(); // increment the item sold

        // transfer the listingPrice payed to the owner
        payable(owner).transfer(listingPrice);
    }

    // A function that retuns a list of unsold marketItem]
    function fetchMarketItems() public view returns (MarketItem[] memory){
        uint256 _TotalItemCount = _itemId.current();
        uint256 unsoldItemsCount = _itemId.current()-_itemSold.current();
        uint256 countIndex = 0;
        MarketItem[] memory unsoldItems = new MarketItem[](unsoldItemsCount);
        for(uint256 i = 0;i<_TotalItemCount;i++){
            if(Id_To_MarketItem[i+1].ownerAddress == address(0)){
                uint256 unSoldItemId = Id_To_MarketItem[i+1].itemId;
                MarketItem storage item = Id_To_MarketItem[unSoldItemId];
                unsoldItems[countIndex] = item;
                countIndex += 1;
            }
        }
        return unsoldItems; // Return unsoldItems
    }

    // Function that fetches NFT I created
    function getMyNft() public view returns(MarketItem[] memory){
        // gives the current value of total marketitem counts or created
        uint256 _TotalItemCount = _itemId.current();
        uint256 MyCreatedNftCount = 0;
        uint256 countIndex = 0;

        // Loop to find the created MarketItems that have ownership
        for(uint i = 0;i<_TotalItemCount; i++){
            if(Id_To_MarketItem[i+1].ownerAddress == msg.sender){
                MyCreatedNftCount += 1;
            }
        }

        // We perform an algorithm to store our created nft in an array an return to the user when queied
        MarketItem[] memory MyNfts = new MarketItem[](MyCreatedNftCount);
        for(uint i = 0;i<_TotalItemCount;i++){
            if(Id_To_MarketItem[i+1].ownerAddress == msg.sender){
                // get the itemId of the item that we created
                uint256 itemId = Id_To_MarketItem[i+1].itemId;
                // add the item to the array
                MarketItem storage item = Id_To_MarketItem[itemId];
                MyNfts[countIndex] = item;
                countIndex++;
            }
        }
        return MyNfts;
    }

    // Function that returns an array of NFT the user has created
    function getUserCreatedNft() public view returns(MarketItem[] memory){
        uint256 _TotalItemCount = _itemId.current();
        uint256 _UserCreatedNftCount = 0;
        uint counter = 0;

        for(uint i = 0;i<_TotalItemCount;i++){
            // At this point the contract must have transferred ownership to the seller. msg.sender is same as seller address
            if(Id_To_MarketItem[i+1].sellerAddress == msg.sender ){
                _UserCreatedNftCount++;
            }
        }

         // We store the UserCreated NFt to an array and return it when queried
         MarketItem[] memory usernft = new MarketItem[](_UserCreatedNftCount);
        for(uint i = 0;i<_TotalItemCount;i++){
            if(Id_To_MarketItem[i+1].sellerAddress == msg.sender){
                // get the _itemId
                uint userCreatedNftId = Id_To_MarketItem[i+1].itemId;
                // add the Item to the array
                MarketItem storage item = Id_To_MarketItem[userCreatedNftId];
                usernft[counter] = item;
                counter++;
            }
        }
        return usernft;
    }
}
