const path = require('path');
const fs = require('fs');
const solc = require('solc');

const TicketPath = path.resolve(__dirname, 'contracts', 'Ticket.sol');
const source = fs.readFileSync(TicketPath, 'utf8');
//console.log(source);

let input = {
  language: "Solidity",
  sources: {
    "Ticket.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"],
      },
    },
  },
};
//console.log(JSON.stringify(input))
//console.log(solc.compile(JSON.stringify(input)));
const output = JSON.parse(solc.compile(JSON.stringify(input)));
//console.log(output);
//console.log(output.contracts["Ticket.sol"].Ticket);
const contracts = output.contracts["Ticket.sol"];
const contract=contracts['Ticket'];
console.log(contract);
module.exports= {"abi":contract.abi,"bytecode":contract.evm.bytecode.object};