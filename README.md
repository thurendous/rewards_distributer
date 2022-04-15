# Rewards Distributer
This software provides a functionality to distribute tokens as rewards to target users. The distribution is based on Merkle Tree algorithm. Admins of the contract can specify any tokens to distribute to their users.

Technical stacks are as follows:
- Solidity
- Hardhat
- Typescript
- React (React Query)

Solidity source codes use following techniques or algorithms:
- OpenZeppelin
  - [Merkle Proof](https://docs.openzeppelin.com/contracts/4.x/api/utils#MerkleProof)
  - [Reentrancy Guard](https://docs.openzeppelin.com/contracts/4.x/api/security#ReentrancyGuard)
  - [Access Control](https://docs.openzeppelin.com/contracts/4.x/api/access)
  - [Hardhat Upgrades API](https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades)

Currently provides Simple Distributer and Versioning Distributer (Versioning Distributer is not yet ready as of Jan 27, 2022).
Functionalities of Simple Distributer are as follows:
- Admins or moderators can specify target address who should receive tokens as rewards and their eligible amounts
- Users can only claim their rewards once as default. Admins or moderators need to change isClaimed flag to false per user.
- It supports upgradeablity provided by Hardhat and OpenZeppelin

Versioning Distributer is designed to accomodate more compilicated cases such as following:
- Users can receive multiple rewards at different timing. Admins or moderators do not need to reset isClaimed flag
- Specs TBD...

# Demo
[demo website](https://terrier-lover.github.io/rewards_distributer/)
- If you want to receive USDC on Rinkeby network, please add your request [here](https://github.com/terrier-lover/rewards_distributer/issues/2)

[demo images](https://github.com/terrier-lover/rewards_distributer/blob/main/demo/README.md)

# How to install
- $ git clone https://github.com/terrier-lover/rewards_distributer.git

## Preparation
Following files must be updated prioer to the installation process.
- hardhat/.env
  - \*\*\*_URL
    - **_required_**
    - Set URL of RPC network that you want to use (For example, Alchemy or others). 
  - \*\*\*_ERC20_CONTRACT_ADDRESS
    - _**required** when setting own ERC20 token_ 
    - This is required when setting own ERC20 token. 
  - \*\*\*_PRIVATE_KEY_OWNER
    - _**required** for non-localhost_
    - Set private key of main account. This account will deploy contracts, so it needs to have enough tokens which are needed for the deployment. 
  - \*\*\*_PRIVATE_KEY_OTHER1
    - **_optional_**
    - Set private key of other account. Not required.
- hardhat/rawRecipientsInfo.json
  - Specify information of recipients. Set following values:
    - address: address of recipient
    - amount: reward amount for recipient. 
    - uniqueKey: To handle duplications of recipients, specify unique key for the pair of address and amount. Please see [the detail of the data structure](https://gist.github.com/terrier-lover/80a2fb07320248a5a5de06b75caa0aed) used in this contract.
- hardhat/hardhat.config.ts
  - Set appropriate values for config variable
- frontend/src/CustomInputs.ts
  - TOKEN_IMAGE_URL
    - _required_ 
    - Set image used in the website
  - SUPPORTED_CHAIN_IDS_IN_WEB
    - _required_ 
    - Chain IDs which should be shown in the website
  - NETWORK_NAMES, CHAIN_IDS, CHAINS_IDS_AND_NETWORK_NAME_MAPPINGS
    - _optional_ 
    - Definitions of network and chainIds 

## Hardhat & Frontend, npm installation
- $ cd frontend
- $ npm install
- $ cd hardhat
- $ npm install

## Hardhat, deploy
- $ cd hardhat 
- Prepare .env using .env.example.  

# localhost Hardhat, deploy
If you want to use localnet, do followings:
- $ npm run hnode

```typescript
//./scripts/deploy.ts
// Please change line 46 as follows.
const SHOULD_USE_EXTERNAL_ERC20_TOKEN = false;
```
- $ npm run deploy:local ./scripts/deploy.ts

Whenever hardhat compiles and produces new typechains (this is exported under ./hardhat/typechain), copy typechains in hardhat/typechain/ to /frontend/src/typechain/ so that frontend code can use latest definitions. In addition, change the front-end codebase accordingly.

## Frontend, prepare webserver
- $ cd frontend
- $ npm start

# How to test
- cd hardhat
- npx hardhat test

# Future work
- Bug fixes
  - Feel free to create issues [here](https://github.com/terrier-lover/rewards_distributer/issues)
- Add more test cases
- Support Matic network
 
## References
- [Uniswap Merkle Distributer implementation](https://github.com/Uniswap/merkle-distributor)
- [Open Zeppelin - Merkle Tree impelemntation of NFT airdrop](https://blog.openzeppelin.com/workshop-recap-building-an-nft-merkle-drop/ )
- [Merkle airdrop starter](https://github.com/Anish-Agnihotri/merkle-airdrop-starter)

## License - MIT License

Copyright 2022 TerrierLover

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
