export async function getAvailableAccounts(extensionName = null) {
  const { web3Accounts } = polkadotExtensionDapp;

  try {
    const accounts = await web3Accounts();

    if (!accounts || accounts.length === 0) {
      console.warn('No accounts found');
      return null;
    }

    if (extensionName) {
      const filtered = accounts.filter(acc => acc.meta.source === extensionName);
      return filtered.length > 0 ? filtered : null;
    }

    return accounts;

  } catch (error) {
    console.error('Failed to get accounts:', error);
    return null;
  }
}
