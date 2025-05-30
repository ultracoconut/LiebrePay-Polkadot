import { URL_PROVIDER } from './constants.js';

export let apiAH;
export let isApiInitialized = false; //Flag to verify api initialization
 
 //INITIALIZE API FUNCTION
  export async function initializeApi() {

    if (isApiInitialized) {
      return;
    }

  console.log('Initializing API...');
  const circleIndicatorAH = document.getElementById('circle-AH'); 
  
  try {

  const { WsProvider, ApiPromise } = polkadotApi;
  
  //Construct Asset Hub API provider
  const AssetHubProvider = new WsProvider(URL_PROVIDER);
  apiAH = new ApiPromise ({ provider: AssetHubProvider });
  } catch (error) {
    console.error('Error during API provider creation:', error);
    return;
  }
  
  //Api listeners for the events
  apiAH.on('connected', () => {
    console.log('API connected to Asset Hub');
    circleIndicatorAH.classList.remove('disconnected');
    circleIndicatorAH.classList.add('connected');
  });

  apiAH.on('disconnected', () => {
    console.log('API disconnected from Asset Hub');
    circleIndicatorAH.classList.remove('connected');
    circleIndicatorAH.classList.add('disconnected');
  });
  
  apiAH.on('ready', () => {
    console.log(`API ready for Asset Hub`);
  });

  apiAH.on('error', (error) => {
    console.error('API error for Asset Hub:', error);
    circleIndicatorAH.classList.remove('connected');
    circleIndicatorAH.classList.add('disconnected');
  });

   //Wait for the API to be ready
   await apiAH.isReady;
  
  //Api initialized 
  isApiInitialized = true;
  }
