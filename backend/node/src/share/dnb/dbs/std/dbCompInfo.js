// *********************************************************************
//
// D&B Direct+ Standard Data Blocks JavaScript object wrapper
// Code file for data block Company Information
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
import consts from '../consts.js';

//Generate a label array
const labelArr = (sLabel, numLabels) => new Array(numLabels === -1 ? 1 : numLabels).fill().map((elem, idx) => new ElemLabel(sLabel, numLabels > 1 ? idx + 1 : null).toString());

//Method summaryFromArray returns:
//   - a description of the specific editorial summary for the entity
//   - a string containing editorial comments for the entity
//The comments can contain HTML tags. Summary is available in data block Company Info L2+.
//
//The five function parameters
//1. arrSummary, the array of summary objects
//2. arrFlds, the array of field names to include in the returned array
//3. numSumms, specify the number of summaries to return (-1 for all)
//4. bLabel, specify true for the element labels to be returned
//5. sLabel, specify the labels string for the element label
function summariesToArray(
        arrSummary = [],
        arrFlds = [ consts.flds.summary.txt ],
        numSumms = 1,
        bLabel = false,
        sLabel = consts.labels.summary[consts.labelSize.medium]
    )
{
    //Return an array of labels if bLabel is true
    if(bLabel) { return sLabel }

    const summ_prios = consts.prios.summary;

    const retArr = arrSummary.map(elem => {
        const prio = summ_prios.findIndex(prio => prio === elem.textType.dnbCode);

        return {
            desc: elem.textType.description,
            txt: elem.text,
            prio: prio === -1 ? summ_prios.length : prio 
        }
    }).sort((elem1, elem2) => elem1.prio - elem2.prio);

    console.log(retArr);
    //Return the summary string if available, otherwise return an empty string
    //return arrSummary.reduce((acc, summ) => acc + (summ.text || ''), '');
}

//Method tradeStylesToArray returns an array containing tradestyle names of a predefined
//length (numTradeStyles). tradeStyleNames objects are simple, they contain one component,
//name, and are sorted by priority. Tradestyles are available in data block Company Info 
//L1+.
//
//The four function parameters
//1. arrTradeStyles, the array of tradestyle name objects
//2. numTradeStyles, specify the number of tradestyles to return (-1 for all)
//3. bLabel, specify true for the element labels to be returned
//4. sLabel, specify the label string for the element labels
function tradeStylesToArr(
        arrTradeStyles = [],
        numTradeStyles = 1,
        bLabel = false,
        sLabel = consts.labels.tradeStyle[consts.labelSize.medium]
    )
{
    //Return an array of labels if bLabel is true
    if(bLabel) { return labelArr( sLabel, numTradeStyles ) }

    //Make sure the array is sorted by priority
    const retArr = arrTradeStyles.toSorted((ts1, ts2) => ts1.priority - ts2.priority);

    //Return the array if it contains the exact number of tradestyles requested
    //or if numTradeStyles is -1 (i.e. return all available tradestyles)
    if(numTradeStyles === -1 || retArr.length === numTradeStyles) {
        return retArr.map(ts => ts.name);
    }

    //Slice the array if it contains more than or the exact number of tradestyles requested
    if(retArr.length > numTradeStyles) {
        return retArr.slice(0, numTradeStyles).map(ts => ts.name);
    }

    //At this point, retArr.length < numTradeStyles must be true
    //Pad the returned array with empty array elements
    return retArr.map(ts => ts.name).concat(new Array(numTradeStyles - retArr.length));
}

//Method emailsToArr returns an array containing email addresses of a predefined
//length (numEmails). Email objects are simple, they contain one component,
//address. Emails are available in data block Company Info L2+.
//
//The four function parameters
//1. arrEmails, the array of email objects
//2. numEmails, specify the number of emails to return (-1 for all)
//3. bLabel, specify true for the element labels to be returned
//4. sLabel, specify the label string for the element labels
function emailsToArr(
        arrEmails = [],
        numEmails = 1,
        bLabel = false,
        sLabel = consts.labels.email[consts.labelSize.medium]
    )
{
    //Return an array of labels if bLabel is true
    if(bLabel) { return labelArr( sLabel, numEmails ) }

    //Return the array if it contains the exact number of emails requested
    //or if numEmails is -1 (i.e. return all available emails)
    if(numEmails === -1 || arrEmails.length === numEmails) {
        return arrEmails.map(email => email.address);
    }

    //Slice the array if it contains more than or the exact number of emails requested
    if(arrEmails.length > numEmails) {
        return arrEmails.slice(0, numEmails).map(email => email.address);
    }

    //At this point, retArr.length < numEmails must be true
    //Pad the returned array with empty array elements
    return arrEmails.map(email => email.address).concat(new Array(numEmails - arrEmails.length));
}

//Method telsToArr returns an array containing telephone numbers of a predefined
//length (numTels). Telephone objects are simple, they contain two components,
//which will be concatenated. Telephone numbers are available in data block Company
//Info L1+.
//
//The four function parameters
//1. arrTels, the array of telephone objects
//2. numTels, specify the number of telephone numbers to return (-1 for all)
//3. bLabel, specify true for the element labels to be returned
//4. sLabel, specify the label string for the element labels
function telsToArr(
        arrTels = [],
        numTels = 1,
        bLabel = false,
        sLabel = consts.labels.tel[consts.labelSize.medium]
    )
{
    const concatTel = tel => `${tel.isdCode ? '+' + tel.isdCode + ' ' : ''}${tel.telephoneNumber}`;

    //Return an array of labels if bLabel is true
    if(bLabel) { return labelArr( sLabel, numTels ) }

    //Return the array if it contains the exact number of telephone numbers requested
    //or if numTels is -1 (i.e. return all available telephone numbers)
    if(numTels === -1 || arrTels.length === numTels) {
        return arrTels.map(concatTel);
    }
    
    //Slice the array if it contains more than or the exact number of telephone numbers requested
    if(arrTels.length > numTels) {
        return arrTels.slice(0, numTels).map(concatTel);
    }

    //At this point, retArr.length < numTels must be true
    //Pad the returned array with empty array elements
    return arrTels.map(concatTel).concat(new Array(numTels - arrTels.length));
}

export default {
    summariesToArray,
    tradeStylesToArr,
    emailsToArr,
    telsToArr
};
