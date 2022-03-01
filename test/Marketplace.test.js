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
    })

})