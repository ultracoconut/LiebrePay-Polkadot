export async function getInjector(address) {
  const { web3FromAddress } = polkadotExtensionDapp;

  try {
    const injector = await web3FromAddress(address);
    return injector;
  } catch (error) {
    console.error('Error getting injector for address:', address, err);
    throw error;
  }
}
