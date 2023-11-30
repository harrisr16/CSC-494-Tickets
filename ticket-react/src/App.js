import './App.css';
import React from 'react';
import web3 from './web3';
import ticket from './ticket';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      manager: '',
      ticketNo: 0,
      returnID: 0,
      buyID: 0,
      acceptSwapAddress: 0,
      offerSwapAddress: 0,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const addr = await web3.currentProvider.selectedAddress;
    const manager = await ticket.methods.manager().call();
    const ticketNo = await ticket.methods.getTicketOf(addr).call();
    this.setState({ manager, ticketNo });
  }
  //------------------------------------------------------------------------------------------------------
  getTicket = async (event) => {
    event.preventDefault();
    alert(`
       ____Your Ticket____\n
       ${this.state.ticketNo}
     `);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit = async (event) => {
    const addr = await web3.currentProvider.selectedAddress;
    const buttontype = window.event.submitter.name;
    const { returnID, buyID, acceptSwapAddress, offerSwapAddress } = this.state;

    if (buttontype === "returnTicket") {
      event.preventDefault();
      ticket.methods.returnTicket().send({
        from: addr,
      });
      alert(`
       Ticket No. ${returnID} returned successfully!
     `);
    }
    else if (buttontype === "buyTicket") {
      event.preventDefault();
      ticket.methods.buyTicket(buyID).send({
        from: addr,
      });
      alert(`
       Ticket No. ${buyID} awaiting transaction confirmation...
     `);
    }
    else if (buttontype === "offerSwap") {
      event.preventDefault();
      ticket.methods.offerSwap(offerSwapAddress).send({
        from: addr,
      });
      alert(`
       Ticket No. ${offerSwapAddress} awaiting swap request confirmation...
     `);
    }
    else if (buttontype === "acceptSwap") {
      event.preventDefault();
      ticket.methods.acceptSwap(acceptSwapAddress).send({
        from: addr,
      });
      alert(`
       Ticket No. ${acceptSwapAddress} awaiting swap accept confirmation...
     `);
    }
  }
  //------------------------------------------------------------------------------------------------------
  render() {
    console.log(web3.version);
    web3.eth.getAccounts().then((accounts) => {
      console.log(accounts[0]);
      console.log(ticket.methods.manager().call());
    });
    return (
      <div className="App">
        <p>
          This is a Ticket Site owned by {this.state.manager}.<br></br>
        </p>
        <form onSubmit={this.handleSubmit}>
          <h4>Buy a ticket</h4>
          <div>
            <label>Enter ticket ID: </label><br></br>
            <input
              placeholder='Ticket ID'
              name='buyID'
              onChange={this.handleChange}
            />
          </div>
          <div>
            <button name="buyTicket">Buy ticket</button>
          </div>
        </form>
        <form onSubmit={this.handleSubmit}>
          <h4>Return your ticket</h4>
          <div>
            <button name="returnTicket">Return ticket</button>
          </div>
        </form>
        <form onSubmit={this.handleSubmit}>
          <h4>Offer a ticket swap</h4>
          <div>
            <label>Enter your address: </label><br></br>
            <input
              placeholder='Wallet Address'
              name='offerSwapAddress'
              onChange={this.handleChange}
            />
          </div>
          <div>
            <button name="offerSwap">Buy ticket</button>
          </div>
        </form>
        <form onSubmit={this.handleSubmit}>
          <h4>Accept a ticket swap</h4>
          <div>
            <label>Enter address of requested swap: </label><br></br>
            <input
              placeholder='Wallet Address'
              name='acceptSwapAddress'
              onChange={this.handleChange}
            />
          </div>
          <div>
            <button name="acceptSwap">Buy ticket</button>
          </div>
        </form>
        <form>
          <h4>What's my ticket ID?</h4>
          <div>
            <button id="getTicketButton" onClick={this.getTicket}>Get Ticket Number</button><br></br>
          </div>
        </form>
      </div>
    );
  }
}
export default App;
