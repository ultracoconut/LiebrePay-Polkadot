export function formatUnifiedAddress(address){

 try{ 
    const { encodeAddress } = polkadotKeyring;

    if(!address){
      throw new Error ('No address provided');
    }
    
    return encodeAddress(address, 0); //Encode to Polkadot address format 


 }catch (error){
   throw error; 
 }

}

