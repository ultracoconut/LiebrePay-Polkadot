import { walletState } from '../wallet/wallet_state.js';

export function updateMultiPayment() {
  try {
    // DOM elements
    const selBut = document.getElementById('select-csv-button');

    if (!selBut) {
      return; // Verify multi payment page
    }

    // Disable the button if no account is connected
    if (!walletState.isConnected()) {
      selBut.disabled = true;
      selBut.textContent = 'Please connect a Wallet';
      return;
    }

    // Enable the button if account connected
    selBut.disabled = false;
    selBut.textContent = '📤 Upload .csv File';

  } catch (error) {
    console.error('Error updating multi payment ui:', error);
  }
}