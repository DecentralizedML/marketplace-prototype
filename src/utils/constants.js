import DmlMarketplace from '../solidity/build/contracts/DmlMarketplace.json';
import DmlBountyFactory from '../solidity/build/contracts/DmlBountyFactory.json';
import FixedSupplyToken from '../solidity/build/contracts/FixedSupplyToken.json';
import Bounty from '../solidity/build/contracts/Bounty.json';

// Ropsten
// export const TOKEN_CONTRACT_ADDRESS = '0x5eA73f388F6FD7D37701e3832194B05bB15ae5c4';

// Rinkeby
export const TOKEN_CONTRACT_ADDRESS = '0x3195fd025302c62907886b1743405e14a89514b6';
export const MARKETPLACE_CONTRACT_ADDRESS = '0x3195fd025302c62907886b1743405e14a89514b6';
export const BOUNTY_FACTORY_ADDRESS = '0xccb4331d206d177ff6acc8d9fc5139862e6377fc';


export const TOKEN_CONTRACT_ABI = FixedSupplyToken.abi;
export const MARKETPLACE_CONTRACT_ABI = DmlMarketplace.abi;
export const BOUNTY_FACTORY_ABI = DmlBountyFactory.abi;
export const BOUNTY_ABI = Bounty.abi;

