/*This file leverages PapaParse for parsing CSV files containing payment instructions.
   See the full license in the LICENSE file at the root of this project and also at the end of this file.*/
   
   import { DECIMAL, MIN_BAL_FREE, ASSETS_ID, MULTILOCATION, MAX_ROWS, SUPPORTED_CURRENCIES, EXPECTED_KEYS } from '../constants.js'
   import { balances } from '../subscribe_balances.js';
   import { apiAH, initializeApi } from '../init_apis.js';
   import { injector } from '../connect_wallet.js';
   import { formatConversionIn } from '../utils/format_conversion_input.js';
   import { formatConversionOut } from '../utils/format_conversion_output.js';
   import { validateAmount } from '../utils/amount_verification.js';
   import { validateAccount } from '../utils/account_verification.js';
   
   export async function multiPayment(address, file) {
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
   
   
       //DOM elements
       const overlay = document.getElementById('overlay');
       const statusBox = document.getElementById('transaction-status');
       const statusMessage = document.getElementById('status-message');
   
       //Const & Variables
       const { BN_ZERO } = polkadotUtil;
       let validKeys = false;
       let results = [];
       let group = [];
       let rowCount = 0;
       let tx;
       let totalAmounts = {
          DOT: BN_ZERO, 
          USDT: BN_ZERO, 
          USDC: BN_ZERO 
         };
   
       let WalletsSet = new Set();
       let abortTriggered = false; //Flag to check if abort() was called
   
     
       //Read the CSV file from the user's input
       console.log("Reading .csv file...");
       if (file) {
         Papa.parse(file, {
           header: true, //First row as header
           skipEmptyLines: true, 
           delimiter: ';', 
           comments: '#', //Skip lines starting with '#'
   
   step: function (row, parser) { //Process row by row
        
       try{
     
         const data = row.data;
   
         //Verify correct header in the first step
         if (!validKeys) {
         
          const keysInData = Object.keys(data).filter(key => key.trim() !== ''); 
          const haveExactKeys = EXPECTED_KEYS.length === keysInData.length && EXPECTED_KEYS.sort().join(',') === keysInData.sort().join(',');
 
          if (!haveExactKeys) {
           reject(`Invalid .csv file. The columns in the .csv file must be: ${EXPECTED_KEYS.join(', ')}`);
           abortTriggered = true; //Active flag
           parser.abort(); //Stop parsing
           return;
          }
          validKeys = true;
         }
         
         //Verify missing data in rows
         if (!data.Beneficiary || !data.Amount || !data.Currency) {
            reject(`Row has missing data at row: ${rowCount + 2}`);
            abortTriggered = true; 
            parser.abort();
            return;
         }
   
         //Verify valid beneficiary address
         if (!validateAccount(data.Beneficiary)) {
          reject(`Invalid beneficiary address: "${data.Beneficiary}" at row ${rowCount + 2}`);
          abortTriggered = true; 
          parser.abort();
          return;
         }
   
         //Verify beneficiary address is not the same as sender address
         if(data.Beneficiary === address){
            reject(`Beneficiary address is the same as the sender address: "${data.Beneficiary}" at row ${rowCount + 2}`);
            abortTriggered = true; 
            parser.abort();
            return;
         }
   
         //Verify beneficiary address duplicate
         if (WalletsSet.has(data.Beneficiary)) {
            reject(`Duplicate beneficiary address: "${data.Beneficiary}" at row ${rowCount + 2}`);
            abortTriggered = true;
            parser.abort();
            return;
         }
   
         //Verify correct data in currency
         if (!SUPPORTED_CURRENCIES.includes(data.Currency)) {
            reject(`Unknown currency: "${data.Currency}" at row ${rowCount + 2}`);
            abortTriggered = true; 
            parser.abort();
            return;
         }
   
         //Verify amount is a valid number and check if it is within available balance
         if (!validateAmount(data.Amount, data.Currency)) {
           reject(`Invalid amount data: "${data.Amount}" at row ${rowCount + 2}`);
           abortTriggered = true;
           parser.abort();
           return;
         }
   
         //Verify max rows
         if (rowCount === MAX_ROWS) {
            reject(`The .csv file has more than ${MAX_ROWS} payment rows. Please reduce the number of payment rows in your .csv file`);
            abortTriggered = true;
            parser.abort();
            return;
         }
   
         //Push row in array results
         results.push(data);
         rowCount++;
         let formattedAmount = formatConversionIn(data.Amount, DECIMAL[data.Currency]);
         totalAmounts[data.Currency] = totalAmounts[data.Currency].add(formattedAmount);
         WalletsSet.add(data.Beneficiary); //Add wallet to set
        
   
       }catch(error){
         reject(error);
       }
   
     },
   
   complete: async function () {
   
       try{ 
   
         if (abortTriggered) {
         //Exit if parsing was aborted
         return;
          }
   
         console.log('.csv parsing complete');
   
         if (results.length === 0) {
             reject("The .csv file does not contain any payment row");
             return;
         }
         
         //Verify each asset balance for transaction batch
         for (let curr in totalAmounts) {
    
           const totalRequired = totalAmounts[curr].add(MIN_BAL_FREE[curr]);
   
           if (totalAmounts[curr].gt(BN_ZERO) && balances[curr].lt(totalRequired)){
                 reject(`Insufficient funds for ${curr}`);
                 return;
             }
         }
   
         //Construct batch 
         console.log('Constructing batch...')
   
          for (const { Beneficiary, Amount, Currency } of results) {
           
            if(Currency === 'DOT') {
                 tx = apiAH.tx.balances.transferKeepAlive(Beneficiary, formatConversionIn(Amount, DECIMAL[Currency]));
            
            } else if (ASSETS_ID[Currency]) { //Native asset
                 tx = apiAH.tx.assets.transferKeepAlive(ASSETS_ID[Currency], Beneficiary, formatConversionIn(Amount, DECIMAL[Currency]));

            } else if (MULTILOCATION[Currency]) {//Foreign asset
                 const XcmV4Location = apiAH.createType('StagingXcmV4Location', MULTILOCATION[Currency]); //Create type StagingXcmV4Location
                 tx = apiAH.tx.foreignAssets.transferKeepAlive(XcmV4Location, Beneficiary, formatConversionIn(Amount, DECIMAL[Currency]));

            } else {
              reject("Unsupported asset");
              return;
              }

            group.push(tx);
         }       
   
         //Batch constructed
         console.log('Batch constructed')
   
         //Show batch in console
         console.log(`Transaction batch: ${group}`);
   
         //Retrieve transaction batch fee info
         let {partialFee:feeBatch} = await apiAH.tx.utility.batch(group).paymentInfo(address);
   
         //Verify sufficient DOT balance for fees
         const totalRequiredDOT = totalAmounts['DOT'].add(MIN_BAL_FREE['DOT']).add(feeBatch.muln(2));
         
         if (balances['DOT'].lt(totalRequiredDOT)){
           reject("Insufficient DOT for fees");
           return;
         }
   
         //Show summary and confirm option
         let summaryMessage = `Multi Payment Summary:\n\n`;
         summaryMessage += `- Total number of payments: ${rowCount}\n`;
         summaryMessage += `- Total Multi payment amount:\n`;

         for (const currency of SUPPORTED_CURRENCIES) {
           if (totalAmounts[currency].gt(BN_ZERO)) {
            summaryMessage += `  - ${formatConversionOut(totalAmounts[currency], DECIMAL[currency])} ${currency}\n`;
           }
         }

         summaryMessage += `- Estimated Multi Payment fee: ${formatConversionOut(feeBatch, DECIMAL['DOT'])} DOT\n\n`;
         summaryMessage += `Do you want to continue?`;
         
         let userConfirmed = confirm(summaryMessage);
         
         if (!userConfirmed) {
             reject("Multi payment cancelled");
             return;
         }
   
        //Construct extrinsic
        let extrinsic = apiAH.tx.utility.batch(group);
   
        //Sign & send the extrinsic
        const extrinsicUnsub = await extrinsic.signAndSend(address, { signer: injector.signer }, ({events = [], status, txHash})=>{
         
        //Show the status box and overlay when the transaction starts
        overlay.style.display = 'flex';
        statusBox.style.display = 'flex';
   
        //Update the status in the status box
        statusMessage.textContent = 'Multi payment in progress, please wait...';
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
             resolve(`Successful Multi payment with hash ${txHash}`);
             return;  
           }, 2000);  
   
           
           } else if (method === 'ExtrinsicFailed') {
   
           //Delay the closing of the status box
           setTimeout(() => {
             overlay.style.display = 'none';
             statusBox.style.display = 'none';
             reject("The payment failed during blockchain processing. Please try again or contact support.");
             return;  
           }, 2000);  
           }
         });
         extrinsicUnsub();
        }
      });
     
     } catch(error){
       reject(error);
     }
   
    },
   
   
   error: function (error) {
    console.error('Error processing .csv file:', error);
    reject(error);
             }
          });
       }
   
   
    });
   }
   
   
   
   /*****************************************PapaParse License*****************************************************
   
   The MIT License (MIT)
   
   Copyright (c) 2015 Matthew Holt
   
   Permission is hereby granted, free of charge, to any person obtaining a copy of 
   this software and associated documentation files (the "Software"), to deal in 
   the Software without restriction, including without limitation the rights to 
   use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of 
   the Software, and to permit persons to whom the Software is furnished to do so, 
   subject to the following conditions:
   
   The above copyright notice and this permission notice shall be included in all
   copies or substantial portions of the Software.
   
   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS 
   FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR 
   COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
    IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN 
    CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   
   
   ****************************************************************************************************************/
