import { account } from '../connect_wallet.js';
import { fetchTransfers } from './fetch.js';
import { paymentList } from './list.js';

export async function updateHistory(page) {
    
    //DOM Elements
    const message = document.getElementById('history-message');
    const listContainer = document.getElementById('transferList');
    
    if (!message || !listContainer) return null;

    if (!account) {
        message.textContent = 'Connect Wallet to show payment history';
        listContainer.innerHTML = '';
        return null;
    }

    try {
        message.textContent = 'Loading...';

        const data = await fetchTransfers(account.address, page);
        const  transfers = data.transfers;
        
        if (!transfers || transfers.length === 0) {
            message.textContent = 'No payment history available for this wallet.';
            listContainer.innerHTML = '';
            return null;
        }

        paymentList(transfers, listContainer);

        //Limpiar mensaje al finalizar
        message.textContent = '';
        return data.count;

        
    } catch (error) {
        message.textContent = `An error occurred while fetching the payment history: ${error.message}`;
    }
}

