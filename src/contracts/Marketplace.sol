pragma solidity >=0.4.21 <0.9.0;

contract Marketplace{
    string public name;

    uint public productCount = 0;
    // there are no counter for mapping length
    mapping(uint => Product) public products;

    struct Product {
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }

    event productCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event productPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    constructor() public {
        name = "Krushang satani Marketplace";
    }

    function createProduct(string memory _name, uint _price) public{
        // make sure of parameters are correct
        require(bytes(_name).length > 0);

        require(_price > 0);
        //increment product counter
        productCount ++;
        //create a product
        products[productCount] = Product(productCount, _name, _price, msg.sender, false);
        //trigger an event
        emit productCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint _id) public payable{
        //fetch the product
        Product memory _product = products[_id];
        
        //fetch the owner
        address payable _seller = _product.owner;

        //makesure product is valid
        require(_product.id > 0 && _product.id <= productCount);
        //require that the product has not been yed purchased
        require(!_product.purchased);
        //require that there is enough ether in the transaction
        require(msg.value >= _product.price);
        //reqire that buyer is not the seller
        require(_seller != msg.sender);

        //transfer ownership
        _product.owner =  msg.sender;
        //purchase it
        _product.purchased = true;
        //update the product
        products[_id] = _product;

        //pay the seller sending them the price
        address(_seller).transfer(msg.value);

        //tigger an event
        emit productCreated(productCount, _product.name, _product.price, msg.sender, true);
    }
}

