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

import { sDateIsoToYYYYMMDD } from '../../../utils.js';
import { regNumTypeIsVAT } from '../../refData.js';
import consts from '../consts.js'; 
import ci from './dbCompInfo.js';

//Create a custom registration number
function createCustRegNum(elem) {
    const ret = {};

    //Check if the registration number is a known VAT
    if(elem.typeDnBCode && regNumTypeIsVAT.has(elem.typeDnBCode)) ret.isVAT = true;

    //Default priority is 4
    ret.prio = 4;

    //Set specific priorities
    if (elem.isPreferredRegistrationNumber === true) { ret.prio = 1 } //Assign prio 1 if preferred
    else if (ret.isVAT) { ret.prio = 2 } //Assign prio 2 to VATs (& not preferred)
    else if (elem.typeDnBCode === 33916) { ret.prio = 3 } //Assign prio 3 to LEIs

    ret.regNum = elem.registrationNumber;
    ret.desc = elem.typeDescription;
    ret.classDesc = elem.registrationNumberClass?.description;
    ret.regLocation = elem.registrationLocation;

    return ret;
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
//  new Map([
//    ['companyinfo', {
//      req: { level: 1, version: 1 },
//      resp: { level: 1, version: 1, status: 'ok', reason: null }
//    }],
//    ['principalscontacts', {
//      req: { level: 2, version: 2 },
//      resp: { level: 2, version: 2, status: 'ok', reason: null }
//    }],
//    ['baseinfo', {
//      resp: { level: 1, version: 1, status: 'ok', reason: null }
//    }]
//  ])

function compileReqRespInfo(inqBlockIDs = [], respBlockStatus = []) {
    const dbKey = 0, dbLvl = 1, dbVer = 2;

    //A blockID string has the following format: <blockID>_<level>_<version>, e.g. companyinfo_L1_v1
    function parseBlockID(sBlockID) {
        const components = sBlockID.split('_');

        return { key: components[dbKey], level: parseInt(components[dbLvl].slice(1)), version: parseInt(components[dbVer].slice(1)) };
    }

    //Create a Map object with the request information
    const mapBlockIDs = new Map((inqBlockIDs).map(elem => {
        const oBlockID = parseBlockID(elem);

        return [
            oBlockID.key, 
            {
                req: { 
                    level: oBlockID.level,
                    version: oBlockID.version
                }
            }   
        ];
    }));

    //Create a Map object with the response information
    const mapBlockStatus = new Map((respBlockStatus).map(elem => {
        const oBlockID = parseBlockID(elem.blockID);

        return [
            oBlockID.key,
            {
                resp: {
                    level: oBlockID.level,
                    version: oBlockID.version,
                    status: elem.status,
                    reason: elem.reason
                }
            }
        ];
    }));

    //Combine the request and response information into one Map object
    if(mapBlockIDs.size && mapBlockStatus.size) {
        mapBlockStatus.forEach((value, key) => { if(mapBlockIDs.has(key)) { value.req = mapBlockIDs.get(key).req } });

        //Double-check if all requested data blocks have a response
        const reqNotResp = [ ...mapBlockIDs.keys() ].filter(key => !mapBlockStatus.has(key));

        if(reqNotResp.length) {
            console.warn(`🤔 ➡️ Data blocks requested but no data block response received for: ${reqNotResp.join(', ')}`);

            reqNotResp.forEach(key => mapBlockStatus.set(key, mapBlockIDs.get(key)));
        }
    }

    //Return the Map object with the request and response information
    //If no responses were generated, return the Map object with the request information (probably both are empty)
    return mapBlockStatus.size ? mapBlockStatus : mapBlockIDs;
}

//D&B Direct+ Data Blocks JavaScript object wrapper
export default class DplDBs {
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
            this.map121.marketable = orgCtrlStatus.isMarketable;
        }

        //Miscellaneous one-to-one mappings
        this.map121.startDate = this.org.startDate;
        this.map121.SMB = this.org.organizationSizeCategory?.description;
        this.map121.defaultCurr = this.org.defaultCurrency;

        //One-to-one mappings of inquiry details
        if(this.dplDBs.inquiryDetail) {
            const inqDetail = this.dplDBs.inquiryDetail;

            this.map121.inqDuns = inqDetail.duns;
            this.map121.tradeUp = inqDetail.tradeUp;
            this.map121.custRef = inqDetail.customerReference;
        }

        //Expose the request and response information as a Map object
        this.reqRespInfo = compileReqRespInfo(this.dplDBs.inquiryDetail?.blockIDs, this.dplDBs.blockStatus);
    }

    //Property respStatusOk will return
    //true if all data blocks have a response with status 'ok',
    //false if any data block has a response with status not equal to 'ok', and
    //null if no data blocks were requested (probably processing a seed file)
    get respStatusOk() { return this.reqRespInfo.size ? this.reqRespInfo.values().every( val => val.resp?.status === 'ok' ) : null }

    //Convert a LEI to a Company Information registration number object
    get leiRegNum() {
        if(!this.org.legalEntityIdentifier) return null;

        return {
            registrationNumber: this.org.legalEntityIdentifier,
            typeDescription: 'Legal Entity Identifier',
            typeDnBCode: 33916,
            registrationNumberClass: {
                description: 'International Identifier',
                dnbCode: 41109
            },
            isPreferredRegistrationNumber: null,
            registrationLocation: null
        }
    }

    //Method transactionTimestamp will get the transaction timestamp in the format YYYYMMDD
    //All data block responses contain a transactionDetail object
    transactionTimestamp(length = 8) {
        const tts = this.dplDBs.transactionDetail?.transactionTimestamp;

        if(typeof tts === 'string' && tts.length) {
            return sDateIsoToYYYYMMDD(tts, length);
        }

        return '';
    }

    //Return an array containing tradestyle names of a predefined length (numTradeStyles)    
    tradeStylesToArr = (numTradeStyles, bLabel, sLabel) => ci.tradeStylesToArr( this.org.tradeStyleNames, numTradeStyles, bLabel, sLabel );

    //Return an array containing email addresses of a predefined length (numEmails)    
    emailsToArr = (numEmails, bLabel, sLabel) => ci.emailsToArr( this.org.email, numEmails, bLabel, sLabel );

    //Return an array containing telephone numbers of a predefined length (numTels)    
    telsToArr = (numTels, bLabel, sLabel) => ci.telsToArr( this.org.telephone, numTels, bLabel, sLabel );

    //Return an array containing editorial comments for the entity.
    summariesToArr = (arrFlds, numSumms, bLabel, sLabel) => ci.summariesToArr( this.org.summary, arrFlds, numSumms, bLabel, sLabel );

    //Return an array containing custom registration numbers of a predefined length (numTels)    
    regNumsToArr = (arrFlds, numRegNums, bLabel, sLabel) => {
        if(!this.org.regNums) {
            if(!this.org.registrationNumbers || this.org.registrationNumbers.length === 0) {
                this.org.regNums = [];
            }
            else {
                //Create an array of custom registration numbers from the data block data
                this.org.regNums = this.org.registrationNumbers.map(createCustRegNum);

                //Add, if available, the LEI
                const leiRegNum = this.leiRegNum;

                if(leiRegNum) this.org.regNums.push( createCustRegNum(leiRegNum) );

                //Sort based on assigned priority
                this.org.regNums.sort((elem1, elem2) => elem1.prio - elem2.prio);
            }
        }

        return this.org.regNums;
    }
}
