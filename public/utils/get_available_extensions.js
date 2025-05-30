export async function getAvailableExtensions() {
    try {
      const { web3Enable } = polkadotExtensionDapp;
      const extensions = await web3Enable('Liebre Pay');
  
      if (extensions.length === 0) {
        console.warn('No extension installed, or the authorization was not accepted');
        return null;
      }
  
      return extensions;
    } catch (error) {
      console.error('Error fetching extensions:', error);
      return null;
    }
  }
