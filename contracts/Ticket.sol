pragma solidity ^0.8.17;

contract TicketSale {
    // <contract_variables>
    // </contract_variables>
    constructor(uint numTickets, uint price) public {
        // TODO
    }

    function buyTicket(uint ticketId) public payable {
        // TODO
    }

    function getTicketOf(address person) public view returns (uint) {
        // TODO
    }

    function offerSwap(address partner) public {
        // TODO
    }

    //Alternative Implementation
    function offerSwap(uint ticketId) public {
        // TODO
    }

    function acceptSwap(address partner) public {
        // TODO
    }

    // Alternative Implementation
    function acceptSwap(uint ticketId) public {
        // TODO
    }

    function returnTicket(uint ticketId) public {
        // TODO
    }
}
