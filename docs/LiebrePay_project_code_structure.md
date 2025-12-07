# Liebre Pay
## Project Code Structure
This document describes the structure of the Liebre Pay project, outlining the key files and their roles in the application.  
### `constants.js`: This file stores all project constants.
### `server.js`: This file sets up an Express server that serves static files from the public folder and provides a route to fetch a user's transaction history. The API key to interact with the Subscan API is retrieved from a configuration file, and the server responds to POST requests sent by the client, returning the transaction history based on the provided wallet address.
### `index.js`: This is the entry point of the application, where the logic for tasks such as loading the various HTML templates is handled.

Core Functions in index.js:
1. **loadTemplate:** Dynamically loads an external HTML template using fetch. Depending on the page identifier (pageId), it attempts to load the corresponding content from the server and return it as text.

2. **updatePage:** Updates the page content by loading the HTML template associated with the pageId. After loading the template, it adds event listeners for general UI components and runs the specific initialization function for that page using the pageHandlers object.

3. **menuItems (Menu Selection):** Adds event listeners to the menu items so that when a new item is selected, the page content is updated accordingly. It also updates the selected class to highlight the active item in the menu.

4. **initializeApi:** Ensures the Polkadot.js API is initialized when the page loads.

### `init_apis.js`: This file manages the connection to Polkadot.js API, specifically to the Asset Hub chain. It provides a function to initialize the connection and handles key API events (such as connection, disconnection, and errors).
### `subscribe_balances.js`: This file manages real-time subscriptions to balance changes for specific assets using Polkadot.js API.
### `wallet/` : This folder contains all wallet-related logic, including connection, account management, and global wallet state.
connect_wallet.js: Handles wallet connection via Polkadot.js extensions, account selection, and syncing UI state with the connected wallet.

wallet_state.js: Provides a centralized global wallet state accessible across the entire application.
It stores and manages:

**account**: The selected wallet address.

**injector**: The signer object provided by the Polkadot.js extension, used for signing transactions.

**type**: The connected wallet type.

Core functionality:

`set({ account, injector, type })`
Updates the entire wallet state when a user connects or switches accounts.

`reset()`
Clears all wallet data (used on wallet disconnection).

`isConnected()`
Returns a boolean indicating whether a wallet is currently connecte

### `transactions/`: Contains all transaction-related functions used across different pages.

Core Functions in transactions/:
1. **singlePaymentDOT:** Handles the logic to execute a single payment in DOT, including user confirmation, transaction submission, and real-time status tracking on the blockchain.

2. **singlePaymentAssets:** This function handles single payments of assets (on-chain tokens). Each asset can be either a native asset, identified by a unique Asset ID (ASSETS_ID), or a foreign asset, identified by an XCM MultiLocation (MULTILOCATION).
The function automatically detects the asset type and uses the appropriate transfer method (`assets.transferKeepAlive` for native assets, or `foreignAssets.transferKeepAlive` for foreign assets). It includes user confirmation, fee calculation, balance validation, transaction submission, and real-time status tracking.

3. **multiPayment:** Implements a batch payment function for processing multiple transactions to different beneficiaries and currencies. The function processes a CSV file containing payment instructions, validates the data for accuracy, ensures sufficient balances, estimates fees, and executes all transactions in a single batch. Key features include user confirmation, transaction fee estimation, and real-time status tracking.

4. **closeAndTransfer:** Closes an account by transferring all available funds from supported currencies to a specified recipient address. Builds an initial batch to estimate fees, displays a detailed summary to the user, and requests confirmation. Finally, it executes the transfer after deducting necessary fees.

### `init_pages/`: This folder houses the JavaScript files for the initialization functions of each page, which are invoked from the index.js.
### `templates/`: This folder contains the HTML files, which are loaded from the index.js.
### `update_ui/`: This folder contains modular JavaScript functions responsible for updating the user interface (UI) elements across various pages of the application.
### `utils/`: This folder contains general-purpose utility functions designed for reuse across different parts of the application or in other projects. These functions are not tied to any specific UI or page logic.
### `Other utility and configuration files`, such as `validate_fields.js` provide additional support functions for the application.

### `Third-party precompiled libraries`: These folders contains manually included external libraries (instead of being installed via a package manager like npm). These libraries provide essential functionality to the application, such as CSV parsing and blockchain interaction.

1. **papaparse/ :** Includes the standalone version of the PapaParse library, used to parse CSV files directly in the browser. It is primarily used for batch payments where user-provided CSVs containing address, amount and currency data.

2. **polkadotjs_bundles/ :** Contains pre-bundled versions of Polkadot.js libraries (e.g., polkadotApi, polkadotUtil, polkadotKeyring). These bundles expose core Polkadot blockchain interaction functionality, such as wallet interaction, balance queries, transaction submission, etc.