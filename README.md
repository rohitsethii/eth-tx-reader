# eth-tx-reader
REST api on top of Ethereum blockchain to server transaction details and account changes


## Getting Started
To get the server running locally:

* Clone this repo
* `npm install` to install all required dependencies
*  Add bin/.env.dev file as follows:
    
    `PORT=8800`

    `ETH_NETWORK=mainnet`

* `npm start` to start the server

### NOTE: To retrieve the internal ETH transfers we can use bebug.trace_transaction rpc call(not available in Infura providers) and then filter out on the basis of the opcodes. Alternatively, we can get all the involved addresses from the stack and check balances before and after the block.