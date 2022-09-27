import logo from './logo.svg';
import './App.css';
import { KeyPair, transactions } from 'near-api-js'
import * as nearApi from 'near-api-js'
import React from 'react';
import { Buffer } from 'buffer';
import BN from 'bn.js';

// @ts-ignore
window.Buffer = Buffer;
function App() {
  const submitTransaction = async () => {

    const keyStore = new nearApi.keyStores.InMemoryKeyStore();
    const keyPair = KeyPair.fromString("ed25519:3QuZVbKjY88vgxTvioRbDPjqtoMokcj32ocKyEi2g7iA9xdeVhBEMtVeCqK4DTCbyfqUdyHALzJhAAkBBP1agXsw");

    await keyStore.setKey("testnet", "newaccountfortesting.testnet", keyPair);
    const newKeyPair = nearApi.KeyPair.fromRandom('ed25519');

    let actions = [
      transactions.addKey(newKeyPair.getPublicKey(), transactions.fullAccessKey()),
      new transactions.functionCall("get_owner", {}, new BN(100), new BN(100))
    ]
    const config = new nearApi.Near({
      networkId: "testnet",
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://localhost:1234",
      helperUrl: "https://helper.testnet.near.org",
      headers: {},
    })

    let walletConnection = new nearApi.WalletConnection(config, "appname");

    const BLOCK_HASH = '244ZQ9cgj3CQ6bWBdytfrJMuMQ1jdXLFGnr4HhvtCTnM';
    const blockHash = nearApi.utils.serialize.base_decode(BLOCK_HASH);
    const transaction = nearApi.transactions.createTransaction(
      "newaccountfortesting.testnet",
      keyPair.getPublicKey(),
      "ref-finance.testnet",
      3,
      actions,
      blockHash
    );

    await walletConnection.requestSignTransactions({
      transactions: [transaction],
      meta: "thisdata",
      callbackUrl: "https://localhost:3000"
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={() => submitTransaction()} > Add KEY! </button>
      </header>

    </div>

  );
}

export default App;
