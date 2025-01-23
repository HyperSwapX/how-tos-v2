// Hyperswap V2 SDK - Add Liquidity

const { ethers } = require("ethers");
const routerABI = require("./abi/router_abi.json");

// Router Contract Address
const ROUTER_ADDRESS = "0x85aA63EB2ab9BaAA74eAd7e7f82A571d74901853";

// Initialize Router Contract
const getRouterContract = (provider) => {
  return new ethers.Contract(ROUTER_ADDRESS, routerABI, provider);
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
    "0x24ac48bf01fd6CB1C3836D08b3EdC70a9C4380cA",
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
