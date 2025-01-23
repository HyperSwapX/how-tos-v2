require("dotenv").config(); // Load environment variables
const { ethers } = require("ethers");
const { swapETHForUSDC } = require("./src/hyperswap_swap_functions");
const { swapUSDCForETH } = require("./src/hyperswap_swap_functions");
const { addLiquidityETHWithUSDC } = require("./src/hyperswap_liquidity_functions");

// Set up provider and signer
const provider = new ethers.providers.JsonRpcProvider("https://api.hyperliquid-testnet.xyz/evm"); // Corrected URL
const privateKey = process.env.PRIVATE_KEY;
const walletAddress = process.env.WALLET_ADDRESS;

try {
  const signer = new ethers.Wallet(privateKey, provider);
  console.log("Wallet successfully initialized");

  async function main() {
    try {
      // Call the Swap Function
      console.log("Swapping ETH for USDC...");
      const amountOutMin = ethers.utils.parseUnits("100", 6); // Minimum USDC expected
      const to = walletAddress; // Replace with your wallet address
      const ethAmount = "0.1"; // Amount of ETH to swap
     await swapETHForUSDC(provider, signer, amountOutMin, to, ethAmount);
     console.log("Swap ETH → USDC completed!");

      console.log("Swapping USDC for ETH...");
      const usdcAmount = ethers.utils.parseUnits("100", 6); // 100 USDC
      const slippageTolerance = 2; // 2% slippage
      await swapUSDCForETH(provider, signer, usdcAmount, slippageTolerance, to);
      console.log("Swap USDC → ETH completed!");

      // Call the Add Liquidity Function
      console.log("Adding liquidity...");

      // Calculate slippage-adjusted minimums
      const ethMin = ethers.utils.parseEther(ethAmount).mul(100 - slippageTolerance).div(100);
      const usdcMin = ethers.utils.parseUnits("100", 8).mul(100 - slippageTolerance).div(100); // Adjust based on expected USDC

      await addLiquidityETHWithUSDC(provider, signer, ethAmount, usdcMin, ethMin, to);
      console.log("Liquidity added!");
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }

  main();
} catch (error) {
  console.error("Error initializing wallet:", error);
}
