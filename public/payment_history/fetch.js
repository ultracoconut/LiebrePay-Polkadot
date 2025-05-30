export async function fetchTransfers(address, page) {
  try {
      const response = await fetch('/api/transactionHistory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address, page }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();  
        const errorMessage = `${errorData.message || 'An error occurred'} (Code: ${errorData.code || 'UNKNOWN'})`;
        throw new Error(errorMessage); 
    }

      const data = await response.json();
      if (data.error || !data.data) {
          throw new Error(data.error?.message || 'Invalid response from server.');
      }
      console.log(data); 
      return data.data;

  } catch (error) {
      console.error('API Error:', error);
      throw error; //Throw the error so that updateHistory can handle it
  }
}
