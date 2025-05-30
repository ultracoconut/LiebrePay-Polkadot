//Import Express
const express = require('express');

//Import fs
const fs = require('fs');

//Import path
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());

//Serve static files from the 'public' folder
app.use(express.static('public'));

//Handling the root route to serve the HTML file from the 'public' folder using path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
     

//Transaction history endpoint
app.post('/api/transactionHistory', async (req, res) => {
  const { address, page = 0 } = req.body;

  //Read config.json file
  let config;
  try {
  config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
  }catch (error) {
    return res.status(500).json({ error: 'Error reading config.json' });
    }
  
  //Validate apiKey from config.json
  const apiKey = config.SUBSCAN_API_KEY;
  if (!apiKey || apiKey === 'your_api_key_here') {
      return res.status(400).json({ error: 'API key not configured. Please set SUBSCAN_API_KEY in the config.json file.' });
      }

  //Validate address
  if (!address || typeof address !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing address' });
  }
     
  //Configure request options
  const requestOptions = {
    method: 'POST',
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json"
      },
    body: JSON.stringify({
       address, 
       page, 
       row: 20 
      }),
    redirect: 'follow' 
    };

   
   try {
    //Fetch transfers from subscan api
    const response = await fetch("https://assethub-polkadot.api.subscan.io/api/v2/scan/transfers", requestOptions);
   
    //verify if the response was successful
    if (!response.ok) {
      const errorDetails = await response.json(); 
      throw new Error(`API error: ${response.statusText} - ${JSON.stringify(errorDetails)}`);
    }

    const result = await response.json();
    
    //Send result JSON to the frontend
    res.json(result); 

  } catch (error) {
    console.error('Error:', error);
    const errorResponse = {
      message: error.message || 'Error retrieving payment history',
      code: error.cause?.code || 'UNKNOWN_ERROR',
    };
    res.status(500).json(errorResponse);
  }
  
});


  async function startServer() {
    
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

startServer().catch(console.error);