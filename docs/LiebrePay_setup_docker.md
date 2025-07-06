# Liebre Pay (Polkadot) - Docker Setup Instructions

Follow these steps to set up the project with Docker.

## 1. Clone the repository:
```bash
git clone https://github.com/ultracoconut/LiebrePay-Polkadot
cd LiebrePay-Polkadot
```
## 2. Configure Subscan key:
To retrieve the payment history, you need to configure a Subscan API key.  

- Go to Subscan API and get a free API key:  
https://pro.subscan.io/pricing  

- Copy the `config.example.json` file in the root of the project and rename it to `config.json`:  
    ```bash
    cp config.example.json config.json
    ```
- Open the config.json file and add your Subscan API key:  
    ```json
    {  

    "SUBSCAN_API_KEY": "your_api_key_here" 

    }  
    ```
## 3.  Install a supported browser-based wallet:
Liebre Pay supports the following Polkadot-compatible browser wallets:

- [Polkadot.js](https://polkadot.js.org/extension/)  
- [Polkagate](https://polkagate.xyz/)
- [Talisman](https://talisman.xyz/)
- [SubWallet](https://www.subwallet.app/)
- [Enkrypt](https://www.enkrypt.com/)
- [Fearless wallet](https://fearlesswallet.io/)
- [Math wallet](https://mathwallet.org/)
- [Nightly](https://nightly.app/)

Once installed, open the wallet and create or import an account.

## 4. Obtain currencies:
- Get some DOT, USDT and USDC.

## 5. Build and run the application with Docker:
Run the following commands **in the root of the project**:
```bash 
docker build -t liebrepay-app .
docker run -p 3000:3000 liebrepay-app
```  
## 6. Access the application:
The application should now be running on [http://localhost:3000](http://localhost:3000).
