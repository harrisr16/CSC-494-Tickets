import './App.css';
import React from 'react';
//import web3 from './web3';
//import ticket from './ticket';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: '',
    };
  }
  render() {
    // console.log(web3.version);
    // web3.eth.getAccounts().then((accounts) => {
    //   console.log(accounts[0]);
    //   console.log(ticket.methods.manager().call());
    // });
    return (
      <div className="App">
        <form>
          <div>
            <button name="getTicket">Get Ticket Number</button>
          </div>
        </form>
      </div>
    );
  }
}
export default App;
