import * as Ether from "ethers";
import { CONFIG } from "@common";

class EtherUtils {

    private provider = new Ether.providers.JsonRpcProvider(CONFIG.ETH_NETWORK);

    async filterEvents(txHash: any) {

        let abi = ['event Transfer(address indexed from, address indexed to, uint value)'];

        const reciept = await this.provider.getTransactionReceipt(txHash);
        const iface = new Ether.utils.Interface(abi);
        const logs = reciept.logs;
        const filtered = logs.filter(log => log.topics[0] == "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef");
        let decodedEvents: any = [];
        filtered.forEach(async element => {
            let decoded = await iface.decodeEventLog("Transfer", element.data, element.topics);
            let eventObj = {
                address: element.address,
                ...decoded,
            }
            decodedEvents.push(eventObj);
        });
        return decodedEvents;
    }
}

export const EthUtils = new EtherUtils();