import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Link,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  useToast,
  Button,
  Input,
} from '@chakra-ui/react';


import { ConnectButton } from '@rainbow-me/rainbowkit';


import Web3 from 'web3';
import { ethers } from 'ethers';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';

import abiFile from './abiFile.json';
import './styles.css'; // Reference to the external CSS file

import backgroundGif from './bkg.png';
import MainTextLogo from './anuhader.gif';

const STAKING_CONTRACT_ADDRESS = '0xYourStakingContractAddress'; // Replace with your actual contract address
const STAKING_CONTRACT_ABI = './Lastman HoldingNFTRewardsStaking.json';

const CONTRACT_ADDRESS = '0x172499980D37E6590b1bB7BFA0b51C64Dd34f84b';
const getExplorerLink = () => `https://bscscan.com/token/${CONTRACT_ADDRESS}`;
const getOpenSeaURL = () => `https://testnets.opensea.io/assets/goerli/${CONTRACT_ADDRESS}`;

function App() {
  const account = useAccount();
  const [contractName, setContractName] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);
  const [loading, setLoading] = useState(true);


  const toast = useToast();



  const contractConfig = {
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: abiFile,
  };

  const [imgURL, setImgURL] = useState('');
  const { writeAsync: mint, error: mintError } = useContractWrite({
    ...contractConfig,
    functionName: 'mint',
  });

  const [mintLoading, setMintLoading] = useState(false);
  const { address } = useAccount();
  const isConnected = !!address;
  const [mintedTokenId, setMintedTokenId] = useState(null);
  const [mintAmount, setMintQuantity] = useState(1);

  const calculateTotalPrice = () => {
    const pricePerToken = 0.1; // Adjust the price per token as needed
    return ethers.utils.parseEther((mintAmount * pricePerToken).toString());
  };

  const handleIncrement = () => {
    setMintQuantity((prevQuantity) => Math.min(prevQuantity + 1, 80));
  };

  const handleDecrement = () => {
    setMintQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const onMintClick = async () => {
    try {
      setMintLoading(true);
      const totalPrice = calculateTotalPrice();

      const tx = await mint({
        args: [mintAmount, { value: totalPrice }],
      });

      await tx.wait(); // Wait for the transaction to be mined
    } catch (error) {
      console.error(error);
    } finally {
      setMintLoading(false);
    }
  };



  async function fetchContractData() {
    try {
      const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abiFile, provider);
      const name = await contract.name();
      const supply = await contract.totalSupply();
      setContractName(name);
      setTotalSupply(supply.toNumber());
    } catch (error) {
      console.error('Error fetching contract data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContractData();
  }, []);

  const maxSupply = 100;
  const remainingSupply = maxSupply - totalSupply;

  return (
    <>
      <header>
        <div className="connect-button">
          <ConnectButton />
        </div>
      </header>

      <div
        className="wrapper"
        style={{
          backgroundColor: 'black',
          color: 'white',
          backgroundImage: `url(${backgroundGif})`,
          backgroundSize: 'cover',
        }}
      >
        <div className="mainboxwrapper">
          <Container className="container" paddingY="4">



                <div>

                   <img src={MainTextLogo} alt="Lastman Holding DeFi" className="logobody" style={{ marginTop: '90px'  }}/>
                  <Text className="paragraph1" style={{ textAlign: 'center', fontWeight: 'bold' }}>


                  </Text>

                  <Text className="remainingSupply" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                  LastManHolding NFT will reward a random existing holder with 10% of the purchase price of last NFT sold. Every NFT purchased will reward a current holder randomly until there is only one left. The last NFT sold will earn a total of 10% (1.5BNB) of the entire treasury, total value of all the NFTS sold. Pricing is currently at base cost of 0.15BNB. Get in early to have more chances to be rewarded and remember! You can always have more than one, which means more chances for rewards. 1 Lastman NFT per transaction with no cap on qty per wallet. Enjoy the Ride!!
                  </Text>
                  <Text className="totalSupply" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                    {loading ? 'Loading...' : `Sold : ${totalSupply} / ${maxSupply}  `}
                  </Text>

                  <Text className="contractaddr" style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>
                    <Link isExternal href={getExplorerLink()}>
                      {CONTRACT_ADDRESS}
                    </Link>
                  </Text>
                </div>

                  <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder' }}>

                  </Text>

                  <Text className="pricecost" style={{ textAlign: 'center', fontWeight: 'bolder' }}>
                    0.1 BNB Each
                  </Text>
              {/*  <Box marginTop='4' display='flex' alignItems='center' justifyContent='center'>
                  <Button
                    marginTop='1'
                    textColor='white'
                    bg='#0e26cd'
                    _hover={{
                      bg: '#5200ff',
                    }}
                    onClick={handleDecrement}
                    disabled={!isConnected || mintLoading || mintAmount === 1}
                  >
                    -
                  </Button>
                  <Text marginX='3' textAlign='center' fontSize='lg'>
                    {mintAmount}
                  </Text>
                  <Button
                    marginTop='1'
                    textColor='white'
                    bg='#0e26cd'
                    _hover={{
                      bg: '#5200ff',
                    }}
                    onClick={handleIncrement}
                    disabled={!isConnected || mintLoading || mintAmount === 60}
                  >
                    +
                  </Button>
                </Box>
*/}


                <Box marginTop='2' display='flex' alignItems='center' justifyContent='center'>
                  <Button
                    disabled={!isConnected || mintLoading}
                    marginTop='6'
                    onClick={onMintClick}
                    textColor='white'
                    bg='#0e26cd'
                    _hover={{
                      bg: '#5200ffs',
                    }}
                  >
                    {isConnected ? `Mint ${mintAmount} Now` : ' Mint on (Connect Wallet)'}
                  </Button>
                </Box>
                {mintError && (
                  <Text marginTop='4'>⛔️ Mint unsuccessful! Error message:</Text>
                )}
                {mintError && (
                  <pre style={{ marginTop: '8px', color: 'red' }}>
                    <code>{JSON.stringify(mintError, null, ' ')}</code>
                  </pre>
                )}
                {mintLoading && <Text marginTop='2'>Minting... please wait</Text>}
                {mintedTokenId && (
                  <Text marginTop='2'>
                    Mint successful! You can view your NFT{' '}
                    <Link
                      isExternal
                      href={getOpenSeaURL()}
                      color='#64c6ff'
                      textDecoration='underline'
                    >
                      Soon!
                    </Link>
                  </Text>
                )}

            <Text className="paragraph1" style={{ color: 'white', padding: '20px', textAlign: 'center' }}>
              Lastman Holding NFT DeFi Platform 2024. All rights reserved.
            </Text>
            <Text className="contractaddr" style={{ color: 'white', padding: '14px', textAlign: 'center' }}>
              © InHaus Development 2024
            </Text>
          </Container>
        </div>
      </div>
    </>
  );
}

export default App;
