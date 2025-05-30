import { ASSETS_ID } from './constants.js'
import { apiAH, initializeApi } from './init_apis.js';
import { account } from './connect_wallet.js';
import { updateBalanceDisplay } from './update_ui/update_balance_display.js';
import { updateAccountInfo } from './update_ui/update_account_info.js';

export let balances = { 
  DOT: null,
  DOTRes: null,
  USDT: null,
  USDC: null
};

let unsubDOT = null;
let unsubUSDT = null;
let unsubUSDC = null;

export function subscribeBalanceChanges() {
  return new Promise(async (resolve, reject) => {
    
    try {
      //Verify that the API have been created
      if (!apiAH) {
        await initializeApi();
      }

      //Wait for API to be ready
      await apiAH.isReady;

      console.log('Subscribing to balance changes...');
      const { BN_ZERO } = polkadotUtil;

      balances = { 
        DOT: BN_ZERO,
        DOTRes: BN_ZERO,
        USDT: BN_ZERO,
        USDC: BN_ZERO
      };

      unsubDOT = await apiAH.query.system.account(account.address, ({ data: balance }) => {
        if (!balances['DOT'].eq(balance.free)) {
          balances['DOT'] = balance.free;
          updateBalanceDisplay();
          updateAccountInfo();
        }
        if (!balances['DOTRes'].eq(balance.reserved)) {
          balances['DOTRes'] = balance.reserved;
          updateAccountInfo();
        }
      });

      unsubUSDT = await apiAH.query.assets.account(ASSETS_ID['USDT'], account.address, (result) => {
        const newBalance = result.isSome ? result.unwrap().balance : BN_ZERO;
        if (!balances['USDT'].eq(newBalance)) {
          balances['USDT'] = newBalance;
          updateBalanceDisplay();
          updateAccountInfo(); 
        }
      });

      unsubUSDC = await apiAH.query.assets.account(ASSETS_ID['USDC'], account.address, (result) => {
        const newBalance = result.isSome ? result.unwrap().balance : BN_ZERO;
        if (!balances['USDC'].eq(newBalance)) {
          balances['USDC'] = newBalance;
          updateBalanceDisplay();
          updateAccountInfo(); 
        }
      });

      console.log('Subscribed to balance changes');
      resolve();
      
    } catch (error) {
      console.error("Error configuring subscriptions:", error);
      reject(error);
    }
  });
}
  
  
      //UNSUBSCRIBE BALANCE CHANGES FUNCTION
      export function unsubscribeBalanceChanges() {
       try {
        console.log('Unsubscribing from balance changes...');
        const { BN_ZERO } = polkadotUtil;

        if(unsubDOT) unsubDOT();
        if(unsubUSDT) unsubUSDT();
        if(unsubUSDC) unsubUSDC();

        balances = {
          DOT: BN_ZERO,
          DOTRes: BN_ZERO,
          USDT: BN_ZERO,
          USDC: BN_ZERO
    };

        console.log('Unsubscribed from balance changes');

       } catch (error) {
        console.error("Error during unsubscribe:", error);
      }
    }