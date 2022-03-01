# MarketPlace_Dapp
This is the full stack application which runs on ethereum blockchain. Full source code is available and how to proceed for the programming is also available in readme file.

Clone the repository using this command.
	
```> git clone https://github.com/dappuniversity/marketplace.git <name of your project>```
	
Open it in any editor:

See all the files and check the correct version of the solidity compiler.

Make a new smart contract in src folder:
	In my case: Marketplace.sol
	Initialise it with basic smart contract and compile it using

> truffle compile
On the succession you can see abi files for marketplace in your repo.

Make deploye.js file in migrations:
And migrate it later with other migrations.
: it will deploy smart contracts to our blockchain.

To migrate the code with truffle:

Use : 
> truffle migrate

> truffle console

In console → we can use web3.js codes and access all the functionality of smart contract

truffle(development)> web3
truffle(development)> accounts = await web3.eth.getAccounts()
To print:  
truffle(development)> accounts
[
  '0x54012373d4ea066D84DA94FcB7Cd6Ed3648BA8cF',
  '0xB45fD74C49BC2066c82697796Ee5C9Efb3dA7598',
  '0xee069C79352B86F0E19206F3563958C362CfA7d4',
  '0xAeecF2D43D3f655E8d0F65b8a7BA33D447795Ed2',
  '0x8275C4387fED0f43c62585C08752f68Ea1734CD5',
  '0x858E557c0740a2fd75AC4906FD9eC86A0290EfFE',
  '0x5aD98168CC876cc37f6657E89BBfDa4477bf4861',
  '0x7a74c432E0F309B937dC1F3B632E6e830ecc6Ade',
  '0xc3D84a78ef2921f08487A309Ba2Da67E850413d5',
  '0x1Aa4d198bd537d68C6b32357Df9592885De1Fb6f'
]



truffle(development)> blocknumber = await web3.eth.getBlockNumber()
undefined
truffle(development)> blocknumber
2

truffle(development)> marketplace = await Marketplace.deployed()
undefined
truffle(development)> marketplace
…. Lots of information about deployed smart contract ….

truffle(development)> name = await marketplace.name()
undefined
truffle(development)> name
'Krushang satani Marketplace'


Create a backbone of the backend using solidity and test file.
Make new js file in test (Marketplace.test.js)
	
const { assert } = require("chai")
const Marketplace = artifacts.require('./Marketplace.sol')
 
contract('Marketplace', (accounts) => {
    let marketplace
 
    before(async() => {
        marketplace = await Marketplace.deployed()
    })
    describe('deployement', async() => {
        it('deployes successfully', async() => {
            const address = await marketplace.address
            assert.notEqual(address,0x0)
            assert.notEqual(address,'')
            assert.notEqual(address,null)
            assert.notEqual(address,undefined)
        })
        it('has a good name', async() => {
            const name = await marketplace.name()
            assert.equal(name, 'Krushang satani Marketplace')
        })
    })
})

(Note : Check repeatedly using command truffle test)

It allows sellers to post their request or products on the browser or portal.
Make structure in Marketplace.sol smart contract
And do programming according to your needs.

Marketplace.sol:
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
        address owner;
        bool purchased;
    }
 
    event productCreated(
        uint id,
        string name,
        uint price,
        address owner,
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
}
 
 


Marketplace.test.js:
	
const { assert } = require("chai")
require("chai")
    .use(require('chai-as-promised'))
    .should()
 
const Marketplace = artifacts.require('./Marketplace.sol')
 
