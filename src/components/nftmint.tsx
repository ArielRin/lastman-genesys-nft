import React, { useEffect, useState } from 'react';
import { Box, Button, Text, Link, Image, useToast } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useAccount, useContractWrite } from 'wagmi';
import abiFile from './abiFile.json'; // Ensure this is correctly imported

// Assuming these imports are correct and images exist
import backgroundGif from './bkg.png';
import MainTextLogo from './anuhader.gif';

const NFTMINT_CONTRACT_ADDRESS = '0x03965dEc6f765ddCA73282065B9646950a613618'; // Replace with your actual contract address

function NftMint() {
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
    <Box
      style={{
        backgroundColor: 'black',
        color: 'white',
        backgroundImage: `url(${backgroundGif})`,
        backgroundSize: 'cover',
        padding: '20px',
        borderRadius: '12px',
      }}
    >
      <Image src={MainTextLogo} alt="Anunaki DeFi" mb="4" />
      {loading ? (
        <Text>Loading contract data...</Text>
      ) : (
        <>
          <Text>{`Contract Name: ${contractName}`}</Text>
          <Text>{`Total Supply: ${totalSupply} / ${maxSupply}`}</Text>
          <Text>{`Remaining Supply: ${remainingSupply}`}</Text>
          <Box textAlign="center" padding="4">
            <Text fontSize="xl" mb="4">Mint Your NFT</Text>
            <Box display="flex" justifyContent="center" alignItems="center" mb="4">
              <Button onClick={handleDecrement} isDisabled={mintAmount <= 1 || mintLoading} colorScheme="orange">-</Button>
              <Text mx="8" fontSize="xl">{mintAmount}</Text>
              <Button onClick={handleIncrement} isDisabled={mintLoading || mintAmount >= 80} colorScheme="orange">+</Button>
            </Box>
            <Button onClick={onMintClick} isLoading={mintLoading} isDisabled={!isConnected} colorScheme="teal">
              Mint Now
            </Button>
            {mintError && (
              <Text color="red.500" mt="4">
                Error Minting: {mintError.message}
              </Text>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}

export default NftMint;


//
// use this in app.tsx
//
// import NftMint from './NftMint'; // Adjust the import path as needed
//
//
//           <NftMint />
