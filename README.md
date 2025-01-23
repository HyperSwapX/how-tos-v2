# Hyperswap SDK Template

This repository provides a ready-to-use SDK for interacting with Hyperswap V2, including swap and liquidity functionalities.

## Features
- Swap tokens (e.g., USDC ↔ ETH).
- Add liquidity to ETH-USDC pools.
- Dynamic ABI integration for flexibility.

## Repository Structure
      how-tos-v2/

     ├── README.md         
     ├── package.json      
      
     ├── src/

        │   ├── hyperswap_swap_functions.js
     
        │   ├── hyperswap_liquidity_functions.js

     │   ├── abi/

        │   │   └── router_abi.json

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/hyperswap-sdk.git
   cd hyperswap-sdk

2. Install dependencies:
   ```bash
   npm install
   
3. Edit and run the scripts:
   
	For swaps:
      ```bash
   node src/hyperswap_swap_functions.js

For liquidity: 
 ```bash
  node src/hyperswap_liquidity_functions.js
