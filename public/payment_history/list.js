import { account } from '../connect_wallet.js';
import { formatUnifiedAddress } from '../utils/format_unified_address.js';
import { transferDetailBox } from './transfer_detail_box.js';

export function paymentList(transfers, listContainer) {
    
    //Clean previous list
    listContainer.innerHTML = '';

    //Generate the list
    transfers.forEach((transfer, index) => {
        const li = document.createElement('li');
        li.className = 'transfer-item';
        const amount = parseFloat(transfer.amount);
        const date = new Date(transfer.block_timestamp * 1000).toLocaleString();
        const isSent = transfer.from === formatUnifiedAddress(account.address);
        const displayedAmount = isSent ? -amount : amount;
        const counterpart = isSent ? transfer.to : transfer.from;

        //Create base text
        li.textContent = `${date}, ${counterpart}, `;

        //Create span for the amount with style 
        const amountSpan = document.createElement('span');
        amountSpan.textContent = `${displayedAmount.toFixed(4)} ${transfer.asset_symbol}`;
        amountSpan.style.color = transfer.success === false
            ? 'red'
            : displayedAmount > 0
            ? 'green'
            : 'grey';

        //Add span to <li>
        li.appendChild(amountSpan);

        //Add click event
        li.addEventListener('click', () => {
            transferDetailBox(transfers, index);
        });

        //Add <li> to the list
        listContainer.appendChild(li);
    });

    
}
