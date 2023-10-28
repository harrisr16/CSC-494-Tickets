const assert = require("assert");
const chai = require("chai");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { abi, bytecode } = require('../compile');

let accounts;
let ticket;
let account;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    //Makes an empty account, useful for testing insufficient balance
    account = await web3.eth.accounts.create();
    ticket = await new web3.eth.Contract(abi)
        .deploy({
            data: bytecode,
            arguments: [100000, 10000],
        })
        .send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
});

describe("TicketSale", () => {
    //--------------------------------------------------------------------------------------------------------------------------------
    //Deploy Test
    it("Deploys a contract", () => {
        assert.ok(ticket.options.address);
    });
    //--------------------------------------------------------------------------------------------------------------------------------
    //Constructor test
    it("Create the constructor", async () => {
        const managerName = await ticket.methods.managerName().call();
        assert.equal(managerName, "Randy");
    });
    //--------------------------------------------------------------------------------------------------------------------------------
    //Buy ticket test
    //Buy ticket success
    it("Buy a ticket", async () => {
        await ticket.methods.buyTicket(1).send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
        assert.equal(await ticket.methods.getAddressOf(1).call(), accounts[0]);
    });
    //Buy ticket fail, no ticket ID
    it("Buy an invalid ticket", async () => {
        try {
            await ticket.methods.buyTicket(1000000).send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
            assert.fail("This transaction should produce an error.");
        } catch (error) {
            chai.assert.include(error.message, "No ticket ID with that value!", "Test failed!");
        }
    });
    //Buy ticket fail, already owned
    it("Buy an invalid ticket, already owned", async () => {
        try {
            await ticket.methods.buyTicket(1).send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
            await ticket.methods.buyTicket(1).send({ from: accounts[1], gasPrice: 8000000000, gas: 4700000 });
            assert.fail("This transaction should produce an error.");
        } catch (error) {
            chai.assert.include(error.message, "Someone else already owns that ticket!", "Test failed!");
        }
    });
    //Buy ticket fail, double buy
    it("Buy an invalid ticket, double buy", async () => {
        try {
            await ticket.methods.buyTicket(1).send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
            await ticket.methods.buyTicket(1).send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
            assert.fail("This transaction should produce an error.");
        } catch (error) {
            chai.assert.include(error.message, "Only one ticket may be held at a time!", "Test failed!");
        }
    });
    //Buy ticket fail, no balance
    it("Buy an invalid ticket, no balance", async () => {
        try {
            await ticket.methods.buyTicket(1).send({ from: account.address, gasPrice: 8000000000, gas: 4700000 });
            assert.fail("This transaction should produce an error.");
        } catch (error) {
            chai.assert.include(error.message, "sender account not recognized", error.message);
        }
    });
    //--------------------------------------------------------------------------------------------------------------------------------
    //Return Test
    //Return successful
    it("Return a ticket", async () => {
        await ticket.methods.buyTicket(1).send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
        await ticket.methods.returnTicket().send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
        assert.equal(await ticket.methods.getTicketOf(accounts[0]).call(), 0);
    });
    //Return fail, no ticket
    it("Return a an invalid ticket, no ticket", async () => {
        try {
            await ticket.methods.returnTicket().send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
            assert.fail("This transaction should produce an error.");
        } catch (error) {
            chai.assert.include(error.message, "You don't have a ticket to return!", error.message);
        }
    });
    //--------------------------------------------------------------------------------------------------------------------------------
    //Offer Swap Test
    //Offer swap successful
    it("Offer a swap", async () => {
        await ticket.methods.buyTicket(1).send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
        await ticket.methods.buyTicket(2).send({ from: accounts[1], gasPrice: 8000000000, gas: 4700000 });
        await ticket.methods.offerSwap(accounts[1]).send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
        addy = await ticket.methods.getSwapTo(0).call();
        assert.equal(addy, accounts[1]);
    });
    //Offer swap fail, don't own ticket
    it("Offer an invalid swap, no ticket", async () => {
        try {
            await ticket.methods.offerSwap(accounts[1]).send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
        } catch (error) {
            chai.assert.include(error.message, "You don't have a ticket!", error.message);
        }
    });
    //Offer swap fail, target doesn't own ticket
    it("Offer an invalid swap, target has no ticket", async () => {
        try {
            await ticket.methods.buyTicket(1).send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
            await ticket.methods.offerSwap(accounts[1]).send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
            assert.fail("This transaction should produce an error.");
        } catch (error) {
            chai.assert.include(error.message, "The given address does not own a ticket!", error.message);
        }
    });
    //--------------------------------------------------------------------------------------------------------------------------------
    //Accept Swap Test
    it("Accept a swap", async () => {
        await ticket.methods.buyTicket(1).send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
        await ticket.methods.buyTicket(2).send({ from: accounts[1], gasPrice: 8000000000, gas: 4700000 });
        await ticket.methods.offerSwap(accounts[1]).send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
        await ticket.methods.acceptSwap(accounts[0]).send({ from: accounts[1], gasPrice: 8000000000, gas: 4700000 });
        tickId = await ticket.methods.getTicketOf(accounts[0]).call();
        assert.equal(tickId, 2);
    });
    //Offer swap fail, don't own ticket
    it("Accept an invalid swap, no ticket", async () => {
        try {
            await ticket.methods.acceptSwap(accounts[1]).send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
        } catch (error) {
            chai.assert.include(error.message, "You don't have a ticket!", error.message);
        }
    });
    //Offer swap fail, target doesn't own ticket
    it("Accept an invalid swap, target has no ticket", async () => {
        try {
            await ticket.methods.buyTicket(1).send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
            await ticket.methods.acceptSwap(accounts[1]).send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });
            assert.fail("This transaction should produce an error.");
        } catch (error) {
            chai.assert.include(error.message, "The given address does not own a ticket!", error.message);
        }
    });
});