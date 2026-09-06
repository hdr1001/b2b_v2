// *********************************************************************
//
// D&B Direct+ Standard Data Blocks JavaScript object wrapper
// Code file for data block company information
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

//Method tradeStylesToArray returns an array containing tradestyle names of a predefined
//length (numTradeStyles). tradeStyleNames objects are simple, they contain one component,
//name, and are sorted by priority. Tradestyles are available in data block Company Info 
//L1+.
//
//Two parameters
//1. numTradeStyles, specify the number of tradestyles to return
//2. bLabel, specify true for the element labels to be returned
function tradeStylesToArr(arrTradeStyles = [], numTradeStyles, bLabel) {
    const retArr = new Array(numTradeStyles);

    if(bLabel) {
        return retArr.fill().map((elem, idx) => new ElemLabel('trdg style', numTradeStyles > 1 ? idx + 1 : null).toString());
    }

    arrTradeStyles.sort((ts1, ts2) => ts1.priority - ts2.priority);

    for(let idx = 0; idx < numTradeStyles && idx < arrTradeStyles.length; idx++) {
        retArr[idx] = arrTradeStyles[idx].name
    }

    return retArr;
}

export default { 
    tradeStylesToArr
};
