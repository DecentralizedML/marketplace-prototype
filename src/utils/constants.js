import DmlMarketplace from '../solidity/build/contracts/DmlMarketplace.json';
import DmlBountyFactory from '../solidity/build/contracts/DmlBountyFactory.json';
import FixedSupplyToken from '../solidity/build/contracts/FixedSupplyToken.json';
import Bounty from '../solidity/build/contracts/Bounty.json';
import Algo from '../solidity/build/contracts/Algo.json';

// Ropsten0x5eA73f388F6FD7D37701e3832194B05bB15ae5c4
// export const TOKEN_CONTRACT_ADDRESS = '';

// Rinkeby
// export const TOKEN_CONTRACT_ADDRESS = '0x3195fd025302c62907886b1743405e14a89514b6';
// export const MARKETPLACE_CONTRACT_ADDRESS = '0x72b7440ca56b5f8841e881d92781ec3f389b60c6';
// export const BOUNTY_FACTORY_ADDRESS = '0xaafd5d14e05A7C1030B13B2879458c1F86eDEe0C';

// Main Net
// 0xbCdfE338D55c061C084D81fD793Ded00A27F226D
// export const TOKEN_CONTRACT_ADDRESS = '0xbCdfE338D55c061C084D81fD793Ded00A27F226D';
// export const MARKETPLACE_CONTRACT_ADDRESS = '0x3ec80b91a87b08633bd2d40da71d4b6744807abe';
// export const BOUNTY_FACTORY_ADDRESS = '0xf90126f0f65839c5820aabc90b2fc18285196383';

// New Main Net
export const TOKEN_CONTRACT_ADDRESS = '0xbCdfE338D55c061C084D81fD793Ded00A27F226D';
export const MARKETPLACE_CONTRACT_ADDRESS = '0x8ed59FDBFDC14dBD87d1d74a6cBBdF16C3D787E5';
export const BOUNTY_FACTORY_ADDRESS = '0x1d34133a2C5A3B426C9Ccde60f04B046265E183E';

export const TOKEN_CONTRACT_ABI = FixedSupplyToken.abi;
export const MARKETPLACE_CONTRACT_ABI = DmlMarketplace.abi;
export const BOUNTY_FACTORY_ABI = DmlBountyFactory.abi;
export const BOUNTY_ABI = Bounty.abi;
export const ALGO_ABI = Algo.abi;

export const BOUNTY_STATUS = {
  Initialized: 0,
  EnrollmentStart: 1,
  EnrollmentEnd: 2,
  BountyStart: 3,
  BountyEnd: 4,
  EvaluationEnd: 5,
  Completed: 6,
  Paused: 7,
};
