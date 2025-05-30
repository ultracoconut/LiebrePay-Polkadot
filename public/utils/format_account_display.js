import { formatUnifiedAddress } from './format_unified_address.js';

export function formatAccountDisplay(account, nameLimit = 8) {
  try {
    
    //Validate account
    if (!account || !account.meta || !account.address){
      throw new Error('Error in account');
    }

   //Validate nameLimit is a positive number
   if (typeof nameLimit !== 'number' || nameLimit < 0 || !Number.isInteger(nameLimit)) {
    throw new Error('nameLimit must be a non-negative integer');
    }

    let name = account.meta.name || 'Unknown';
    const unifiedAddress = formatUnifiedAddress(account.address);

    //Shorten the name if longer than the limit
    if (name.length > nameLimit) {
      name = name.substr(0, nameLimit) + '...';
    }

    return `${name} (${unifiedAddress.substr(0, 6)}...${unifiedAddress.substr(-6)})`;

  } catch (error) {
    console.error('Error formatting account display:', error);
    throw error;
  }
}
