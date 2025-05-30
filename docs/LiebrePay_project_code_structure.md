# Liebre Pay
## Project Code Structure
This document describes the structure of the Liebre Pay project, outlining the key files and their roles in the application.  
### `constants.js`: This file stores all project constants.
### `server.js`: This file sets up an Express server that serves static files from the public folder and provides a route to fetch a user's transaction history. The API key to interact with the Subscan API is retrieved from a configuration file, and the server responds to POST requests sent by the client, returning the transaction history based on the provided wallet address.
### `index.js`: This is the entry point of the application, where the logic for tasks such as loading the various HTML templates is handled.
Main functions:
1. **updateAuxConnect:** Controls the visibility and interaction of buttons based on whether a wallet is connected or not. If no account is connected, it shows the connect buttons and hides the send buttons. If an account is connected, it does the opposite.  
2. **loadTemplate:** Dynamically loads an external HTML template using fetch. Depending on the page identifier (pageId), it attempts to load the corresponding content from the server and return it as text.
3. **updatePage:** Updates the page content by loading the HTML template associated with the pageId. After loading the template, it adds event listeners for general UI components and runs the specific initialization function for that page using the pageHandlers object.
4. **menuItems (Menu Selection):** Adds event listeners to the menu items so that when a new item is selected, the page content is updated accordingly. It also updates the selected class to highlight the active item in the menu.
5. **initializeApi:** Ensures the Polkadot.js API is initialized when the page loads.

### `connect_wallet.js`: This file manages wallet connection and integration with Polkadot.js extensions. It provides functionality to connect a user's wallet, select an account, and update the application's state based on the wallet's status.
### `init_apis.js`: This file manages the connection to Polkadot.js API, specifically to the Asset Hub chain. It provides a function to initialize the connection handles key API events (such as connection, disconnection, and errors).
### `subscribe_balances.js`: This file manages real-time subscriptions to balance changes for specific assets using Polkadot.js API.
### `transactions (folder)`: This folder contains the transaction functions as js files, which are called from the different pages of the application.
Functions:
1. **single_payment_WND:** Handles the logic to execute a single payment in WND, including user confirmation, transaction submission, and real-time status tracking on the blockchain.
2. **single_payment_assets:** This file defines a function to handle single payments of assets (on-chain tokens) using Polkadot's Asset Hub chain. Each asset is identified by a unique Asset ID (ASSETS_ID), ensuring precise management and transfer of specific tokens. The function includes user confirmation, fee calculation, balance validation, transaction submission, and real-time status tracking.
3. **multi_payment:** This file implements a multi-payment function for handling batch transactions involving multiple beneficiaries and different currencies. It leverages Polkadot's Asset Hub chain and supports token transfers for assets identified by their unique Asset IDs (ASSETS_ID). The function processes a CSV file containing payment instructions, validates the data for correctness, ensures sufficient balances, calculates fees, and executes transactions in a single batch. Key features include user confirmation, transaction fee estimation, and real-time status tracking.

### `init_pages (folder)`: This folder houses the JavaScript files for the initialization functions of each page, which are invoked from the index.js.
### `templates (folder)`: This folder contains the HTML files, which are loaded from the index.js.
### `Other utility and configuration files`, such as `validate_fields.js` and `update_balance_display.js`, provide additional support functions for the application.



