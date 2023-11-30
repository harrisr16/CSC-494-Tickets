// import { SECRET_PHRASE } from 'phraseConfig.js';

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    //Secret phrase
    'notable child question panel acquire silly language elder pepper mammal model mixture',
    //Goerli endpoint
    'https://goerli.infura.io/v3/2ac8acc85c5846dab223331aec2c1bbf'
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    ticket = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode, arguments: [1000, 100] })
        .send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000 });

    console.log('Contract deployed to', ticket.options.address);
    provider.engine.stop();
};
deploy();
//Deployed at: 0x96FD55c36610f93b899485212d28661093C801f6