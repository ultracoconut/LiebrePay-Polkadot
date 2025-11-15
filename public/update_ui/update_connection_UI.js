import { walletState } from '../wallet/wallet_state.js';
import { formatAccountDisplay } from '../utils/format_account_display.js';

export function updateConnectionUI(state) {

 try {
  const mainButton = document.getElementById('button-connect');
  const auxButtons = document.querySelectorAll('.aux-connect');
  const sendButton = document.getElementById('button-single-payment');
  const btnLiquidate = document.getElementById('button-liquidate');

  //Main button connect
  if (mainButton) {
    mainButton.disabled = (state === 'connecting' || state === 'disconnecting');

    switch (state) {
      case 'connecting':
        mainButton.textContent = 'Connecting Wallet...';
        break;
      case 'disconnecting':
        mainButton.textContent = 'Disconnecting Wallet...';
        break;
      case 'connected':
        mainButton.textContent = '';
        mainButton.appendChild(document.createTextNode(formatAccountDisplay(walletState.account)));
        mainButton.appendChild(document.createElement('br'));
        mainButton.appendChild(document.createTextNode('Click to Disconnect'));
        break;
      case 'disconnected':
      default:
        mainButton.textContent = 'Connect Wallet';
        break;
    }
  }

  //Auxiliar buttons connect
  auxButtons.forEach(btn => {
    btn.disabled = (state === 'connecting' || state === 'disconnecting');

    switch (state) {
      case 'connected':
        btn.style.visibility = 'hidden';
        btn.style.pointerEvents = 'none';
        break;
      case 'connecting':
        btn.style.visibility = 'visible';
        btn.style.pointerEvents = 'auto';
        btn.textContent = 'Connecting Wallet...';
        break;
      case 'disconnecting':
        btn.style.visibility = 'visible';
        btn.style.pointerEvents = 'auto';
        btn.textContent = 'Disconnecting Wallet...';
        break;
      case 'disconnected':
      default:
        btn.style.visibility = 'visible';
        btn.style.pointerEvents = 'auto';
        btn.textContent = 'Connect Wallet';
        break;
    }
  });

  //Send button
  if (sendButton) {
    if (state === 'connected') {
      sendButton.style.visibility = 'visible';
      sendButton.style.pointerEvents = 'auto';
    } else {
      sendButton.style.visibility = 'hidden';
      sendButton.style.pointerEvents = 'none';
    }
  }

  //Liquidate button
  if (btnLiquidate) {
  btnLiquidate.disabled = state !== 'connected';
  }

 } catch (error) {
    throw new Error(`Failed to update connection UI: ${error.message || error}`);
    }

}

