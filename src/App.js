import React from 'react';
import './style.css';
import React, { useEffect, useState, useRef } from 'react';
import {
  store,
  ReactNotification,
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import styled from 'styled-components';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2';
import Web3 from 'web3';

const StyledButton = styled.button`
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.color};
  width: 100%;
  max-width: 250px;
  transition: background-color 0.5s ease;
  padding: 0.5rem 2rem;
  font-size: 2rem;
  border: none;
  border-radius: 4px;
  margin: 1rem 0;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.hoverBgColor};
  }
`;

const NFTCONTRACT = '0x230Bb7ce185CD0042973202f5F38B7072440e2C9';
const Web3Utils = require('web3-utils');

const ABI = [
  {
    inputs: [
      {
        internalType: 'string',
        name: '_name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_symbol',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_initBaseURI',
        type: 'string',
      },
      {
        internalType: 'string',
        name: '_initNotRevealedUri',
        type: 'string',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'baseExtension',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'cost',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getApproved',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxMintAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_mintAmount',
        type: 'uint256',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'notRevealedUri',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: '_state',
        type: 'bool',
      },
    ],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'reveal',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'revealed',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_newBaseExtension',
        type: 'string',
      },
    ],
    name: 'setBaseExtension',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_newBaseURI',
        type: 'string',
      },
    ],
    name: 'setBaseURI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_newCost',
        type: 'uint256',
      },
    ],
    name: 'setCost',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_notRevealedURI',
        type: 'string',
      },
    ],
    name: 'setNotRevealedURI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_newmaxMintAmount',
        type: 'uint256',
      },
    ],
    name: 'setmaxMintAmount',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'tokenByIndex',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'walletOfOwner',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
];

