export function formatConversionOut(amountBN, decPrec) {

 try{
  
  const { BN } = polkadotUtil;
  
  //Validate amountBN is a BN object 
  if (!(amountBN instanceof BN)) {
    throw new Error('amountBN must be a BN object');
  }

  //Validate decPrec is a positive number
  if (typeof decPrec !== 'number' || decPrec < 0 || !Number.isInteger(decPrec)) {
    throw new Error('decPrec must be a non-negative integer');
  }

  const divisor = new BN(10).pow(new BN(decPrec));
  const wholePart = amountBN.div(divisor).toString(); //Integer part
  const fractionalPart = amountBN.mod(divisor).toString().padStart(decPrec, '0'); //Decimal part with zeros

  return `${wholePart}.${fractionalPart}`.replace(/\.?0+$/, ''); //Remove unnecessary zeros

} catch (error) {
  throw error; 
}
};

