// *********************************************************************
//
// D&B Direct+ Data Blocks constants
// Code file: consts.js
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

//Application constants
const consts = {
    labelSize: { small: 0, medium: 1, large: 2 },
    labels: {
        map121: { //label values 
            //inquiry detail
            inqDuns: ['inq DUNS', 'inquiry DUNS', 'inquiry DUNS number'],
            tradeUp: ['trade up', 'trade up', 'trade up'],
            custRef: ['cust ref', 'customer reference', 'customer reference'],

            //Common data-elements
            duns:        ['DUNS', 'DUNS', 'DUNS number'],
            primaryName: ['bus nme', 'business name', 'business name'],
            countryISO:  ['ctry ISO', 'country ISO code', 'country ISO alpha-2 code'],

            //Company information data-elements
            opStatus:     ['op status', 'operating status', 'operating status'],
            opStatusDate: ['op status date', 'operating status date', 'operating status date'],
            startDate:    ['start date', 'start date', 'start date'],
            SMB:          ['ent size', 'entity size', 'entity size'],
            defaultCurr:  ['dflt curr', 'default currency', 'default currency'],
            marketable:   ['marketable', 'marketable', 'is marketable']
        },
        respStatusOk: ['Resp status', 'Response status', 'Response status'],
        transactionTimestamp: ['ts', 'transaction ts', 'transaction timestamp'],
        tradeStyle: ['trdg style', 'tradestyle', 'tradestyle']
    }
};

export default consts;