export default function App() {
  const [account, setAccount] = useState('');
  const [smartContract, setSmartContract] = useState(null);
  const [connector, setConnector] = useState(null);
  const [balances, setBalances] = useState({});
  const [userNfts, setUserNfts] = useState([]);
  const [Nfts, setNfts] = useState([]);
  const [listedNfts, setListedNfts] = useState([]);
  const [selectedNft, setSelectedNft] = useState(null);
  const [sellPrice, setSellPrice] = useState('');
  const [startIndex, setStartIndex] = useState(0);
  const [showBetaWarning, setShowBetaWarning] = useState(true);
  const [itemsForSale, setItemsForSale] = useState([]);

  const [sellTokenId, setSellTokenId] = useState(null);
  const [count, setCount] = useState(0);
  const [Rewards, setRewards] = useState(0);
  const [rewardBalance, setRewardBalance] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const handleClick = () => {
    setIsLoading(true);

    // Do something that takes a long time...
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleNotification = (message) => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setNotification(message);

      setTimeout(() => {
        setNotification(null);
      }, 4000);
    }, 2000);
  };

  // Load First Ten NFTs
  const getFirstTen = () => {
    setStartIndex(startIndex + 0);
    getNFTs(startIndex + 0);
  };

  // MAIN FUNCTIONS
  //-----------------------

  // Get NFTs
  async function getNFTs(startIndex) {
    const contract = new Web3EthContract(ABI, NFTCONTRACT);
    const address = account;

    let totalNFTs = 0;
    let nfts = [];

    // Get the total number of NFTs held by the user
    totalNFTs = await contract.methods.balanceOf(address).call();
    //console.log('totalNFTs:', totalNFTs);
    // Loop through all of the NFTs held by the user

    for (let i = startIndex; i < startIndex + 10; i++) {
      if (i >= totalNFTs) {
        break;
      }
      // Get the token ID for the current NFT
      const tokenId = await contract.methods
        .tokenOfOwnerByIndex(address, i)
        .call();
      //console.log('tokenId:', tokenId);
      // Get the NFT metadata and image URI
      const uri = await contract.methods.tokenURI(tokenId).call();
      const ipfsURL = addIPFSProxy(uri);
      const request = new Request(ipfsURL);
      const response = await fetch(request);
      const metadata = await response.json();
      //console.log(metadata.name); // Metadata in JSON

      const image = addIPFSProxy(metadata.image);
      let jsonData = {};
      //console.log('uri:', uri);
      ///console.log(metadata);
      //console.log(metadata.artist);
      //console.log(image);

      let jsonString = JSON.stringify(uri.replace(/ipfs:\/\//g, 'https://'));

      jsonData = JSON.parse(jsonString);
      //console.log(jsonData);

      let name = addIPFSProxy(metadata.name);
      ///console.log(metadata.name);
      let description = addIPFSProxy(metadata.description);
      ///console.log(description)

      // Add the NFT information to the array
      nfts.push({
        tokenId: tokenId,
        metadata: metadata,
        image: image,
      });
      //console.log(nfts);

      // Build and display the HTML element for each NFT
      // Build and display the HTML element for each NFT
      let content = `
				<div class="row justify-content-center">
				  <div class="col-md-4">
					<div class="card-wrapper">
					  <div class="card">
						<img src="${image}" class="card-img-top" width="100%" height="auto" />
						<div class="card-body">
						  <h5 class="card-title">${metadata.name}</h5>
					  
								<div class="form-group">
								<input type="number" name="AskingPrice" class="form-control" id="askingPriceInput" placeholder="Enter price">
										  </div>
						  <button type="button" class="btn btn-primary stake-btn zoom" data-tokenid="${tokenId}">List NFT</button>
										
										
						</div>
					  </div>
					</div>
				  </div>
				</div>

								  <style>
					.card-wrapper {
	  width: 100%;
	  max-width: 100%;
	  padding: 20px;
	  box-sizing: border-box;
	  display: flex;
	  align-items: stretch;
	}
	.card {
	  background-color: #fff;
	  border: 2px solid #1f87f5;
	  border-radius: 10px;
	  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
	  margin-bottom: 20px;
	  padding: 20px;
	  flex-grow: 1;
	  height: 100%;
	}

	  .card-title {
		font-size: 24px;
		font-weight: 700;
		margin-bottom: 10px;
	  }

	  .card-text {
		font-size: 16px;
		margin-bottom: 20px;
	  }

	  .card-img-top {
		height: 100%;
		max-width: 100%;
		object-fit: cover;
	  }


				  


					  .zoom {
						transition: transform 0.5s ease;
					  }

					  .zoom:hover {
						transform: scale(1.1);
					  }

					  .btn {
						transition: background-color 0.5s ease;
						color: #fff;
					  }

					  .btn:hover {
						background-color: #1f87f5;
					  }

					  #stakeBtn, #unstakeBtn, #claimBtn {
						position: relative;
					  }

					  #stakeBtn:after, #unstakeBtn:after, #claimBtn:after {
						content: '';
						display: block;
						width: 30px;
						height: 30px;
						border: 2px solid #fff;
						border-top: 2px solid transparent;
						border-radius: 50%;
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%) rotate(0deg);
						animation: rotate 1s infinite linear;
					  }

					  @keyframes rotate {
						0% {
						  transform: translate(-50%, -50%) rotate(0deg);
						}
						100% {
						  transform: translate(-50%, -50%) rotate(360deg);
						}
					  }

					  #stakeBtn.loading:after, #unstakeBtn.loading:after, #claimBtn.loading:after,
					</style>
				</div>
				`;

      document.getElementById('nftid').innerHTML += content;

      // Add event listener to stake buttons
      document.querySelectorAll('.stake-btn').forEach((btn) => {
        btn.addEventListener('click', async (event) => {
          const tokenId = event.target.dataset.tokenid;
          const askingPriceInput = document.getElementById('askingPriceInput');
          const askingPrice = Number(askingPriceInput.value);
          console.log(askingPrice);

          const nftTokenAddress = '0x230Bb7ce185CD0042973202f5F38B7072440e2C9';
          const marketplaceAddress =
            '0xa12A3A4ED947e38Ad0c177799De37DD77F520E62';

          const contract = new Web3EthContract(testABI, testContract);
          const rewardcontract = new Web3EthContract(
            REWARDSABI,
            REWARDSCONTRACT
          );
          const NFTcontract = new Web3EthContract(ABI, NFTCONTRACT);

          await NFTcontract.methods
            .approve(marketplaceAddress, tokenId)
            .send({ from: blockchain.account });
          const result = await contract.methods
            .addItemToMarket(tokenId, nftTokenAddress, askingPrice)
            .send({ from: blockchain.account });
          if (result.status) {
            // Display success notification
            Swal.fire({
              icon: 'success',
              title: 'NFT listed successfully',
              showConfirmButton: false,
              timer: 5000,
            });
          }
        });
      });

      // Add event listener to stake buttons
      document.querySelectorAll('.claim-btn').forEach((btn) => {
        btn.addEventListener('click', async (event) => {
          const tokenId = event.target.dataset.tokenid;

          const contract = new Web3EthContract(ABI, NFTCONTRACT);
          const vaultcontract = new Web3EthContract(VAULTABI, STAKINGCONTRACT);

          vaultcontract.methods
            .stake([tokenId])
            .send({ from: blockchain.account });
        });
      });

      let startIndex = 10;
      const loadMoreBtn = document.querySelector('#load-more-btn');

      /*loadMoreBtn.addEventListener("click", async () => {
					startIndex += 10;
					await getNFTs(startIndex);
				});*/
    }
    return nfts;
    setNfts(nfts);
  }

  function showNotification() {
    Swal.fire({
      title: 'Success!',
      text: 'Test',
      icon: 'success',
      confirmButtonText: 'Ok',
    });
  }

  async function displayNFTsFeatures() {
    const nftTokenAddress = '0x1632568C5DeA50b5738c6C7bE2786657A9840485';
    const marketplaceAddress = '0xa12A3A4ED947e38Ad0c177799De37DD77F520E62';

    // NEW FUNCTIONALITY
    const nftContracts = [
      {
        address: '0x1632568C5DeA50b5738c6C7bE2786657A9840485',
        abi: CROCELLSABI,
      },
      {
        address: '0x2e756776A63F936a6010Dd9ee5C5fE77b5E02562',
        abi: CROBADGEABI,
      },
      {
        address: '0x230Bb7ce185CD0042973202f5F38B7072440e2C9',
        abi: ABI,
      },
      {
        address: bdlContract,
        abi: BDLABI,
      },
      {
        address: CroMinionsContract,
        abi: MINIONSABI,
      },
      {
        address: blumiesContract,
        abi: BlumiesABI,
      },
      // add more NFT contracts as needed
    ];

    const NFTcontract = new Web3EthContract(CROCELLSABI, CROCELLSCONTRACT);
    const marketplaceContract = new Web3EthContract(testABI, testContract);

    try {
      // Check if user is logged in before calling getItemsForSale
      if (!blockchain.account) {
        // User is not logged in, display error message
        alert('Please log in to continue');
        return;
      }

      // Display notification while we are fetching the NFTs
      const loadingNotification = Swal.fire({
        title: 'Fetching NFTs',
        html: 'Please wait...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      for (let i = 0; i < nftContracts.length; i++) {
        const contract = new Web3EthContract(
          nftContracts.find((nft) => nft.address === nftTokenAddress).abi,
          nftTokenAddress
        );

        const itemsForSale = await marketplaceContract.methods
          .getItemsForSale()
          .call({ from: blockchain.account });
        console.log(itemsForSale);
        const marketplaceItemsDiv = document.getElementById('marketplaceItems');

        itemsForSale.forEach(async (item) => {
          const itemDiv = document.createElement('div');

          const ListingID = item[0];
          const nftTokenAddress = item[1];
          const NFTtokenID = item[2];
          const seller = item[3];
          const askingPrice = item[4];
          const isSold = item[5];

          // Add the item's metadata and image to the itemDiv
          const content = document.createElement('div');
          content.innerHTML = `
          <p>Listing ID: ${ListingID}</p>
          <p>NFT Token ID: ${NFTtokenID}</p>
          <p>Token Address: ${nftTokenAddress}</p>
          <p>Price: ${askingPrice}</p>
          `;
          itemDiv.appendChild(content);

          // Get the NFT metadata and image URI
          let uri, metadata, image;
          for (let j = 0; j < nftContracts.length; j++) {
            if (nftTokenAddress === nftContracts[j].address) {
              const contract = new Web3EthContract(
                nftContracts[j].abi,
                nftTokenAddress
              );
              uri = await contract.methods.tokenURI(NFTtokenID).call();
              const ipfsURL = addIPFSProxy(uri);
              const request = new Request(ipfsURL);
              const response = await fetch(request);
              metadata = await response.json();
              image = addIPFSProxy(metadata.image);
              break;
            }
          }

          // Create an <img> element for the NFT image
          const img = document.createElement('img');
          img.src = image;
          itemDiv.appendChild(img);

          // Create a Buy button element
          const buyButton = document.createElement('button');
          buyButton.innerHTML = 'Buy';

          // Create a new instance of the rewards contract
          const rewardsContract = new Web3EthContract(
            REWARDSABI,
            REWARDSCONTRACT
          );

          // Define the amount of ether to be sent as a reward
          const rewardAmount = 10;
          // Set the amount of tokens to transfer
          const amount = 100;
          // Convert the amount to wei

          // Define a state variable to keep track of the reward balance

          // Define a state variable to store the reward balances
          const [rewardBalances, setRewardBalances] = useState({});

          // Update the buyItem function to add rewards to rewardBalance
          buyButton.addEventListener('click', async () => {
            try {
              // Call the "buyItem" function on the smart contract to purchase the NFT
              const result = await marketplaceContract.methods
                .buyItem(item[0])
                .send({
                  from: blockchain.account,
                  value: Web3Utils.toWei(askingPrice, 'ether'),
                });

              if (result.status) {
                // Get the current reward balance for the user's account address
                const currentBalance = rewardBalances[blockchain.account] || 0;

                // Increment the reward balance by the amount earned
                const newBalance = currentBalance + 10;

                // Update the reward balance in the state variable
                setRewardBalances({
                  ...rewardBalances,
                  [blockchain.account]: newBalance,
                });

                // Display success notification
                Swal.fire({
                  icon: 'success',
                  title: 'NFT Purchased successfully',
                  text: 'You have been rewarded with 10 tokens!',
                  showConfirmButton: false,
                  timer: 5000,
                });
              }
            } catch (error) {
              // Display error message if buyItem function fails
              alert(error.message);
            }
          });

          // Add the Buy button to the itemDiv
          itemDiv.appendChild(buyButton);

          // Check if NFT already exists in the marketplaceItemsDiv
          const existingNFTs = marketplaceItemsDiv.querySelectorAll(
            `div[data-tokenid='${NFTtokenID}']`
          );

          if (existingNFTs.length === 0) {
            // If the NFT does not exist in the marketplaceItemsDiv, add it
            itemDiv.setAttribute('data-tokenid', NFTtokenID);
            marketplaceItemsDiv.appendChild(itemDiv);
          } else {
            // If the NFT already exists in the marketplaceItemsDiv, do not add it
            console.log(`Duplicate NFT found: ${NFTtokenID}`);
          }
        });
      }
      // NEW FUNCTIONALITY
      Swal.fire({
        title: 'NFTs displayed!',
        text: 'NFTs have been fetched and displayed successfully',
        icon: 'success',
        confirmButtonText: 'Ok',
      });
    } catch (error) {
      // Display error message if getItemsForSale function fails
      alert(error.message);
    }
  }

  async function displayNFTs() {
    // Show loading spinner while fetching NFTs
    console.log('Show loading spinner while fetching NFTs');
    const loadingSwal = Swal.fire({
      title: 'Loading NFTs',
      html: 'Please wait while we fetch your NFTs...',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false,
      onOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // Call functions to get NFTs here

      await getFirstTen();

      // Close the loading spinner when NFTs are fetched successfully
      loadingSwal.close();

      // Display success message to user
      Swal.fire({
        title: 'Success!',
        text: 'NFTs fetched successfully.',
        icon: 'success',
        confirmButtonText: 'Ok',
      });
    } catch (error) {
      // Display error message to user if any of the functions fail
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  }

  function addIPFSProxy(ipfsHash) {
    const URL = 'https://idm.infura-ipfs.io/ipfs/';
    const hash = ipfsHash.replace(/^ipfs?:\/\//, '');
    const ipfsURL = URL + hash;

    //console.log(ipfsURL)
    return ipfsURL;
  }

  function handleConnect() {
    // if (isUserLoggedIn()) {
    //   getFirstTenBadges();
    //   getFirstTenCells();
    //   getFirstTen();
    //   getMinionsNFTs();
    //   getBdlNFTs();
    //   console.log("User is logged in")
    // } else {
    //   // Prompt the user to connect first
    //   console.log("need to log in")
    // }

    console.log('Connected:', account);
    // Display success notification
    Swal.fire({
      icon: 'success',
      title: 'Connected successfully',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  const modalCloseButtons = document.querySelectorAll('.modal-close');
  modalCloseButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal');
      closeModal(modal);
    });
  });

  const modals = document.querySelectorAll('.modal');
  modals.forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });

  function closeModal(modal) {
    modal.style.display = 'none';
  }

  const images = document.querySelectorAll('#marketplaceItems img');
  images.forEach((image) => {
    const targetSelector = image.dataset.modalTarget;
    if (targetSelector) {
      const targetModal = document.querySelector(targetSelector);
      if (targetModal) {
        image.addEventListener('click', () => {
          targetModal.style.display = 'block';
        });
      }
    }
  });

  async function connectWallet() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const web3 = new Web3(window.ethereum);
      // Add a listener for the accountsChanged event
      window.ethereum.on('accountsChanged', (account) => {
        // Update the current account
        setAccount(account[0]);
        console.log('Connected account:', account[0]);
      });
      // ...
    } catch (error) {
      console.log(error);
      alert('Connection failed. Please try again!');
    }
  }

  const connectedAccount = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : '';

  return (
    <div>
      <div className="notification-wrapper">
        <NotificationContainer
          position="top-center"
          contentClassName="custom-notification"
        />
      </div>
      <p>Start editing to see some magic happen :)</p>
      <button onClick={connectWallet}>Connect</button>
      <p>Connected as {connectedAccount}</p>
      <StyledButton
        bgColor="#28a745"
        color="#fff"
        hoverBgColor="#218838"
        className="zoom btn-hover"
        onClick={displayNFTs}
      >
        GET NFTS
      </StyledButton>
      <p>{account}</p>
      <div class="grid-container">
        <div class="grid-item">
          <h2>CroCell NFTs</h2>
          <div id="nftid3"></div>
        </div>
        <div class="grid-item">
          <h2>CroBadge NFTs</h2>
          <div id="nftid4"></div>
        </div>

        <div class="grid-item">
          <h2>Crook NFTs</h2>
          <div id="nftid"></div>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item">
          <h2>CCPD: CroPugs</h2>
          <div id=""></div>
        </div>
        <div class="grid-item">
          <h2>croMinions</h2>
          <div id="nftidM"></div>
        </div>

        <div class="grid-item">
          <h2>External Projects</h2>
          <div id="nftidA"></div>
        </div>
      </div>
    </div>
  );
}
