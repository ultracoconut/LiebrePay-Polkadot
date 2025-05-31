# Liebre Pay (Polkadot) - Docker Setup Instructions

Follow these steps to set up the project with Docker.

## 1. Clone the repository:
```bash
git clone https://github.com/ultracoconut/LiebrePay-Polkadot
cd LiebrePay-Polkadot
```
## 2. Configure Subscan key:
To retrieve the payment history, you need to configure a Subscan API key.  

- Go to Subscan API and get a free API key:  
https://pro.subscan.io/pricing  

- Copy the `config.example.json` file in the root of the project and rename it to `config.json`:  
    ```bash
    cp config.example.json config.json
    ```
- Open the config.json file and add your Subscan API key:  
    ```json
    {  

    "SUBSCAN_API_KEY": "your_api_key_here" 

    }  
    ```

## 3. Build and run the application with Docker:
Run the following commands **in the root of the project**:
```bash 
docker build -t liebrepay-app .
docker run -p 3000:3000 liebrepay-app
```  
## 4. Access the application:
The application should now be running on [http://localhost:3000](http://localhost:3000).
