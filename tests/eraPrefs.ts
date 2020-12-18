import { Mainnet} from '@edgeware/node-types';
import { SubstrateEvents } from '@commonwealth/chain-events';
import BN from 'bn.js';

let url = 'ws://localhost:9944';
SubstrateEvents.createApi(url, Mainnet).then(async (api) => {
    let blockNumber = 3140000;
    while(true){
        const hash = await api.rpc.chain.getBlockHash(blockNumber);
        const era = await (await api.query.staking.currentEra.at(hash)).toString();
        const validators = await api.query.session.validators.at(hash);        
        let comissions = []
        for(let i = 0 ;i<validators.length;i++){
            const key = validators[i].toString();
            const prefs = await api.query.staking.erasValidatorPrefs.at(hash, era,key);
            const commissionPer =  (Number)(prefs.commission || new BN(0)) / 10_000_000;
            comissions.push(commissionPer);
        }
        const comissionFound = (comissions.every(item => item === 0) == true) ? false: true;
        if(comissionFound == false){
            console.log(era, blockNumber, ": Found all comissions to be 0!");
        }else{
            console.log(era, blockNumber, ": Found comission!");
        }
        blockNumber = blockNumber - 100;
    }
});