import { formatConversionOut } from '../utils/format_conversion_output.js';
import { formatUnifiedAddress } from '../utils/format_unified_address.js';
import { DECIMAL } from '../constants.js';

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
    
    //Update content
    const paymentDetailBox = document.getElementById('payment-detail-box');
    const overlay = document.getElementById('overlay');
    document.getElementById('payment-hash').textContent = `Payment hash: ${transfer.hash || 'Not Available'}`;
    document.getElementById('date-info').textContent = `Date: ${date || 'Not Available'}`;
    document.getElementById('from-address-info').textContent = `From Address: ${formatUnifiedAddress(transfer.from) || 'Not Available'}`;
    document.getElementById('to-address-info').textContent = `To Address: ${formatUnifiedAddress(transfer.to) || 'Not Available'}`;
    document.getElementById('amount-info').textContent = `Paid Amount: ${transfer.amount || 'Not Available'} ${transfer.asset_symbol || 'Not Available'}`;
    document.getElementById('fee-info').textContent = `Network fee paid: ${formatConversionOut(fee, DECIMAL['DOT']) || 'Not Available'} DOT`;
    document.getElementById('result-info').textContent = `Payment result: ${result || 'Not Available'}`;

    //Show the detail box
    paymentDetailBox.style.display = 'flex';
    overlay.style.display = 'flex';

  } catch (error) {
    console.error('Error displaying payment detail:', error);
    alert('An error occurred while displaying the payment details.');
  }
}
