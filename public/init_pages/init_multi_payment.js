        import { multiPayment } from '../transactions/multi_payment.js';
        import { walletState } from '../wallet/wallet_state.js';
        import { updateMultiPayment } from '../update_ui/update_multi_payment.js';
        
        export function initMultiPayment() {
          
          //DOM elements
          const selBut = document.getElementById('select-csv-button');
          const csvFileIn = document.getElementById('csvFileInput');

          //Add event listener to select csv button
          selBut.addEventListener('click', () => {
              csvFileIn.click();
              //Disable select csv button at start
              selBut.disabled = true;
          });

          //Event to detect when the file selection is canceled
          csvFileIn.addEventListener('cancel', () => {
            selBut.disabled = false;
          });

          //Update csv button in the UI
          updateMultiPayment();

          //Add event listener file input
          csvFileIn.addEventListener('change', async function(event) {

           let file;

          try{

            //Get the first file selected
            file = event.target.files[0]; 
            
            //Verify that file is not null or undefined
            if (!file) {
            throw new Error('No file provided for processing');
            }

          } catch (error){
            console.error(`File error: ${error.message || error}`);
            //Enable select csv button
            selBut.disabled = false;
          }
          
         
          try {
            
            //Call multiPayment function
            const result = await multiPayment(walletState.account.address, walletState.injector, file);
            setTimeout(() => {
              alert(result);
            }, 1000);
            
          } catch (error) {
            //Handle errors thrown with reject inside multiPayment
            console.error(`Multi payment error: ${error.message || error}`);
            setTimeout(() => {
              alert(`Multi payment error: ${error.message || error}`);
            }, 1000);
            

          } finally {
            //Reset input file
            event.target.value = "";

            //Enable select csv button
            selBut.disabled = false;
          }
      });
      
      }
