import { Request, Response, NextFunction } from 'express';
import { CONFIG, CONSTANTS } from '@common';
import { EthUtils } from "@utils";
import * as Ether from "ethers";

export class ETHTxController {

    async getTx(req: Request, res: Response, next: NextFunction) {

        try {
            let txId = req.params.txId;
            let provider = new Ether.providers.JsonRpcProvider(CONFIG.ETH_NETWORK),
            // let provider = Ether.providers.getDefaultProvider(),
            txReceipt: any = await provider.getTransaction(txId);
            console.log(txReceipt);
            let data = await provider.getCode(txReceipt.to)    // to check if toAddress is a contract

            // let block: Object = {
            //     blockHeight: txReceipt.blockNumber
            // }

            let txData: Object | any = {
                hash: txReceipt.hash,
                currency: CONSTANTS.CURRECNCY,
                // chain: CONSTANTS.CURRECNCY + '.' + CONSTANTS.CHAIN,
                block: txReceipt.blockNumber,
                from: txReceipt.from,
                to: txReceipt.to
            }

            if (txReceipt.confirmations < 1)
                txData["state"] = "confirmed";

            let txRec = await provider.getTransactionReceipt(txId);
            
            txData['value'] = Ether.utils.formatEther(txReceipt.value).toString() + ' Ether';

            txData['fee'] = Ether.utils.formatEther(txRec.gasUsed.mul(txReceipt.gasPrice)).toString() + ' Ether ';
            
            // if toAddress is a contract
            if (data != '0x') {
                // get events and filter out ERC20 transfer events
                let events = await EthUtils.filterEvents(txId);

                if (events.length > 0) {

                    let outArr = Array();
                    // let inArr = Array();

                    for (let i = 0; i < events.length; i++) {
                        let { name, symbol } = await this.getTokenName(events[i].address);
                        outArr.push({
                            from: events[i].from,
                            to: events[i].to,
                            value: (Ether.utils.formatEther(events[i].value)).toString(),
                            type: "token",
                            coinspecific: {
                                tokenAddress: events[i].address,
                                name, 
                                symbol
                            }
                        })
                        // inArr.push({
                        //     address: events[i].to,
                        //     value: "-" + (events[i].value).toString(),
                        //     type: "token",
                        //     coinspecific: {
                        //         tokenAddress: events[i].address
                        //     }
                        // })
                    }

                    // trace_transaction to get the internal ether trasnfers
                    
                    txData["depositType"] = CONSTANTS.CONTRACT;
                    txData["outs"] = outArr;
                    // txData["ins"] = inArr;


                } else {

                    // get internal eth transfers from bebug.trace_transaction

                }
            }

            res.json(txData);

        } catch (error) {
            res.send(error)
        }

    }

    async getTokenName(address: string) {
        let provider = new Ether.providers.JsonRpcProvider(CONFIG.ETH_NETWORK)
        let abi = ['function name() public view returns (string)',
                    'function symbol() public view returns (string)'];
        let contract = new Ether.ethers.Contract(address,abi,provider);
        return {
            name : await contract.name(),
            symbol: await contract.symbol()
        }
    }
}

export const ETHTxControllerV1 = new ETHTxController();