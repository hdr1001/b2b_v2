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
    map121: { //label values 
        //inquiry detail
        inqDuns: {sml: 'inq DUNS', med: 'inquiry DUNS', lrg: 'inquiry DUNS number'},
        tradeUp: {sml: 'trade up', med: 'trade up', lrg: 'trade up'},
        custRef: {sml: 'cust ref', med: 'customer reference', lrg: 'customer reference'},

        //Common data-elements
        duns:        {sml: 'DUNS', med: 'DUNS', lrg: 'DUNS number'},
        primaryName: {sml: 'bus nme', med: 'business name', lrg: 'business name'},
        countryISO:  {sml: 'ctry ISO', med: 'country ISO code', lrg: 'country ISO alpha-2 code'},

        //Company information data-elements
        opStatus:     {sml: 'op status', med: 'operating status', lrg: 'operating status'},
        opStatusDate: {sml: 'op status date', med: 'operating status date', lrg: 'operating status date'},
        startDate:    {sml: 'start date', med: 'start date', lrg: 'start date'},
        SMB:          {sml: 'ent size', med: 'entity size', lrg: 'entity size'},
        defaultCurr:  {sml: 'dflt curr', med: 'default currency', lrg: 'default currency'},
        marketable:   {sml: 'marketable', med: 'marketable', lrg: 'is marketable'}
    },
    respStatusOk: {sml: 'ok', med: 'ok', lrg: 'okay'},
    tradeStyles: {sml: 'trdg style', med: 'tradestyle', lrg: 'tradestyle'}
};

export default consts;