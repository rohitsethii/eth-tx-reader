import { Request, Response, NextFunction } from 'express';
import { CONFIG, CONSTANTS } from '@common';
import { EthUtils } from "@utils";
import * as Ether from "ethers";

export class ETHTxController {

    async getTx(req: Request, res: Response, next: NextFunction) {

        try {
            let txId = req.params.txId;

            let provider = Ether.providers.getDefaultProvider(CONFIG.ETH_NETWORK),
                txReceipt: any = await provider.getTransaction(txId);

            let data = await provider.getCode(txReceipt.to)    // to check if toAddress is a contract

            let block: Object = {
                blockHeight: txReceipt.blockNumber
            }

            let txData: Object | any = {
                hash: txReceipt.hash,
                currency: CONSTANTS.CURRECNCY,
                chain: CONSTANTS.CURRECNCY + '.' + CONSTANTS.CHAIN,
                block: block,
            }

            if (txReceipt.confirmations < 1)
                txData["state"] = "confirmed";


            // if toAddress is a contract
            if (data == '0x') {
                txData["depositType"] = CONSTANTS.ACCOUNT;
                txData['outs'] = [{
                    address: txReceipt.from,
                    value: '-' + txReceipt.value.toString()
                }];

                txData['ins'] = [{
                    address: txReceipt.to,
                    value: txReceipt.value.toString()
                }];


            } else {
                // get events and filter out ERC20 transfer events
                let events = await EthUtils.filterEvents(txId);

                if (events.length > 0) {

                    let outArr = Array();
                    let inArr = Array();

                    for (let i = 0; i < events.length; i++) {
                        outArr.push({
                            address: events[i].from,
                            value: (events[i].value).toString(),
                            type: "token",
                            coinspecific: {
                                tokenAddress: events[i].address
                            }
                        })
                        inArr.push({
                            address: events[i].to,
                            value: "-" + (events[i].value).toString(),
                            type: "token",
                            coinspecific: {
                                tokenAddress: events[i].address
                            }
                        })
                    }

                    // trace_transaction to get the internal ether trasnfers
                    
                    txData["depositType"] = CONSTANTS.CONTRACT;
                    txData["outs"] = outArr;
                    txData["ins"] = inArr;


                } else {

                    // get internal eth transfers from bebug.trace_transaction

                }
            }

            res.json(txData);

        } catch (error) {
            res.send(error)
        }

    }
}

export const ETHTxControllerV1 = new ETHTxController();