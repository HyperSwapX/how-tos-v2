// Hyperswap V2 SDK - Swap Functions

const { ethers } = require("ethers");
const routerABI = require("./abi/router_abi.json");

// Router Contract Address
const ROUTER_ADDRESS = "0x85aA63EB2ab9BaAA74eAd7e7f82A571d74901853";

// Initialize Router Contract
const getRouterContract = (provider) => {
  return new ethers.Contract(ROUTER_ADDRESS, routerABI, provider);
};

// Swap ETH for USDC (Buy)
async function swapETHForUSDC(provider, signer, amountOutMin, to) {
  const router = getRouterContract(provider).connect(signer);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
  const path = ["0x0000000000000000000000000000000000000000", "0x24ac48bf01fd6CB1C3836D08b3EdC70a9C4380cA"];

  const tx = await router.swapExactETHForTokensSupportingFeeOnTransferTokens(
    amountOutMin,
    path,
    to,
    deadline,
    { value: ethers.utils.parseEther("1") } // Replace "1" with the desired ETH amount
  );

  return tx.wait();
}

// Swap USDC for ETH (Sell)
async function swapUSDCForETH(provider, signer, amountIn, amountOutMin, to) {
  const router = getRouterContract(provider).connect(signer);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
  const path = ["0x24ac48bf01fd6CB1C3836D08b3EdC70a9C4380cA", "0x0000000000000000000000000000000000000000"];

  const tx = await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
    amountIn,
    amountOutMin,
    path,
    to,
    deadline
  );

  return tx.wait();
}

module.exports = {
  swapETHForUSDC,
  swapUSDCForETH
};
