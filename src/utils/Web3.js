import jazzicon from '@metamask/jazzicon';
const ethers = require("ethers") 
//import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";
const CONTRACT_ABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "author",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "content",
                "type": "string"
            }
        ],
        "name": "PostCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "user",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newLikeCount",
                "type": "uint256"
            }
        ],
        "name": "PostLiked",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_content",
                "type": "string"
            }
        ],
        "name": "createPost",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "postCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "posts",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "pId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "author",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "content",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "likes",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_postId",
                "type": "uint256"
            }
        ],
        "name": "toggleLike",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "userLikes",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]; 

export const getWeb3Provider = async () => {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            const provider = new ethers.BrowserProvider(window.ethereum);
            
            //console.log("Provider created:", provider);
            return provider;
        } catch (error) {
            console.error("User denied account access", error);
            throw error;
        }
    } else {
        throw new Error("MetaMask is not installed");
    }
};

export const getContract = async (provider) => {
    try {
        const signer = await provider.getSigner();
        console.log("Signer:", signer);
        
        const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            signer
        );
        
        console.log("Contract interface:", contract.interface);
        console.log("Available functions:", contract.interface.fragments);
        

        return contract;
    } catch (error) {
        console.error("Failed to get contract:", error);
        throw error;
    }
};

export const getUserInfo = async (provider) => {
    try {
        const address = (await provider.getSigner()).address;
        const balance = await provider.getBalance(address);
        const balanceEth = ethers.formatEther(balance);

        let avatar = generateProfileIcon(address);
        const profile = {}
        profile.address = address;
        profile.balance = balanceEth;
        profile.avatar = avatar;

        return profile;
    } catch (err) {
        console.err(err);
    }

}

export const generateProfileIcon = (address) => {
    const numericSeed = parseInt(address.slice(2, 10), 16); // 주소를 숫자로 변환
    const icon = jazzicon(40, numericSeed); // Jazzicon 생성
    return icon;
}
