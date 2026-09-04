// *********************************************************************
//
// D&B Direct+ Standard Data Blocks JavaScript object wrapper
// Code file: DplDBs.js
//
// Copyright 2026 Hans de Rooij
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
// either express or implied. See the License for the specific
// language governing permissions and limitations under the
// License.
//
// *********************************************************************

import { ElemLabel } from '../../../elemLabel.js';

//D&B Direct+ Data Blocks JavaScript object wrapper
export class DplDBs {
    constructor(inp) {
        //Parse the JSON passed in as a string or buffer
        if((typeof inp === 'string' || Buffer.isBuffer(inp)) && inp.length) {
            try {
                this.dplDBs = JSON.parse(inp)
            }
            catch(err) {
                console.error(err.message);
                throw(err);
            }

            //The parsed object should have an organization node
            if(!this.dplDBs.organization) {
                throw new Error('Constructor parameter is valid JSON but not a collection of D&B Direct+ data blocks')
            }

            //Create a shortcut to the organization attribute
            this.org = this.dplDBs.organization;
        }

        //A D&B Direct+ collection of data blocks can be passed in, as an object, to the constructor as well
        if(typeof inp === 'object' && !Buffer.isBuffer(inp)) {
            //The object passed in to the constructor should have an organization node
            if(!inp.organization) {
                throw new Error('The constructor parameter is an object but not a collection of D&B Direct+ data blocks')
            }

            //Store a reference to the object passed in to the constructor
            this.dplDBs = inp;

            //Create a shortcut to the organization attribute
            this.org = inp.organization;
        }
        
        //One-to-one mappings
        this.map121 = { //Collection of directly mapped values
            // Common data-elements
            duns:        this.org.duns,
            primaryName: this.org.primaryName,
            countryISO:  this.org.countryISOAlpha2Code
        }

        //One-to-one mappings of control status details
        if(this.org?.dunsControlStatus) {
            const orgCtrlStatus = this.org.dunsControlStatus;

            this.map121.opStatus = orgCtrlStatus.operatingStatus?.description;
            this.map121.opStatusDate = orgCtrlStatus.operatingStatus?.startDate;
            this.map121.isMarketable = orgCtrlStatus.isMarketable;
        }

        //Miscellaneous one-to-one mappings
        this.map121.startDate = this.org.startDate;
        this.map121.SMB = this.org.organizationSizeCategory?.description;
        this.map121.defaultCurr = this.org.defaultCurrency;
        this.map121.marketable = this.org.dunsControlStatus?.isMarketable;

        //One-to-one mappings of inquiry details
        if(this.dplDBs.inquiryDetail) {
            const inqDetail = this.dplDBs.inquiryDetail;

            this.map121.inqDuns = inqDetail.duns;
            this.map121.tradeUp = inqDetail.tradeUp;
            this.map121.custRef = inqDetail.customerReference;
        }
    }

    //Compile Data Block request & response information into a Map object
    //All API responses contain a inquiryDetail.blockIDs & blockStatus array
    //
    //JSON example: "blockIDs": [
    //        "companyinfo_L1_v1",
    //        "principalscontacts_L2_v2"
    //    ],
    //
    //... and D+ Data Block property "blockStatus": [
    //    {
    //        "blockID": "companyinfo_L1_v1",
    //        "status": "ok",
    //        "reason": null
    //    },{
    //        "blockID": "principalscontacts_L2_v2",
    //        "status": "ok",
    //        "reason": null
    //    },{
    //        "blockID": "baseinfo_L1_v1",
    //        "status": "ok",
    //        "reason": null
    //    }]
    //
    //... into
    //  {
    //    companyinfo: {
    //      req: { level: 1, version: 1 },
    //      resp: { level: 1, version: 1, status: 'ok', reason: null }
    //    },
    //    principalscontacts: {
    //      req: { level: 2, version: 2 },
    //      resp: { level: 2, version: 2, status: 'ok', reason: null }
    //    },
    //    baseinfo: { resp: { level: 1, version: 1, status: 'ok', reason: null } }
    //  }
    get blockIDs() {
        const dbKey = 0, dbLvl = 1, dbVer = 2;

        const blockIDs = this.dplDBs.inquiryDetail?.blockIDs || [];

        blockIDs = blockIDs.map(elem => {
            const components = elem.split('_');

            return [
                components[dbKey], 
                {
                    req: { 
                        level: components[dbLvl].slice(-1),
                        version: components[dbVer].slice(-1)
                    }
                }   
            ];
        });
        const ret = this.dplDBs?.inquiryDetail.blockIDs.reduce((obj, blockID) => {
            const arrBlockID = blockID.split('_');

            obj[arrBlockID[appConsts.blockIDs.key]] = {
                req: {
                    level: parseInt(arrBlockID[appConsts.blockIDs.level].slice(1 - arrBlockID[appConsts.blockIDs.level].length)),
                    version: parseInt(arrBlockID[appConsts.blockIDs.ver].slice(1 - arrBlockID[appConsts.blockIDs.ver].length))
                }
            };

            return obj;
        }, {});

        this.dplDBs?.blockStatus.forEach(aBlockStatus => {
            const arrBlockID = aBlockStatus.blockID.split('_');

            if( !ret[arrBlockID[appConsts.blockIDs.key]] ) { ret[arrBlockID[appConsts.blockIDs.key]] = {} }

            ret[arrBlockID[appConsts.blockIDs.key]].resp = {
                level: parseInt(arrBlockID[appConsts.blockIDs.level].slice(1 - arrBlockID[appConsts.blockIDs.level].length)),
                version: parseInt(arrBlockID[appConsts.blockIDs.ver].slice(1 - arrBlockID[appConsts.blockIDs.ver].length)),
                status: aBlockStatus.status,
                reason: aBlockStatus.reason
            };
        });

        return ret;
    }

    //Method transactionTimestamp will get the transaction timestamp in the format YYYYMMDD
    //All data block responses contain a transactionDetail object
    transactionTimestamp(length) {
        const tts = this.dplDBs.transactionDetail?.transactionTimestamp;

        if(tts) { return sDateIsoToYYYYMMDD(tts, length) }

        return '';
    }

    //Method tradeStylesToArray returns an array containing tradestyle names of a predefined
    //length (numTradeStyles). tradeStyleNames objects are simple, they contain one component,
    //name, and are sorted by priority. Tradestyles are available in data block Company Info 
    //L1+.
    //
    //Two parameters
    //1. numTradeStyles, specify the number of tradestyles to return
    //2. bLabel, specify true for the element labels to be returned
    tradeStylesToArray(numTradeStyles, bLabel) {
        const retArr = new Array(numTradeStyles);

        if(bLabel) {
            return retArr.fill().map((elem, idx) => new ElemLabel('trdg style', numTradeStyles > 1 ? idx + 1 : null).toString());
        }

        const arrTradeStyles = this.org.tradeStyleNames || [];

        arrTradeStyles.sort((ts1, ts2) => ts1.priority - ts2.priority);

        for(let idx = 0; idx < numTradeStyles && idx < arrTradeStyles.length; idx++) {
            retArr[idx] = arrTradeStyles[idx].name
        }

        return retArr;
    }
}
