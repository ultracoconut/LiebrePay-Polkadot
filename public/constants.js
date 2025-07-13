 export const SUPPORTED_CURRENCIES = [
  'DOT', 
  'USDT', 
  'USDC'
 ];
 
 //Asset IDS
 export const ASSETS_ID = { 
   USDT:1984, 
   USDC:1337 
 };

//Decimal precision number
 export const DECIMAL = {
   DOT: 10,
   USDT: 6,
   USDC: 6
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
 USDC: new BN(10).pow(new BN(6)) // 10^6 (Stablecoins)
 };

 //Minimum free balance required in LiebrePay (bn)
 MIN_BAL_FREE = { 
    DOT: DEC_BN.DOT.muln(2).divn(100), //0.02 DOT
    USDT: DEC_BN.USDT.muln(2).divn(100), //0.02 USDT
    USDC: DEC_BN.USDC.muln(2).divn(100) //0.02 USDC
  }; 

 //Minimum amount to pay in LiebrePay (bn)
 MIN_PAY_AMOUNT = {
   DOT: DEC_BN.DOT.divn(100), //0.01 DOT
   USDT: DEC_BN.USDT.divn(100), //0.01 USDT
   USDC: DEC_BN.USDC.divn(100) //0.01 USDC
 };


 return true;

 }catch(error){
 console.error("Error initializing constants:", error);
 return false;
 }
}

 
 
