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
            dfltCurr:     ['dflt curr', 'default currency', 'default currency'],
            lei:          ['LEI', 'LEI', 'legal entity identifier'],
            marketable:   ['marketable', 'marketable', 'is marketable']
        },
        summary: new Map([
            [ 0, ['summ', 'summary', 'summary'] ],
            [ 32456, ['profile', 'short profile', 'short profile'] ],
            [ 32463, ['fin perf', 'fin performance summ', 'financial performance summary'] ],
            [ 32469, ['strategic', 'strategic summ', 'strategic summary'] ],
            [ 32461, ['op', 'operational summ', 'operational summary'] ],
            [ 33960, ['hist', 'history', 'history'] ],
            [ 32468, ['sales mktg', 'sales & marketing summ', 'sales and marketing summary'] ],
            [ 32464, ['geo reach', 'geographical reach', 'geographical reach'] ]
        ]),
        respStatusOk: ['resp ok', 'response ok', 'response status okay'],
        transactionTimestamp: ['ts', 'transaction ts', 'transaction timestamp'],
        tradeStyle: ['trdg style', 'tradestyle', 'tradestyle'],
        email: ['email', 'email addr', 'email address'],
        tel: ['tel', 'telephone', 'telephone number'],
        desc: [ 'desc', 'description', 'description'],
        txt: [ 'txt', 'text', 'text' ],
        registrationNum: ['reg num', 'registration num', 'registration number'],
        isVAT: [ 'is VAT', 'is VAT', 'is value added tax num'],
        prio: [ 'prio', 'priority', 'priority'],
        isPref: [ 'is pref', 'is preferred', 'is preferred'],
        type: [ 'type', 'type', 'type'],
        class: [ 'class', 'class', 'class'],
        regLoc: [ 'reg loc', 'registration loc', 'registration location'],
        summ: [ 'summ', 'summary', 'summary' ]
    },
    prios: {
        summary: [ 32456, 32463, 32469, 32461, 33960, 32468, 32464 ] //Short profile, fin perf, strategy summary, ops summary, history, sales & marketing, geo reach 
    },
    flds: {
        summary: [ 'desc', 'txt' ],
        registrationNum: [ 'regNum', 'desc', 'type', 'classDesc', 'class', 'isVAT', 'prio', 'regLocation' ]
    }
};

export default consts;
