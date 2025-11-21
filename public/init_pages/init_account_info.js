import { updateAccountInfo } from '../update_ui/update_account_info.js';
import { walletState } from '../wallet/wallet_state.js';
import { closeAndTransfer } from '../transactions/close_and_transfer.js';
import { validateAccount } from '../utils/account_verification.js';
import { customMessage } from '../utils/ui/custom_message.js';

export  function initAccountInfo(){

    //DOM Elements
    const btnLiquidate = document.getElementById('button-liquidate');
    const btnTransfer = document.getElementById('lb-button-transfer');
    const btnCancel = document.getElementById('lb-button-cancel');
    const liquidateBox = document.getElementById('liquidate-box');
    const recipientInput = document.getElementById('lb-input-recipient');
    const overlay = document.getElementById('overlay');

    //Event Listener button liquidate
    btnLiquidate.addEventListener('click', () => {
     recipientInput.value = ''; //Clean input at start
     recipientInput.classList.remove('valid', 'invalid');
     btnLiquidate.disabled = true;
     liquidateBox.style.display = 'flex';
     overlay.style.display = 'flex';
     btnTransfer.disabled = true;
    });

    //Real time validate recipient address
    recipientInput.addEventListener('input', () => {
     const isValid = validateAccount(recipientInput.value.trim());
     btnTransfer.disabled = !isValid;
     recipientInput.classList.remove('valid', 'invalid');
     recipientInput.classList.add(isValid ? 'valid' : 'invalid');
    });

    //Event listener close button
    btnCancel.addEventListener('click', () => {
     closeLiquidateBox();
     btnLiquidate.disabled = false;
    });
    
    //Function close liquidate box
    function closeLiquidateBox(){
     liquidateBox.style.display = 'none';
     overlay.style.display = 'none';
    }
    
    //Event listener button transfer
    btnTransfer.addEventListener('click', async () => {
  	try {
  	   //Disable transfer button until result
       btnTransfer.disabled = true;

       //Hide Liquidate box
       closeLiquidateBox();
         
    	 //Call function
       const result = await closeAndTransfer(walletState.account.address, walletState.injector, recipientInput.value.trim());
       
       if (result === false) {
        console.log("Transfer cancelled by user");
        return;
        }
       
       setTimeout(() => {
         customMessage(result);
          }, 1000);
          
     } catch (error) {
     //Handle any errors that occur during the transfer
     console.error(`Transfer error: ${error.message || error}`);
     setTimeout(() => {
       customMessage(`Transfer error: ${error.message || error}`);
      }, 1000); 

     } finally {
         //Enable liquidate & transfer buttons
         btnLiquidate.disabled = false;
         btnTransfer.disabled = false;

      }

  });
     
    // Call update once after initializing
    updateAccountInfo();
}