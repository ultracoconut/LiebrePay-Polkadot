import { apiAH, initializeApi } from '../init_apis.js';
import { balances } from '../subscribe_balances.js';
import { SUPPORTED_CURRENCIES, MIN_BAL_FREE, ASSETS_ID, MULTILOCATION, DECIMAL } from '../constants.js';
import { formatConversionOut } from '../utils/format_conversion_output.js';
import { customConfirm } from '../utils/ui/custom_confirm.js';
import { formatUnifiedAddress } from '../utils/format_unified_address.js';


export async function closeAndTransfer (sourceAddress, injector, recipientAddress) {
  return new Promise(async (resolve, reject) => { 
    try {
        //Verify that the API have been created
        if (!apiAH) {
          await initializeApi(); //Create API if they haven't been created
          }
   
        //Wait for API to be ready
        await apiAH.isReady;  
     
      } catch (error) {
        console.error('Error initializing or waiting for API to be ready:', error);
        reject(error);
      }    


    try {

    //DOM elements
    const overlay = document.getElementById('overlay');
    const statusBox = document.getElementById('transaction-status');
    const statusMessage = document.getElementById('status-message');

    
    if (!sourceAddress){
      reject('No source address specified');
      return;
      } 

    if (!recipientAddress){
      reject('No recipient address specified');
      return;
      }


    //Verify source account balances
    const nonZeroBalances = SUPPORTED_CURRENCIES.filter(currency => balances[currency]?.gte(MIN_BAL_FREE[currency]));

    console.log(nonZeroBalances);
    
    if (nonZeroBalances.length === 0) {
      reject('No funds available to transfer');
      return;
    }

    if (!nonZeroBalances.includes('DOT')){
      reject('DOT is required to cover network transaction fees.');
      return;
    }

    
    //Construct 1st transaction batch for currencies with non-zero balances to obtain batch fee
    console.log('Constructing 1st batch...');

    let group = [];
    let tx;

    for (const currency of nonZeroBalances) {
      if (currency === 'DOT') {
        tx = apiAH.tx.balances.transferAllowDeath(recipientAddress, balances[currency]);
     
      } else if (ASSETS_ID[currency]) { //Native asset
          tx = apiAH.tx.assets.transfer(ASSETS_ID[currency], recipientAddress, balances[currency]);

      } else if (MULTILOCATION[currency]) {//Foreign asset
          const XcmV4Location = apiAH.createType('StagingXcmV4Location', MULTILOCATION[currency]); //Create type StagingXcmV4Location
          tx = apiAH.tx.foreignAssets.transfer(XcmV4Location, recipientAddress, balances[currency]);

      } else {
        reject("Unsupported asset");
        return;
        }

      group.push(tx);
    }

    //Retrieve transaction batch fee info
    const {partialFee:feeBatch} = await apiAH.tx.utility.batch(group).paymentInfo(sourceAddress);

    //Verify sufficient DOT balance for fees
    if (!balances['DOT'].gte(MIN_BAL_FREE['DOT'].add(feeBatch.muln(2)))){
      reject ('Insufficient DOT for fees');
      return;
      } 
    
    //Show transfer summary and confirm option
    let summaryMessage = `Transfer Summary:

      - From account: ${formatUnifiedAddress(sourceAddress)}
      - To account: ${recipientAddress}
      - Total balances to transfer:\n`;

      nonZeroBalances.forEach(currency => {
        summaryMessage += `  - ${formatConversionOut(balances[currency], DECIMAL[currency])} ${currency}\n`;
      });

      summaryMessage += `- Estimated transfer fee: ${formatConversionOut(feeBatch, DECIMAL['DOT'])} DOT

      Do you want to continue?`;
         
      const userConfirmed = await customConfirm(summaryMessage);
         
      if (!userConfirmed) {
          resolve(false);
          return;
         }   

      
    //Clear tx & group
    tx = null;
    group = [];

    //Construct 2nd transaction batch after deducting DOT fees
    console.log('Constructing 2nd batch...');

    //Move DOT to the end of the batch
    const currenciesOrdered = nonZeroBalances.filter(curr => curr !== 'DOT');
    currenciesOrdered.push('DOT'); 

    for (const currency of currenciesOrdered) {
      if (currency === 'DOT') {
        tx = apiAH.tx.balances.transferAllowDeath(recipientAddress, balances[currency].sub(feeBatch.muln(2)));

      } else if (ASSETS_ID[currency]) { //Native asset
          tx = apiAH.tx.assets.transfer(ASSETS_ID[currency], recipientAddress, balances[currency]);

      } else if (MULTILOCATION[currency]) {//Foreign asset
          const XcmV4Location = apiAH.createType('StagingXcmV4Location', MULTILOCATION[currency]); //Create type StagingXcmV4Location
          tx = apiAH.tx.foreignAssets.transfer(XcmV4Location, recipientAddress, balances[currency]);

      } else {
        reject("Unsupported asset");
        return;
        }

      group.push(tx);
    }

    //Construct extrinsic
    let extrinsic = apiAH.tx.utility.batch(group);

    //Sign & send the extrinsic
     const extrinsicUnsub = await extrinsic.signAndSend(sourceAddress, { signer: injector.signer }, ({events = [], status, txHash})=>{
         
        //Show the status box and overlay when the transaction starts
        overlay.style.display = 'flex';
        statusBox.style.display = 'flex';
   
        //Update the status in the status box
        statusMessage.textContent = 'Transferring funds, please wait...';
        statusMessage.appendChild(document.createElement('br'));
        statusMessage.appendChild(document.createTextNode(`Current status in blockchain: ${status.type}`));
        console.log(`Transaction current status is ${status.type}`);
   
       if (status.isFinalized){
          //Loop through Vec<EventRecord> to get ExtrinsicSuccess/Failed
          events.forEach(({ event: {method} }) => {
                           
           if (method === 'ExtrinsicSuccess') {
             
           //Delay the closing of the status box
           setTimeout(() => {
             overlay.style.display = 'none';
             statusBox.style.display = 'none';
             resolve(`Successful transfer with hash ${txHash}`);
             return;  
           }, 2000);  
   
           
           } else if (method === 'ExtrinsicFailed') {
   
           //Delay the closing of the status box
           setTimeout(() => {
             overlay.style.display = 'none';
             statusBox.style.display = 'none';
             reject("The transfer failed during blockchain processing. Please try again or contact support."); 
           }, 2000);  
           }
         });
         extrinsicUnsub();
        }
      });
     
     } catch(error){
       reject(error);
     }     

 });   
}