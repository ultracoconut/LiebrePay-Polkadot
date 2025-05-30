import { DECIMAL, MIN_BAL_FREE, MIN_PAY_AMOUNT } from '../constants.js';
import { balances } from '../subscribe_balances.js';
import { formatConversionIn } from './format_conversion_input.js';

//Function to Validate Amount
export function validateAmount(amount, currency){

  try{
  
    const { BN } = polkadotUtil;
    let amountBn;

    amountBn = formatConversionIn(amount, DECIMAL[currency]);
    
    // Verify amount is a valid BN and greater than MIN_PAY_AMOUNT
    if (!BN.isBN(amountBn) || amountBn.lt(MIN_PAY_AMOUNT[currency])) { 
      return false; 
    } 

  // Validate required balance
  if (balances[currency].lt(amountBn.add(MIN_BAL_FREE[currency]))) {
      return false;
    } 

      return true;

  } catch {
      return false;
  }
}
