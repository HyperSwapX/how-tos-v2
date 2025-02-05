// Hyperswap V2 SDK - Swap Functions

const { ethers } = require("ethers");
const routerABI = require("./abi/router_abi.json");

// Router Contract Address
const ROUTER_ADDRESS = "0xD19222370B1944a5392f98028C3E70AFD3a673dF";

// Initialize Router Contract
const getRouterContract = (provider) => {
  return new ethers.Contract(ROUTER_ADDRESS, routerABI.abi, provider);
};

// Token Addresses
const USDC_ADDRESS = "0x24ac48bf01fd6CB1C3836D08b3EdC70a9C4380cA";
const WETH_ADDRESS = "0xADcb2f358Eae6492F61A5F87eb8893d09391d160";

// Swap ETH for USDC (Buy)
async function swapETHForUSDC(provider, signer, amountOutMin, to, ethAmount) {
  console.log("Starting swapETHForUSDC...");

  // Validate the recipient address
  if (!ethers.utils.isAddress(to)) {
    throw new Error(`Invalid recipient address: ${to}`);
  }

  const router = getRouterContract(provider).connect(signer);

  // Use an integer for the deadline
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

  const path = [WETH_ADDRESS, USDC_ADDRESS];

  // Validate addresses in path
  path.forEach((address) => {
    if (!ethers.utils.isAddress(address)) {
      throw new Error(`Invalid address in path: ${address}`);
    }
  });

  const ethAmountParsed = ethers.utils.parseEther(ethAmount.toString());

  // Use ethers.constants.AddressZero as the referrer
  const referrer = ethers.constants.AddressZero;

  // Call the function with the corrected arguments
  const tx = await router.swapExactETHForTokensSupportingFeeOnTransferTokens(
    amountOutMin,
    path,
    to,
    referrer, // Add the referrer argument
    deadline, // Pass the deadline
    { value: ethAmountParsed }
  );

  return tx.wait();
}

// Swap USDC for ETH (Sell)
async function swapUSDCForETH(provider, signer, amountIn, slippageTolerance, to) {
  console.log("Starting swapUSDCForETH...");

  // Validate the recipient address
  if (!ethers.utils.isAddress(to)) {
    throw new Error(`Invalid recipient address: ${to}`);
  }

  const router = getRouterContract(provider).connect(signer);

  // Calculate the expected amount of ETH
  const path = [USDC_ADDRESS, WETH_ADDRESS]; // USDC → ETH

  const amountsOut = await router.getAmountsOut(amountIn, path);
  const expectedETH = amountsOut[1];

  // Apply slippage tolerance
  const slippageFactor = ethers.BigNumber.from(100 - slippageTolerance).mul(ethers.utils.parseUnits("1", 18)).div(100);
  const amountOutMin = expectedETH.mul(slippageFactor).div(ethers.utils.parseUnits("1", 18));

  // Use an integer for the deadline
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now

  // Approve the router to spend USDC (if not already approved)
  const usdcContract = new ethers.Contract(
    USDC_ADDRESS, // USDC address
    [
      "function approve(address spender, uint256 amount) public returns (bool)"
    ],
    signer
  );
  console.log("Approving USDC...");
  await usdcContract.approve(router.address, amountIn);

  console.log("USDC approved. Proceeding with swap...");

  // Perform the swap
  const referrer = ethers.constants.AddressZero;

  const tx = await router.swapExactTokensForETHSupportingFeeOnTransferTokens(
    amountIn,
    amountOutMin, // Calculated dynamically
    path,
    to,
    referrer,
    deadline
  );

  return tx.wait();
}

module.exports = {
  swapETHForUSDC,
  swapUSDCForETH
};
