export function formatConversionIn(amount, decPrec) {
  
try {

  const { BN } = polkadotUtil;
  
  //Validate decPrec is a positive number
  if (typeof decPrec !== 'number' || decPrec < 0 || !Number.isInteger(decPrec)) {
    throw new Error('decPrec must be a non-negative integer');
  }
  
  //Convert amount to string for safety
  if (typeof amount !== "string") {
  amount = amount.toString(); 
  }
  
  //Check if amount is a valid number with optional decimal part (using either dot or comma as separator)
  if (!/^\d+([.,]\d+)?$/.test(amount)) { 
    throw new Error(`Invalid number format: "${amount}"`);
  }
  
  amount = amount.trim().replace(",", "."); //Normalize decimal separator to a dot
 
  if (!amount.includes(".")) {
    return new BN(amount).mul(new BN(10).pow(new BN(decPrec)));
  }

  const [whole, fraction = ""] = amount.split(".");
  const fractionLength = fraction.length;

  if (fractionLength > decPrec) {
    throw new Error(`Too many decimals`);
  }

  //Convert the amount to an integer by removing the decimal point
  const normalizedAmount = whole + fraction.padEnd(decPrec, "0");

  return new BN(normalizedAmount);

} catch (error) {
  throw error;
}

};
