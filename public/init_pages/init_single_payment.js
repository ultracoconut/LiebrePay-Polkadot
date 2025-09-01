import { singlePaymentDOT } from '../transactions/single_payment_DOT.js';
import { singlePaymentAssets } from '../transactions/single_payment_assets.js';
import { updateBalanceDisplay } from '../update_ui/update_balance_display.js';
import { account } from '../connect_wallet.js';
import { validateFields } from '../validate_fields.js';
import { formatConversionIn } from '../utils/format_conversion_input.js';
import { DECIMAL } from '../constants.js';
 

export function initSinglePayment() {
  
//DOM elements
const beneficiaryInput = document.getElementById('destination-wallet');
const amountInput = document.getElementById('amount');
const currencySelect = document.getElementById('currency');
const sendButton = document.getElementById('button-single-payment'); 

//Listener for changes in the currency selector and updates UI
currencySelect.addEventListener('change', () => {
  updateBalanceDisplay();
  validateFields();
});

//Real time validation fields
beneficiaryInput.addEventListener('input', validateFields);
amountInput.addEventListener('input', validateFields);

//Event listener send button
sendButton.addEventListener('click', async() => {
  const currency = currencySelect.value;
  const amount = formatConversionIn(amountInput.value, DECIMAL[currency] );
  const beneficiary = beneficiaryInput.value.trim();

  //Disable send button until result
  sendButton.disabled = true;
  
  let result;

  try{

  if (currency === 'DOT') {
        result = await singlePaymentDOT(account.address, beneficiary, amount);
     } else {
        result = await singlePaymentAssets(currency, account.address, beneficiary, amount);
     }

    setTimeout(() => {
      alert(result);
    }, 1000);

  } catch (error) {
    //Handle any errors that occur during the transaction
    console.error(`Single payment error: ${error.message || error}`);
    setTimeout(() => {
      alert(`Single payment error: ${error.message || error}`);
    }, 1000);
   

  } finally {
  //Clean inputs after completed or failed transaction
  amountInput.value = '';
  beneficiaryInput.value = '';

  //Update inputs fields after completed or failed transaction
  validateFields();

  }
});

//Update on page load 
updateBalanceDisplay();
validateFields();
}