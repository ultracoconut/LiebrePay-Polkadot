# Liebre Pay --- PoC VERSION --- Polkadot

## About Liebre Pay
Liebre Pay is a Proof of Concept (PoC) financial web application designed to facilitate blockchain-based business payments. It operates on Polkadot's Asset Hub and aims to simplify stablecoin transactions for small and medium-sized enterprises (SMEs). The platform allows businesses to send payments in DOT, USDC, and USDT individually or in batches using CSV files.
>[!NOTE] 
> This application is a Proof of Concept (PoC) and is in an early development phase. It may contain bugs or issues.  
> To test the application, please use a secure environment with an account that has minimal balances. Avoid using accounts with significant funds.

## Main Features
Liebre Pay leverages Polkadot's chain, "Asset Hub", through its API to provide a fast, cost-effective, and highly secure payment solution. The application offers:

- **Single payments**: Quickly and securely make single payments with ease.
- **Multiple payments**: Send funds to multiple accounts simultaneously using a `.csv` template.
- **Payment history**: Access a clear and detailed record of sent and received payments instantly.
- **Account information**: Intuitively view your account balances to maintain full control over your funds.

## Installation

### Standard Installation
Follow the steps in [docs/LiebrePay_setup.md](docs/LiebrePay_setup.md) to install and run the project normally.

### Docker Installation
For installation and setup using Docker, refer to [docs/LiebrePay_setup_docker.md](docs/LiebrePay_setup_docker.md).

## License
This project is licensed under the Apache License 2.0. See the LICENSE file for details.

Additionally, this project uses third-party libraries with their own licenses. Please review the "Licenses and Dependencies" section below for more information.

### Licenses and Dependencies
Liebre Pay integrates third-party libraries and tools. Below are the details of their respective licenses:

**Papa Parse** 
License: MIT License  
Owner: Matthew Holt  
Repository: https://github.com/mholt/PapaParse  
Papa Parse is included in the project and located in the public/ folder. Its full license can be found in the LICENSE file.

**Polkadot.js**
License: Creative Commons Zero v1.0 Universal (CC0 1.0)  
Repository: https://github.com/polkadot-js  

**Node.js and Express**  
Liebre Pay is built with Node.js and Express, which are open-source tools licensed under the MIT License. Their respective licenses are included in their official repositories:  
Node.js: https://github.com/nodejs/node  
Express: https://github.com/expressjs/express

## Author
Jordan (@ultracoconut)   

## Contact
If you have any questions or feedback, feel free to reach out to me at:

Twitter: @ultracoconut
