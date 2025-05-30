import { paymentHistoryController } from './payment_history/payment_history_controller.js';
import { subscribeBalanceChanges, unsubscribeBalanceChanges } from './subscribe_balances.js';
import { validateFields } from './validate_fields.js';
import { updateBalanceDisplay } from './update_ui/update_balance_display.js';
import { updateMultiPayment } from './update_ui/update_multi_payment.js';
import { updateAccountInfo } from './update_ui/update_account_info.js';
import { getAvailableExtensions } from './utils/get_available_extensions.js';
import { getAvailableAccounts } from './utils/get_available_accounts.js';
import { getInjector } from './utils/get_injector.js';
import { formatAccountDisplay } from './utils/format_account_display.js';
import { formatUnifiedAddress } from './utils/format_unified_address.js';
import { updateConnectionUI } from './update_ui/update_connection_UI.js';

export let account = null;
export let injector = null;

// CONNECT WALLET FUNCTION
export async function connectWallet() {

  try { 

    //There is an account connected
    if (account) { 
      updateConnectionUI('disconnecting');
      unsubscribeBalanceChanges();
      account = null;
      injector = null;
      
      //Update UI
      updateConnectionUI('disconnected');
      updateBalanceDisplay();
      paymentHistoryController();
      updateAccountInfo();
      updateMultiPayment();
      validateFields();
      return;
    }

    //There is no account connected
    updateConnectionUI('connecting');

    //Call for extensions 
    const extensions = await getAvailableExtensions();

    if (!extensions) {
      alert('No extension installed, or the authorization was not accepted');
      return;
    }

    displayExtensionList(extensions);
  } catch (error) {
    console.error('Error connecting wallet:', error);
    alert(`An error occurred: ${error.message || error}`);
  }
}

//DISPLAY EXTENSION LIST
function displayExtensionList(extensions) {

 try{
  const list = document.getElementById('extension-list');
  list.innerHTML = '';

  extensions.forEach((ext, index) => {
    const li = document.createElement('li');
    li.textContent = ext.name;
    li.addEventListener('click', () => selectExtension(index, extensions));
    list.appendChild(li);
  });

  list.style.display = 'block';
  document.getElementById('overlay').style.display = 'block';

  }catch(error){
    console.error('Error displaying extension list:', error);
    alert(`An error occurred: ${error.message || error}`);
    }
}

//SELECT EXTENSION
async function selectExtension(index, extensions) {

 try{ 
  const extension = extensions[index];
  console.log(`Selected ${extension.name}`);

  const accounts = await getAvailableAccounts(extension.name);

  if (!accounts || accounts.length === 0) {
    alert('No accounts available in this extension');
    displayExtensionList(extensions);
    return;
  }

  document.getElementById('extension-list').style.display = 'none';
  displayAccountList(accounts);

  }catch(error){
    console.error('Error selecting extension:', error);
    alert(`An error occurred: ${error.message || error}`);
    }
}

//DISPLAY ACCOUNT LIST
function displayAccountList(accounts) {

 try{
  const accountList = document.getElementById('account-list');
  accountList.innerHTML = '';

  accounts.forEach((acc, index) => {
    const li = document.createElement('li');
    li.textContent = formatAccountDisplay(acc);
    li.addEventListener('click', () => selectAccount(index, accounts));
    accountList.appendChild(li);
  });

  accountList.style.display = 'block';
  document.getElementById('overlay').style.display = 'block';

  }catch(error){
    console.error('Error displaying account list:', error);
    alert(`An error occurred: ${error.message || error}`);
  }
}

//SELECT ACCOUNT
async function selectAccount(index, accounts) {
  
  try {
    document.getElementById('account-list').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';

    account = accounts[index];
    injector = await getInjector(account.address);
    console.log(`Got injector for account ${formatUnifiedAddress(account.address)}`);

    await subscribeBalanceChanges();
    
    //Update UI
    updateConnectionUI('connected');
    paymentHistoryController();
    validateFields();
    updateMultiPayment();
    updateAccountInfo();

  } catch (error) {
    console.error('Error selecting account:', error);
    alert(`An error occurred while selecting the account: ${error.message || error}`);
  }
}
