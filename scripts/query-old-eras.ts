import { Mainnet} from '@edgeware/node-types';
import { SubstrateEvents } from '@commonwealth/chain-events';
import { EraRewardPoints } from '@polkadot/types/interfaces';
import BN from 'bn.js';

// connecting to local archival node
let url = 'ws://localhost:9944';
// create api
SubstrateEvents.createApi(url, Mainnet).then(async (api) => {
    
    const overview = await api.derive.staking.overview();
    console.log(`Current head at era: ${overview.activeEra}`);

    // get the header block and its hash
    const headerBlock = await api.rpc.chain.getBlock();    
    const hash = await api.rpc.chain.getBlockHash(headerBlock.block.header.number.toString());


    let era = parseInt(overview.activeEra.toString());
    let keys = []
    let eraCount = 0;

    // test how far back we can get keys 
    do{
        keys = await api.query.staking.erasStakers.keys(era.toString());
        await api.query.staking.erasRewardPoints<EraRewardPoints>(era)
        era--;
        eraCount++;
    }while(keys.length > 0)
    console.log(`- Keys available for last ${eraCount} eras`);

    // test how far back we can get era points 
    era = parseInt(overview.activeEra.toString());
    eraCount = 0
    let eraPoints;
    do{
        eraPoints =  await (await api.query.staking.erasRewardPoints<EraRewardPoints>(era.toString())).individual.toJSON();
        era--;
        eraCount++;
    }while(Object.keys(eraPoints).length > 0)
    console.log(`- Era Points available for last ${eraCount} eras`);

    // test how far we can get validators commission
    era = parseInt(overview.activeEra.toString());
    eraCount = 0
    let commission;
    const validators = await api.query.session.validators.at(hash);
    do{ 
        // assuming that the validator[0] is available throughout all these eras and its comission is > 0 
        const prefs = await api.query.staking.erasValidatorPrefs(era.toString(),validators[0]);
        commission = (Number)(prefs.commission || new BN(0)) / 10_000_000;
        era--;
        eraCount++;
    }while(commission > 0)
    console.log(`- Comission available for last ${eraCount} eras`);

console.log("Done")
});
