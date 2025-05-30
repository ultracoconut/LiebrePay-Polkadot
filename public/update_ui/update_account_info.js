import { balances } from '../subscribe_balances.js';
import { account } from '../connect_wallet.js';
import { formatConversionOut } from '../utils/format_conversion_output.js';
import { formatUnifiedAddress } from '../utils/format_unified_address.js';

export  function updateAccountInfo(){
   
   try {
   const address = document.getElementById('address-info');

   //Verify account info page
   if (!address) return;

   //DOM elements
   const name = document.getElementById('name-info');
   const balanceFreeDOT = document.getElementById('balance-free-DOT-info');
   const balanceResDOT = document.getElementById('balance-reserved-DOT-info');
   const balanceUSDT = document.getElementById('balance-USDT-info');
   const balanceUSDC = document.getElementById('balance-USDC-info');

   //Update content
   name.textContent = account?.meta?.name || 'Not selected account';
   address.textContent = account?.address ? formatUnifiedAddress(account.address) : 'Not selected account';//Encode address to Polkadot format
   balanceFreeDOT.textContent = account ? `Free: ${formatConversionOut(balances['DOT'], 10)}` : 'Not available';
   balanceResDOT.textContent = account ? `Reserved: ${formatConversionOut(balances['DOTRes'], 10)}` : 'Not available';
   balanceUSDT.textContent = account ? formatConversionOut(balances['USDT'], 6) : 'Not available';
   balanceUSDC.textContent = account ? formatConversionOut(balances['USDC'], 6) : 'Not available';

  } catch (error) {
    console.error('Error updating account info:', error);
    }
}