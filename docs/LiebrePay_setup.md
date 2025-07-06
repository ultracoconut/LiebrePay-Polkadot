# Liebre Pay (Polkadot) - Setup Instructions

Follow these steps to set up the project.

## 1. Install Curl:
```bash
apt install curl
```
## 2. Install Node Version Manager (NVM):
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```
## 3. Source the .bashrc file:
```bash
source ~/.bashrc
```
## 4. Verify NVM installation:
```bash
nvm -v
```
## 5. Install Node.js:
```bash
nvm install 20.18.1
```
## 6. Verify Node.js installation:
```bash
node -v
```
## 7. Install npm:
```bash
npm install -g npm@10.8.1
```
## 8. Clone the repository:
```bash
git clone https://github.com/ultracoconut/LiebrePay-Polkadot
cd LiebrePay-Polkadot
```
## 9. Install dependencies:
```bash
npm install
```
## 10. Configure Subscan key:
To retrieve the payment history from this project, you need to configure a Subscan API key.  

- Go to Subscan API and get a free API key:  
https://pro.subscan.io/pricing  

- Copy the `config.example.json` file in the root of the project and rename it to `config.json`:  
```bash
cp config.example.json config.json
```
- Open the config.json file and add your Subscan API key:  
  {  
  "SUBSCAN_API_KEY": "your_api_key_here"  
}  
## 11.  Install a supported browser-based wallet:
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

## 12. Obtain currencies:
- Get some DOT, USDT and USDC.

## 13. Start the application:
```bash  
node server.js
```
## 14. Access the application:
The application should now be running on [http://localhost:3000](http://localhost:3000).




