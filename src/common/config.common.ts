import * as dotenv from "dotenv";

// configure the environment
dotenv.config({ path: `bin/.env.${process.env.NODE_ENV}` });

export const CONFIG = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    APP_PORT: process.env.PORT,
    ETH_NETWORK: process.env.ETH_NETWORK
}

export const CONSTANTS = {
    CHAIN: CONFIG.ETH_NETWORK == "mainnet"? "main": CONFIG.ETH_NETWORK,
    CURRECNCY: "ETH",
    ACCOUNT: "account",
    CONTRACT: "contract"
}