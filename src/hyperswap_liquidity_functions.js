// Hyperswap V2 SDK - Add Liquidity with Calculation

const { ethers } = require("ethers");
const routerABI = require("./abi/router_abi.json");

// Router Contract Address
const ROUTER_ADDRESS = "0x85aA63EB2ab9BaAA74eAd7e7f82A571d74901853";

// Token Addresses
const USDC_ADDRESS = "0x24ac48bf01fd6CB1C3836D08b3EdC70a9C4380cA";
const WETH_ADDRESS = "0xADcb2f358Eae6492F61A5F87eb8893d09391d160";

// Initialize Router Contract
const getRouterContract = (provider) => {
  return new ethers.Contract(ROUTER_ADDRESS, routerABI, provider);
};

// Helper: Calculate Optimal Token Amounts
async function calculateOptimalUSDCAmount(provider, ethAmount) {
  const router = getRouterContract(provider);
  const path = [WETH_ADDRESS, USDC_ADDRESS]; // ETH -> USDC

  // Use the router to get the estimated USDC amount for the provided ETH amount
  const amountsOut = await router.getAmountsOut(ethAmount, path);
  return amountsOut[1]; // USDC amount
}

// Add Liquidity with USDC and ETH
async function addLiquidityETHWithUSDC(
  provider,
  signer,
  ethAmount,
  usdcMin,
  ethMin,
  to
) {
  const router = getRouterContract(provider).connect(signer);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

  // Calculate the optimal amount of USDC based on the ETH amount
  const usdcAmountDesired = await calculateOptimalUSDCAmount(provider, ethAmount);

  const tx = await router.addLiquidityETH(
    USDC_ADDRESS,
    usdcAmountDesired,
    usdcMin,
    ethMin,
    to,
    deadline,
    { value: ethAmount } // Pass the ETH amount directly
  );

  return tx.wait();
}

module.exports = {
  addLiquidityETHWithUSDC
};
