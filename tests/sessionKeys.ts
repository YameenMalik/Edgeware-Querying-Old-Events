import { Mainnet} from '@edgeware/node-types';
import { SubstrateEvents } from '@commonwealth/chain-events';
import BN from 'bn.js';

let url = 'ws://localhost:9944';
SubstrateEvents.createApi(url, Mainnet).then(async (api) => {
    let blockNumber = 3140000;
    let sessionIdFound = true;
    while(true){
        const hash = await api.rpc.chain.getBlockHash(blockNumber);
        const era = await (await api.query.staking.currentEra.at(hash)).toString();
        const validators = await api.query.session.validators.at(hash);        
        let sessionIds = []
        for(let i = 0 ;i<validators.length;i++){
            const key = validators[i].toString();
            const nextSessionKeysOpt = await api.query.session.nextKeys.at(hash,key);
            sessionIds.push(nextSessionKeysOpt.isSome? true: false); 
        }
        sessionIdFound = (sessionIds.every(item => item === false) == true) ? false: true;
        if(sessionIdFound == false){
            console.log(era, blockNumber, ": Cant find session keys!");
        }else{
            console.log(era, blockNumber, ": Got session keys!");
        }
        blockNumber = blockNumber - 100;
    }
});