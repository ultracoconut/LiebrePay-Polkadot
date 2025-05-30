export function checkDependencies() {
  try {
    //Polkadotjs utilities
    if (!window.polkadotUtil) {
      throw new Error('polkadotUtil not loaded');
    }
    if (!window.polkadotUtilCrypto) {
      throw new Error('polkadotUtilCrypto not loaded');
    }
    if (!window.polkadotKeyring) {
      throw new Error('polkadotKeyring not loaded');
    }
    if (!window.polkadotTypes) {
      throw new Error('polkadotTypes not loaded');
    }
    if (!window.polkadotApi) {
      throw new Error('polkadotApi not loaded');
    }
    if (!window.polkadotExtensionDapp) {
      throw new Error('polkadotExtensionDapp not loaded');
    }

    //PapaParse
    if (!window.Papa) {
      throw new Error('PapaParse not loaded');
    }
    
    console.log('All dependencies loaded successfully');
    return true;

  } catch (error) {
    console.error('Dependency check failed:', error.message);
    return false;
  }
}
