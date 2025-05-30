import { account } from '../connect_wallet.js';
import { formatUnifiedAddress } from '../utils/format_unified_address.js';

export function paymentList(transfers, listContainer) {
    
    // Clean previous list
    listContainer.innerHTML = '';

    // Generate the list
    transfers.forEach((transfer) => {
        const li = document.createElement('li');
        const amount = parseFloat(transfer.amount);
        const date = new Date(transfer.block_timestamp * 1000).toLocaleString();
        const isSent = transfer.from === formatUnifiedAddress(account.address);
        const displayedAmount = isSent ? -amount : amount;
        const counterpart = isSent ? transfer.to : transfer.from;

        // Create base text
        li.textContent = `${date}, ${counterpart}, `;

        // Create span for the amount with style 
        const amountSpan = document.createElement('span');
        amountSpan.textContent = `${displayedAmount.toFixed(4)} ${transfer.asset_symbol}`;
        amountSpan.style.color = transfer.success === false
            ? 'red'
            : displayedAmount > 0
            ? 'green'
            : 'grey';

        // Add span to <li>
        li.appendChild(amountSpan);
        li.style.borderBottom = '1px solid grey';
        li.style.padding = '10px 0';

        // Add <li> to the list
        listContainer.appendChild(li);
    });

    
}
