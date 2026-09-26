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
import { objToArr } from '../../../utils.js';
import { regNumTypeIsVAT } from '../../refData.js';
import consts from '../consts.js';

//Field to label
const fldToLabel = (fld, labelSize) => consts.labels[fld][labelSize];

//Generate a label array
const labelArr = (sLabel, numRepeat = 1) => new Array(numRepeat === -1 ? 1 : numRepeat).fill().map((elem, idx) => new ElemLabel(sLabel, numRepeat > 1 ? idx + 1 : null).toString());

//Generate an array of labels for multiple labels passed in as an array
const multLabelArr = (arrLabels, numRepeat) => {
    if(!(Array.isArray(arrLabels) && arrLabels.length)) throw new Error('Parameter arrLabels must be an array and contain at least one element');

    let retArr = new Array(arrLabels.length)
        .fill()
        .map((elem, idx) => labelArr( arrLabels[idx], numRepeat ));

    //Transpose the array of arrays
    retArr = retArr[0].map((_, colIdx) => retArr.map( row => row[colIdx] ));

    //Flatten before returning
    return retArr.flat();
}

//Return a LEI registration number object
function objLeiRegNum(sLei) {
    if(!sLei) return null;

    return {
        registrationNumber: sLei,
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

//Create a custom registration number object
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

    //The actual ID
    ret.regNum = elem.registrationNumber;

    //The registration number type description & code
    ret.desc = elem.typeDescription;
    ret.type = elem.typeDnBCode;

    //The registration number class description & code
    ret.classDesc = elem.registrationNumberClass?.description;
    ret.class = elem.registrationNumberClass?.dnbCode;

    //The location of the registrar
    ret.regLocation = elem.registrationLocation;

    return ret;
}

//Initialize the custom registration number array
function iniRegNumArr(orgRegNums, leiRegNum) {
    let ret = [];

    //Add, if available, the LEI to the array of custom objects
    if(leiRegNum) ret.push( createCustRegNum(leiRegNum) );

    //Done if no registration numbers available
    if(!orgRegNums || orgRegNums.length === 0) return ret;

    //Create an array of custom registration numbers from the data block data
    ret = ret.concat( orgRegNums.map(createCustRegNum) );

    //Sort based on assigned priority
    return ret.sort((elem1, elem2) => elem1.prio - elem2.prio);
}

//Function tradeStylesToArray returns an array containing tradestyle names of a predefined
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

//Function emailsToArr returns an array containing email addresses of a predefined
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

//Function telsToArr returns an array containing telephone numbers of a predefined
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

//Function summaryFromArray returns:
//   - a description of the specific editorial summary for the entity
//   - a string containing editorial comments for the entity
//   - an assigned priority based on an input parameter
//The comments can contain HTML tags. Summary is available in data block Company Info L2+.
//
//The five function parameters
//1. arrSummary, the array of summary objects
//2. arrFlds, the array of field names to include in the returned array
//3. numSumms, specify the number of summaries to return (-1 for all)
//4. bLabel, specify true for the element labels to be returned
//5. labelSize, specify the length of the label string
function summariesToArr(
        arrSummary = [],
        arrFlds = consts.flds.summary,
        arrSummPrio = consts.prios.summary,
        numSumms = 1,
        bLabel = false,
        labelSize = consts.labelSize.medium
    )
{
    if(bLabel) {
        const lblSumm = consts.labels.summ[labelSize];

        const arrLabels = arrFlds.map( fld => lblSumm + ' ' + fldToLabel( fld, labelSize ));

        return multLabelArr( arrLabels, numSumms );
    }

    //Calculate the target length of the return array
    const targetLen = arrFlds.length * numSumms;
 
    //Simplify the structure of the summary objects and add a priority attribute
    const retArr = arrSummary.map(elem => {
        const prio = arrSummPrio.findIndex(prio => prio === elem.textType.dnbCode);

        return {
            desc: elem.textType.description,
            txt: elem.text,
            prio: prio === -1 ? arrSummPrio.length : prio 
        }
    })
    //Sort the summary objects based on priority
    .sort((elem1, elem2) => elem1.prio - elem2.prio)
    //Flatten the array with only requested values
    .reduce((acc, summ) => acc.concat(objToArr(summ, arrFlds)), []);

    //Return the array if it contains the exact number of summaries requested
    //or if numSumms is -1 (i.e. return all available summaries)
    if(numSumms === -1 || retArr.length === targetLen) return retArr;

    //Slice the array if it contains more than the arrFlds.length * numSumms
    //elements requested
    if(retArr.length > targetLen) return retArr.slice(0, targetLen);

    //At this point, retArr.length < arrFlds.length * numSumms must be true
    //Pad the returned array with empty array elements
    return retArr.concat(new Array(targetLen - retArr.length));
}

function regNumsToArr(
        arrRegNums = [],
        arrFlds = consts.flds.registrationNum,
        numRegNums = 1,
        bLabel = false,
        labelSize = consts.labels.registrationNum[consts.labelSize.medium]
    )
{
    //Calculate the target length of the return array
    const targetLen = arrFlds.length * numRegNums;

    //Flatten the array with the requested values
    const retArr = arrRegNums.reduce((acc, regNum) => acc.concat(objToArr(regNum, arrFlds)), []);

    //Return the array if it contains the exact number of registration numbers requested
    //or if numRegNums is -1 (i.e. return all available IDs)
    if(numRegNums === -1 || retArr.length === targetLen) return retArr;

    //Slice the array if it contains more than the arrFlds.length * numRegNums
    //elements requested
    if(retArr.length > targetLen) return retArr.slice(0, targetLen);

    //At this point, retArr.length < arrFlds.length * numRegNums must be true
    //Pad the returned array with empty array elements
    return retArr.concat(new Array(targetLen - retArr.length));
}

export default {
    objLeiRegNum,
    iniRegNumArr,
    tradeStylesToArr,
    emailsToArr,
    telsToArr,
    summariesToArr,
    regNumsToArr
};
