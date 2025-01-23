
// Hyperswap V2 SDK - Add Liquidity

const { ethers } = require("ethers");

// Router Contract Address
const ROUTER_ADDRESS = "0x85aA63EB2ab9BaAA74eAd7e7f82A571d74901853";

// Token Addresses
const USDC_ADDRESS = "0x24ac48bf01fd6CB1C3836D08b3EdC70a9C4380cA";

// Router ABI (Partial, focused on add liquidity function)
const ROUTER_ABI = [
  "function addLiquidityETH(
    address token,
    uint amountTokenDesired,
    uint amountTokenMin,
    uint amountETHMin,
    address to,
    uint deadline
  ) external payable returns (uint amountToken, uint amountETH, uint liquidity)"
];

// Initialize Router Contract
const getRouterContract = (provider) => {
  return new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, provider);
};

// Add Liquidity with USDC and ETH
async function addLiquidityETHWithUSDC(
  provider,
  signer,
  amountUSDCDesired,
  amountUSDCMin,
  amountETHMin,
  to
) {
  const router = getRouterContract(provider).connect(signer);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

  const tx = await router.addLiquidityETH(
    USDC_ADDRESS,
    amountUSDCDesired,
    amountUSDCMin,
    amountETHMin,
    to,
    deadline,
    { value: ethers.utils.parseEther("1") } // Replace "1" with the desired ETH amount
  );

  return tx.wait();
}

module.exports = {
  addLiquidityETHWithUSDC
};
