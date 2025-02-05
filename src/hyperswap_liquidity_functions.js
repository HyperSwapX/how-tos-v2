// Hyperswap V2 SDK - Add Liquidity with Calculation

const { ethers } = require("ethers");
const routerABI = require("./abi/router_abi.json");

// Router Contract Address
const ROUTER_ADDRESS = "0xD19222370B1944a5392f98028C3E70AFD3a673dF";

// Token Addresses
const USDC_ADDRESS = "0x24ac48bf01fd6CB1C3836D08b3EdC70a9C4380cA";
const WETH_ADDRESS = "0xADcb2f358Eae6492F61A5F87eb8893d09391d160";

// Initialize Router Contract
const getRouterContract = (provider) => {
  return new ethers.Contract(ROUTER_ADDRESS, routerABI.abi, provider);
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
  const ethAmountParsed = ethers.utils.parseEther(ethAmount.toString());

  // Calculate the optimal amount of USDC
  const usdcAmountDesired = await calculateOptimalUSDCAmount(provider, ethAmountParsed);

  // USDC Contract
  const USDC_ABI = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function allowance(address owner, address spender) public view returns (uint256)",
    "function balanceOf(address account) public view returns (uint256)",
  ];
  const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, signer);

  // Check USDC Balance
  const usdcBalance = await usdcContract.balanceOf(signer.address);
  console.log("USDC Balance:", usdcBalance.toString());
  if (usdcBalance.lt(usdcAmountDesired)) {
    throw new Error("Insufficient USDC balance for liquidity addition.");
  }

  // Check Allowance
  const allowance = await usdcContract.allowance(signer.address, router.address);
  console.log("USDC Allowance:", allowance.toString());
  if (allowance.lt(usdcAmountDesired)) {
    console.log("Approving USDC for Router...");
    const approveTx = await usdcContract.approve(router.address, ethers.constants.MaxUint256);
    await approveTx.wait();
    console.log("USDC approved successfully.");
  } else {
    console.log("Sufficient USDC allowance already exists.");
  }

  // Add Liquidity
  try {
    const tx = await router.addLiquidityETH(
      USDC_ADDRESS,
      usdcAmountDesired,
      usdcMin,
      ethMin,
      to,
      deadline,
      { value: ethAmountParsed, gasLimit: 300000 } // Fallback gas limit
    );
    return await tx.wait();
  } catch (error) {
    console.error("Error adding liquidity:", error);
    throw error;
  }
}

module.exports = {
  addLiquidityETHWithUSDC
};
