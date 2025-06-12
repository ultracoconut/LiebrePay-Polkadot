import { formatConversionOut } from '../utils/format_conversion_output.js';

export function paymentDetailBox(transfers, index) {
  try {
    const transfer = transfers[index];
    if (!transfer) {
      console.error('Transfer not found at index:', index);
      return;
    }

    const { BN } = polkadotUtil;
    const fee = new BN(transfer.fee);

    const result = transfer.success ? 'Successful' : 'Failed';
    const date = new Date(transfer.block_timestamp * 1000).toLocaleString();
    const closeBtn = document.getElementById('close-detail-box');
    const overlay = document.getElementById('overlay');

    //Update content
    const paymentDetailBox = document.getElementById('payment-detail-box');
    document.getElementById('payment-hash').textContent = `Payment hash: ${transfer.hash || 'Not Available'}`;
    document.getElementById('date-info').textContent = `Date: ${date || 'Not Available'}`;
    document.getElementById('from-address-info').textContent = `From Address: ${transfer.from || 'Not Available'}`;
    document.getElementById('to-address-info').textContent = `To Address: ${transfer.to || 'Not Available'}`;
    document.getElementById('amount-info').textContent = `Paid Amount: ${transfer.amount || 'Not Available'} ${transfer.asset_symbol || 'Not Available'}`;
    document.getElementById('fee-info').textContent = `Network fee paid: ${formatConversionOut(fee, 12) || 'Not Available'} WND`;
    document.getElementById('result-info').textContent = `Payment result: ${result || 'Not Available'}`;

    
    //Close box function
    if (!closeBtn.dataset.listenerAdded) {
      closeBtn.addEventListener('click', () => {
        paymentDetailBox.style.display = 'none';
        overlay.style.display = 'none';
      });
      closeBtn.dataset.listenerAdded = 'true';
    }

    //Show the detail box
    paymentDetailBox.style.display = 'flex';
    overlay.style.display = 'flex';

  } catch (error) {
    console.error('Error displaying payment detail:', error);
    alert('An error occurred while displaying the payment details.');
  }
}
