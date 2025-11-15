export const walletState = {
  account: null,
  injector: null,
  type: null,

 //Method to update the entire state
  set({ account, injector, type }) {
    this.account = account;
    this.injector = injector;
    this.type = type;
  },
  //Method to clear the state
  reset() {
    this.account = null;
    this.injector = null;
    this.type = null; 
  },
  //Method to check if a wallet is connected
  isConnected() {
    return !!this.account;
  }
};
