/*
 * We are going to need to use state now! Don't forget to import useState
 */
import myEpicGame from './utils/MyEpicGame.json';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import './App.css';
import SelectCharacter from './Components/SelectCharacter';
import Arena from './Components/Arena';
import { CONTRACT_ADDRESS, transformCharacterData } from './constants';
import twitterLogo from './assets/twitter-logo.svg';


// Constants
const TWITTER_HANDLE = 'run4pancakes';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  /*
   * Just a state variable we use to store our user's public wallet. Don't forget to import useState.
   */
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  /*const [isLoading, setIsLoading] = useState(false);*/

  /*
   * Since this method will take some time, make sure to declare it as async
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
        /*setIsLoading(false);*/
        return;
      } else {
        console.log('We have the ethereum object', ethereum);

        /*
         * Check if we're authorized to access the user's wallet
         */
      const accounts = await ethereum.request({ method: 'eth_accounts' });

        /*
         * User can have multiple authorized accounts, we grab the first one if its there!
         */
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
    /*
     * We release the state property after all the function logic
     */
    /*setIsLoading(false);*/

  };

  /*const checkNetwork = async () => {
        try { 
          if (window.ethereum.networkVersion !== '4') {
            alert("Please connect to Rinkeby!")
          }
            } catch(error) {
              console.log(error)
              }
  };*/
    
  
  const renderContent = () => {

    /*if (isLoading) {
    return <LoadingIndicator />;
    }*/
      /*
   * Scenario #1
   */
  if (!currentAccount) {
    return (
      <div className="connect-wallet-container">
        <img
          src="https://i.imgur.com/zxErw0e.gif"
          alt="Office Space gif"
        />
        <button
          className="cta-button connect-wallet-button"
          onClick={connectWalletAction}
        >
          Connect Wallet To Get Started
        </button>
      </div>
    );
    /*
     * Scenario #2
     */
  } else if (currentAccount && !characterNFT) {
    return <SelectCharacter setCharacterNFT={setCharacterNFT} />;

  /*
	* If there is a connected wallet and characterNFT, it's time to battle!
	*/
  } else if (currentAccount && characterNFT) {
    return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />; 
  }
};
    
  /*
   * Implement your connectWallet method here
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    /*setIsLoading(true);*/
    checkIfWalletIsConnected();  
  }, []);

  /*
 * Add this useEffect right under the other useEffect where you are calling checkIfWalletIsConnected
 */
useEffect(() => {
  /*
   * The function we will call that interacts with out smart contract
   */
  const fetchNFTMetadata = async () => {
    console.log('Checking for Character NFT on address:', currentAccount);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      myEpicGame.abi,
      signer
    );

    const characterNFT = await gameContract.checkIfUserHasNFT();
    if (characterNFT.name) {
      console.log('User has character NFT');
      setCharacterNFT(transformCharacterData(characterNFT));
    } else {
      console.log('No character NFT found');
    }
    /*setIsLoading(false);*/
  };

  /*
   * We only want to run this, if we have a connected wallet
   */
  if (currentAccount) {
    console.log('CurrentAccount:', currentAccount);
    fetchNFTMetadata();
  }
}, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">🚀 WAGMI Managooor Tamer! 🌕 </p>
          <p className="sub-text">Team up to tame the managoooor and quit your day job! </p>
        {renderContent()}
      </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
