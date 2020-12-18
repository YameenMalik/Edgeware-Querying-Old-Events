import { Mainnet} from '@edgeware/node-types';
import { SubstrateEvents } from '@commonwealth/chain-events';
import BN from 'bn.js';

let url = 'ws://localhost:9944';
SubstrateEvents.createApi(url, Mainnet).then(async (api) => {
    let blockNumber = 3140000;
    while(true){
        const hash = await api.rpc.chain.getBlockHash(blockNumber);
        const era = await (await api.query.staking.currentEra.at(hash)).toString();
        const nextSessionKeys = await api.query.session.queuedKeys.at(hash);
        if(nextSessionKeys.length == 0){
            console.log(era, blockNumber, ": Cant find queued keys!");
        }else{
            console.log(era, blockNumber, ": Got queued keys!");
        }
        blockNumber = blockNumber - 100;
    }
});