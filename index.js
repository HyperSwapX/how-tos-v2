require("dotenv").config(); // Load environment variables
const { ethers } = require("ethers");
const { swapETHForUSDC } = require("./src/hyperswap_swap_functions");
const { addLiquidityETHWithUSDC } = require("./src/hyperswap_liquidity_with_calculation");

// Set up provider and signer
const provider = new ethers.providers.JsonRpcProvider("https://rpc.example.com"); // Replace with your RPC URL
const privateKey = process.env.PRIVATE_KEY;
const signer = new ethers.Wallet(privateKey, provider);

async function main() {
  try {
    // Call the Swap Function
    console.log("Swapping ETH for USDC...");
    const amountOutMin = ethers.utils.parseUnits("100", 6); // Minimum USDC expected
    const to = "0xYourWalletAddressHere"; // Replace with your wallet address
    const ethAmount = 0.1; // Amount of ETH to swap
    await swapETHForUSDC(provider, signer, amountOutMin, to, ethAmount);
    console.log("Swap completed!");

    // Call the Add Liquidity Function
    console.log("Adding liquidity...");
    const usdcMin = ethers.utils.parseUnits("100", 6); // Minimum USDC expected
    const ethMin = ethers.utils.parseEther("0.1"); // Minimum ETH expected
    await addLiquidityETHWithUSDC(provider, signer, ethAmount, usdcMin, ethMin, to);
    console.log("Liquidity added!");
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
