# Hyperswap SDK Template

This repository provides a ready-to-use SDK for interacting with Hyperswap V2, including swap and liquidity functionalities.

## Features
- Swap tokens (e.g., USDC ↔ ETH).
- Add liquidity to ETH-USDC pools.
- Dynamic ABI integration for flexibility.


## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/HyperSwapX/how-tos-v2.git
   cd hyperswap-sdk

2. Install dependencies:
   ```bash
   npm install

3. Set up the .env file:
   - Copy the .env.example file to .env:
   ```bash
   cp .env.example .env

- Edit the .env file with your details.

## Scripts

1. Swap ETH for USDC

To swap ETH for USDC, run:
   ```bash
     node index.js
```

Edit the index.js file to adjust the parameters like amountOutMin, to address, and ETH amount before running the script.

2. Swap USDC for ETH

The same script can handle swapping USDC for ETH. Adjust the relevant function calls in the index.js file.

3. Add Liquidity (ETH + USDC)

To add liquidity to the pool:
   ```bash
     node index.js
```
Ensure the parameters for ETH and USDC amounts, slippage tolerance, and recipient address are correctly set in index.js.

Project Structure
	•	index.js: The main entry point to run swap and liquidity functions.
	•	hyperswap_swap_functions.js: Contains functions for swapping tokens on Hyperswap V2.
	•	hyperswap_liquidity_functions.js: Handles adding liquidity to the pool.
	•	abi/: Contains the ABI file for the router contract.

Environment Variables

The project relies on a .env file for sensitive information. Here’s an example:
```
WALLET_ADDRESS=https://your-evm-provider-url
PRIVATE_KEY=0xYourPrivateKey
```

## Troubleshooting

•	If you encounter gas estimation errors (UNPREDICTABLE_GAS_LIMIT), ensure:
```
	  1.	Your wallet has sufficient funds.
	  2.	The contract addresses are correct.
	  3.	Tokens have been approved for spending.
```

•	Check the logs for specific error messages. The most common issues are related to incorrect amounts, insufficient balances, or invalid contract interaction.
