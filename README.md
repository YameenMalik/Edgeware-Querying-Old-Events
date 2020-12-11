# Edgeware-Querying-Old-Events
Working on getting the data from all past events emitted by edgeware-node.


## Dependencies:
To install code depdencies run `npm i` or `yarn`. ALl the scripts were tested against an arhival node fully synced with mainnet. Make sure you have a fully synced archival node running before executing the script. 

## How to use:
Use `yarn query-old-eras` or `npm run query-old-eras` to run the script. The script finds the number of eras for which data is available. It starts from the latest era of the node and queries for following information for old eras(header -1, header -2 .....) untill it stops getting any data. The data requested is as follows:
- **erasStakers.keys:** Used to find the keys of the nextElected validators # read it in a github repo, need to reconfirm this and reference the repo.
- **erasRewardPoint:** Contains the era reward points earned by validators
- **erasValidatorPrefs:** Contains the comission charged by validators

## Findings:
- When running the script against a fully synced archival node, I am only able to get data for as far as last 86 eras.
```
# Script output
$ ts-node -T ./scripts/query-old-eras.ts
Applied changes: logLevel=Debug to log groups 'all'.
Current head at era: 5545
- Keys available for last 86 eras
- Era Points available for last 86 eras
- Comission available for last 86 eras
Done
```