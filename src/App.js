import React, { useState, useEffect } from 'react';
import './App.css';
import IERC20 from "@openzeppelin/contracts/build/contracts/IERC20.json";
import Web3 from "web3";

const web3 = new Web3(window.ethereum);

function App() {
  const [signedIn, setSignedIn] = useState(!!(window.ethereum && window.ethereum.selectedAddress));
  const [balance, setBalance] = useState("N/A");

  const tokenOnRopstenAddress = '0xB6e225194a1C892770c43D4B529841C99b3DA1d7';
  const tokenInstance = new web3.eth.Contract(IERC20.abi, tokenOnRopstenAddress);

  useEffect(() => {
    if (web3.currentProvider && window.ethereum.selectedAddress) {
      tokenInstance.methods.balanceOf(window.ethereum.selectedAddress).call().then((r) => {
        setBalance(r);
      });
    }
  });


  if (!window.ethereum) {
    return <div>Ethereum provider not found in this browser.</div>
  }

  if (!signedIn || !window.ethereum.selectedAddress) {
    return <div>
        You need to sign into the Ethereum provider<br />
        <button type="button" onClick={() => {
          window.ethereum.enable().then(() => {
            setSignedIn(true);
          })
        }}>Sign in</button>
      </div>
  }

  return (
    <div>
      <p>Selected account: <code>{window.ethereum.selectedAddress}</code></p>
      <p>Selected network: <code>{window.ethereum.networkVersion}</code></p>
      <p>Token address: <code>{tokenOnRopstenAddress}</code></p>
      <p>Token balance: <code>{balance}</code></p>
      <p>Transfer token to <code>0x4435789eeddc628357a81cb43c1aa9e268457931</code>:<br />
        <button type="button" onClick={() => {
          tokenInstance.methods.transfer(
            '0x4435789eeddc628357a81cb43c1aa9e268457931',
            1000000000000
          ).send({
            from: window.ethereum.selectedAddress
          })
          .once('transactionHash', (hash) => {
            console.log('tx got its hash - check etherscan', hash);
          }).once('receipt', (receipt) => {
            console.log('receipt', receipt);
          }).on('confirmation', (confNumber, receipt) => {
            console.log('confirmation', confNumber);
          }).then((receipt) => {
            console.log('tx has been mined', receipt)
          });
        }}>Send 1000000000000</button>
      </p>
    </div>
  );
}

export default App;
