 export const SUPPORTED_CURRENCIES = [
  'DOT', 
  'USDT', 
  'USDC',
  'DAI'
 ];
 
 //Native assets in Asset Hub (with numeric AssetId)
 export const ASSETS_ID = { 
   USDT:1984, 
   USDC:1337 
 };

 //Foreign assets in Asset Hub (with MultiLocation XCM)
 export const MULTILOCATION = {
  DAI: {
  parents: 2,
  interior: {
    X2: [
      {
        globalConsensus: {
          ethereum: {
            chainId: 1
          }
        }
      },
      {
        accountKey20: {
          network: null,
          key: "0x6b175474e89094c44da98b954eedeac495271d0f"
        }
      }
    ]
  }
}

 };

//Decimal precision number
 export const DECIMAL = {
   DOT: 10,
   USDT: 6,
   USDC: 6,
   DAI:18
 };
 
//Header keys in the multi-payment .csv file
export const EXPECTED_KEYS = [
  'Beneficiary',
  'Amount',
  'Currency'
 ];

//Limit of payment rows supported per CSV file upload
export const MAX_ROWS = 100;

//Number of rows in the payment history list
export const HISTORY_ROWS = 20; 
 
//Polkadot Asset Hub WebSocket Provider
export const URL_PROVIDER = 'wss://polkadot-asset-hub-rpc.polkadot.io'; 
export let MIN_BAL_FREE = null;
export let MIN_PAY_AMOUNT = null;

 //Initializes constants requiring BN from polkadotUtil
export function initializeConstants() {

 try{

  //Check if polkadotUtil and BN are available
  if (!polkadotUtil?.BN) {
      throw new Error('polkadotUtil or BN is not available');
    }
 
 const BN = polkadotUtil.BN;  
 
 //Decimal Precision (bn)
 const DEC_BN = {
 DOT: new BN(10).pow(new BN(10)), // 10^10 (Polkadot)
 USDT: new BN(10).pow(new BN(6)), // 10^6 (Stablecoins)
 USDC: new BN(10).pow(new BN(6)), // 10^6 (Stablecoins)
 DAI: new BN(10).pow(new BN(18)) // 10^18 (DAI)
 };

 //Minimum free balance required in LiebrePay (bn)
 MIN_BAL_FREE = { 
    DOT: DEC_BN.DOT.muln(2).divn(100), //0.02 DOT
    USDT: DEC_BN.USDT.muln(2).divn(100), //0.02 USDT
    USDC: DEC_BN.USDC.muln(2).divn(100), //0.02 USDC
    DAI: DEC_BN.DAI.muln(2).divn(100) //0.02 DAI
  }; 

 //Minimum amount to pay in LiebrePay (bn)
 MIN_PAY_AMOUNT = {
   DOT: DEC_BN.DOT.divn(100), //0.01 DOT
   USDT: DEC_BN.USDT.divn(100), //0.01 USDT
   USDC: DEC_BN.USDC.divn(100), //0.01 USDC
   DAI: DEC_BN.DAI.divn(100) //0.01 DAI
 };


 return true;

 }catch(error){
 console.error("Error initializing constants:", error);
 return false;
 }
}

 
 
