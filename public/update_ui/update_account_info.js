import { balances } from '../subscribe_balances.js';
import { walletState } from '../wallet/wallet_state.js';
import { formatConversionOut } from '../utils/format_conversion_output.js';
import { formatUnifiedAddress } from '../utils/format_unified_address.js';
import { DECIMAL } from '../constants.js';

export  function updateAccountInfo(){
   
   try {
   const address = document.getElementById('address-info');

   //Verify account info page
   if (!address) return;

   //DOM elements
   const name = document.getElementById('name-info');
   const balanceFreeDOT = document.getElementById('balance-free-DOT-info');
   const balanceResDOT = document.getElementById('balance-reserved-DOT-info');
   const balanceLockDOT = document.getElementById('balance-locked-DOT-info');
   const balanceUSDT = document.getElementById('balance-USDT-info');
   const balanceUSDC = document.getElementById('balance-USDC-info');
   const balanceDAI = document.getElementById('balance-DAI-info');
   
   //Update content
   name.textContent = walletState.account?.meta?.name || 'Not selected account';
   address.textContent = walletState.account?.address ? formatUnifiedAddress(walletState.account.address) : 'Not selected account';//Encode address to Polkadot format
   balanceFreeDOT.textContent = walletState.account ? `Free: ${formatConversionOut(balances['DOT'], DECIMAL['DOT'])}` : 'Not available';
   balanceResDOT.textContent = walletState.account ? `Reserved: ${formatConversionOut(balances['DOTRes'], DECIMAL['DOT'])}` : 'Not available';
   balanceLockDOT.textContent = walletState.account ? `Locked: ${formatConversionOut(balances['DOTLock'], DECIMAL['DOT'])}` : 'Not available';
   balanceUSDT.textContent = walletState.account ? formatConversionOut(balances['USDT'], DECIMAL['USDT']) : 'Not available';
   balanceUSDC.textContent = walletState.account ? formatConversionOut(balances['USDC'], DECIMAL['USDC']) : 'Not available';
   balanceDAI.textContent = walletState.account ? formatConversionOut(balances['DAI'], DECIMAL['DAI']) : 'Not available';

  } catch (error) {
    console.error('Error updating account info:', error);
    }
}