contract('Marketplace', ([deployer, seller, buyer]) => {
    let marketplace
 
    before(async() => {
        marketplace = await Marketplace.deployed()
 
    })
 
    describe('deployement', async() => {
        it('deployes successfully', async() => {
            const address = await marketplace.address
            assert.notEqual(address,0x0)
            assert.notEqual(address,'')
            assert.notEqual(address,null)
            assert.notEqual(address,undefined)
 
        })
        it('has a good name', async() => {
            const name = await marketplace.name()
            assert.equal(name, 'Krushang satani Marketplace')
        })
    })
 
    describe('products', async() => {
        let result, productCount
 
        before(async() => {
            result = await marketplace.createProduct('iphoneX', web3.utils.toWei('0.11','Ether'),{from : seller})
            // in wei 1000000000000000
 
            productCount = await marketplace.productCount()
   
        })
 
        it('creates a product', async() => {
 
            //success
            assert.equal(productCount,1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
            assert.equal(event.name,'iphoneX',' is correct')
            assert.equal(event.price, web3.utils.toWei('0.11','Ether') ,' is correct')
            assert.equal(event.owner, seller,' is correct')
            assert.equal(event.purchased, false,' is correct')
       
            //failure: product must have a name
            await marketplace.createProduct('', web3.utils.toWei('0.11','Ether'),{from : seller}).should.be.rejected;
            //failure: product must have a price
            await marketplace.createProduct('iphoneX', 0,{from : seller}).should.be.rejected;
 
        })
    })
 
})


(Note : Check repeatedly using command truffle test)

New things to learn in this module: 
Define and it clause
Emit and event and logs of result
Async function
Await keywords

It allows buyers to check the product details and buy the products:
Do accordingly: to create your on dapp.
	
	Same way create purchaseProduct function in solidity and test it in the Marketplace.test.js.
	
Add this in marketplace.sol:
 
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


Add this in test.js file of marketplace:

it('lists products' , async() => {
            const product = await  marketplace.products(productCount)
            assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct')
            assert.equal(product.name,'iphoneX',' is correct')
            assert.equal(product.price, web3.utils.toWei('0.11','Ether') ,' is correct')
            assert.equal(product.owner, seller,' is correct')
            assert.equal(product.purchased, false,' is correct')
        })
 
        it('sells products' , async() => {
            //track the seller balance before purchase
            let oldsellerbalance
            oldsellerbalance = await web3.eth.getBalance(seller)
            oldsellerbalance = new web3.utils.BN(oldsellerbalance)
           
            //success buyers makes purchase
            result = await marketplace.purchaseProduct(productCount , {from: buyer, value: web3.utils.toWei('0.11','Ether')})
           
            //check logs
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
            assert.equal(event.name,'iphoneX',' is correct')
            assert.equal(event.price, web3.utils.toWei('0.11','Ether') ,' is correct')
            assert.equal(event.owner, buyer,' is correct updated')
            assert.equal(event.purchased, true,' is correct')
           
            //check seller received funds
            let newsellerbalance
            newsellerbalance = await web3.eth.getBalance(seller)
            newsellerbalance = new web3.utils.BN(newsellerbalance)
           
            let price
            price = web3.utils.toWei('0.11','Ether')
            price = new web3.utils.BN(price)
           
            const expectedbal = oldsellerbalance.add(price)
            //because it is BN diff declaration
 
            assert.equal(newsellerbalance.toString(),expectedbal.toString(),'balance is varified')
 
            //failure : does not exit (invalid id)
            await marketplace.purchaseProduct(99 , {from: buyer, value: web3.utils.toWei('0.11','Ether')}).should.be.rejected
           
            //failure : buy with enough ether
            await marketplace.purchaseProduct(productCount , {from: buyer, value: web3.utils.toWei('0.01','Ether')}).should.be.rejected
           
            //failure : buy already bought item
            await marketplace.purchaseProduct(productCount , {from: deployer, value: web3.utils.toWei('0.11','Ether')}).should.be.rejected
           
            //failure : buy your own item item
            await marketplace.purchaseProduct(productCount , {from: buyer, value: web3.utils.toWei('0.11','Ether')}).should.be.rejected
           
 
        })

It is the final backend part for the marketplace Dapp.
Check repeatedly using : truffle test.


Deploy smart contract on blockchain:
And check it using truffle console
And run the test cases written on test.js file.

marketplace = await Marketplace.deployed()
Marketplace.address

Note: till this complete all the process done above and deployment of smart contract on blockchain is necessary.


Now moving to the frontend and connection part:
First do changes according to the app.js file and make some functionality to connect with smart contracts.
Refer app.js file and Navbar.js file to make changes in your boilerplate file of app.js
In app.js file: to reduce code length we have added an additional extended module of navbar.js file.
For reference:
https://github.com/krushangSk17/Demo_files_Marketplace_First_Dapp/tree/main/components_part-9
Link for the part 9 reference.
In this one can link metamask with local blockchain running on ganache.
Keep in mind: set seller account and buyer account in metamast with different private key and link metamask to the ganache network using network id and localhost.
		
Move on to the product listing and selling.
Refer to the link below and code accordingly
Firstly make the functions in app.js. like
createProduct() and purchaseProduct()
Bind it with class state
Pass it to the main.js file
Use them into the main.js file to handle the click and submit event.
For reference:
https://github.com/krushangSk17/Ref_files_Marketplace_First_Dapp/tree/main/components_part-10

Most exciting part for Dapp deployment is to deploy it in a public test network.

We will use the kuvan test network in metamask.
Explore https://kovan.etherscan.io/
After that create a new project in infura and select kuvan ethereum and copy the path of the endpoint. And take care of that link. 
https://infura.io/dashboard/ethereum/7709d05666d74df6b9fc60a845ae216c/settings
In my case:
https://kovan.infura.io/v3/7709d05666d74df6b9fc60a845ae216c
Let's generate actual ether.
Go to ganache and open the 1st account in metamast with kuvan. And paste account address here for free ether.
https://gitter.im/kovan-testnet/faucet#
Name this account deployer and it will be used as a deployer.
Use remix online ide to deploy smart contracts.
And copy the contract id and transaction hash.
Using these two create a new network in marketplace.json file using network code 42 for kuvan test blockchain.

Here you go, your Dapp is successfully deployed on the Kuvan test network.

