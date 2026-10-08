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
import { regNumClassIsVAT } from '../../refData.js';
import consts from '../consts.js';

//Field to label
const fldToLabel = (fld, labelSize, prefix) => {
    let lbl;

    //If a field is a compound field (i.e. contains an underscore), split it into its
    //components and generate a label for each component, then join the labels with a space
    if(fld.includes('_')) {
        lbl = fld.split('_').map( fldPart => consts.labels[fldPart][labelSize] ).join(' ');
    }
    else {
        lbl = consts.labels[fld][labelSize];
    }

    //Do not include the prefix if it is already part of the label
    if(lbl.startsWith(prefix)) prefix = '';

    return prefix ? `${prefix} ${lbl}` : lbl;
}

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

//Right size an array to a specific length
const rightSizeArr = (arr, targetLen) => {
    if(!Array.isArray(arr)) throw new Error('Parameter arr must be an array');

    if(!Number.isInteger(targetLen) || targetLen < -1) {
        throw new Error('Parameter targetLen must be a non-negative integer, 0 or -1')
    }

    //Return the array if it contains the exact number of elements requested
    //or if targetLen is -1 (i.e. return all available elements)
    if(targetLen === -1 || arr.length === targetLen) return arr;

    //Slice the array if it contains more than or the exact number of tradestyles requested
    if(arr.length > targetLen) return arr.slice(0, targetLen);

    //At this point, arr.length < targetLen must be true
    //Pad the returned array with empty array elements
    return arr.concat(new Array(targetLen - arr.length).fill(null));
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

    //Check if the registration number is a Value Added Tax ID
    ret.isVAT = elem.registrationNumberClass?.dnbCode && regNumClassIsVAT.has(elem.registrationNumberClass.dnbCode);

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
    ret.class_desc = elem.registrationNumberClass?.description;
    ret.class = elem.registrationNumberClass?.dnbCode;

    //The location of the registrar
    ret.regLoc = elem.registrationLocation;

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
    const arrTSs = arrTradeStyles
        .toSorted((ts1, ts2) => ts1.priority - ts2.priority)
        .map(ts => ts.name)

    return rightSizeArr(arrTSs, numTradeStyles);
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

    return rightSizeArr(arrEmails.map(email => email.address), numEmails);
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

    return rightSizeArr(arrTels.map(concatTel), numTels);
}

//Function actsToArr returns:
//   - a description of the entity's activities
//   - a language description
//   - a language code
//The activities array is available in data block Company Info L1+.
//
//The five function parameters
//1. arrActs, the array of activity objects
//2. arrFlds, the array of field names to include in the returned array
//3. numActs, specify the number of activities to return (-1 for all)
//4. bLabel, specify true for the element labels to be returned
//5. labelSize, specify the length of the label string
function actsToArr(
        arrActs = [],
        arrFlds = consts.flds.act,
        numActs = 1,
        bLabel = false,
        labelSize = consts.labelSize.medium
    )
{
    if(bLabel) {
        const lblAct = consts.labels.act[labelSize];

        return multLabelArr( arrFlds.map( fld => fldToLabel( fld, labelSize, lblAct )), numActs );
    }

    const retArr = arrActs
        .map(elem => {
            return {
                desc: elem.description,
                lang_desc: elem.language?.description,
                lang_code: elem.language?.dnbCode
            }
        })
        .reduce((acc, act) => acc.concat(objToArr(act, arrFlds)), []);

    return rightSizeArr(retArr, numActs === -1 ? -1 : arrFlds.length * numActs);
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

        return multLabelArr( arrFlds.map( fld => fldToLabel( fld, labelSize, lblSumm )), numSumms );
    }

    //Simplify the structure of the summary objects and add a priority attribute
    const retArr = arrSummary
        .map(elem => {
            const prio = arrSummPrio.findIndex(prio => prio === elem.textType.dnbCode);

            return {
                desc: elem.textType.description,
                txt: elem.text,
                prio: prio === -1 ? arrSummPrio.length + 1 : prio 
            }
        })
        //Sort the summary objects based on priority
        .sort((elem1, elem2) => elem1.prio - elem2.prio)
        //Flatten the array with only requested values
        .reduce((acc, summ) => acc.concat(objToArr(summ, arrFlds)), []);

    return rightSizeArr(retArr, numSumms === -1 ? -1 : arrFlds.length * numSumms);
}

//Function regNumsToArr returns:
//   - a registration number (aka national ID)
//   - a registration number type & type description
//   - a registration number class & class description
//   - an indicator highlighting whether the ID is a VAT
//   - a priority indicator
//   - a location description of the registrar
//Registration numbers are available in data block Company Info L1+.
//
//The five function parameters
//1. arrRegNums, a custom array of registration number objects
//2. arrFlds, the array of field names to include in the returned array
//3. numRegNums, specify the number of registration numbers to return (-1 for all)
//4. bLabel, specify true for the element labels to be returned
//5. labelSize, specify the length of the label string
function regNumsToArr(
        arrRegNums = [],
        arrFlds = consts.flds.regNum,
        numRegNums = 1,
        bLabel = false,
        labelSize = consts.labelSize.medium
    )
{
    if(bLabel) {
        const lblRegNum = consts.labels.regNum[labelSize];

        return multLabelArr( arrFlds.map( fld => fldToLabel( fld, labelSize, lblRegNum )), numRegNums );
    }

    //Flatten the array with the requested values
    const retArr = arrRegNums.reduce((acc, regNum) => acc.concat(objToArr(regNum, arrFlds)), []);

    return rightSizeArr(retArr, numRegNums === -1 ? -1 : arrFlds.length * numRegNums);
}

//Function stockExchsToArr returns an array, of predefined length, containing the
//stockexchanges on which the entity is listed
//
//The function returns:
//   - a ticker name
//   - a stockexchange name
//   - a stockexchange country
//   - an assigned priority
//
//The five function parameters
//1. arrStockExchs, the array of ticker symbol objects
//2. arrFlds, the array of field names to include in the returned array
//3. numStockExchs, specify the number of summaries to return (-1 for all)
//4. bLabel, specify true for the element labels to be returned
//5. labelSize, specify the length of the label string
function stockExchsToArr(
        arrStockExchs = [],
        arrFlds = consts.flds.stockExch,
        numStockExchs = 1,
        bLabel = false,
        labelSize = consts.labelSize.medium
    )
{
    //Return an array of labels if bLabel is true
    if(bLabel) {
        const lblExch = consts.labels.stockExch[labelSize];

        return multLabelArr( arrFlds.map( fld => fldToLabel( fld, labelSize, lblExch ) ), numStockExchs );
    }

    //Simplify the structure of the stock exchange objects and add a priority attribute
    const retArr = arrStockExchs
        .map(elem => {
            return {
                ticker: elem.tickerName,
                name: elem.exchangeName?.description,
                country: elem.exchangeCountry?.isoAlpha2Code,
                prio: elem.isPrimary ? 1 : 2 
            }
        })
        //Sort the summary objects based on priority
        .sort((elem1, elem2) => elem1.prio - elem2.prio)
        //Flatten the array with only requested values
        .reduce((acc, exch) => acc.concat(objToArr(exch, arrFlds)), []);

    return rightSizeArr(retArr, numStockExchs === -1 ? -1 : arrFlds.length * numStockExchs);
}

//Function utf8NamesToArr returns an array, of predefined length, containing 
//the so-called multi-Lingual names of an entity
//
//The function returns:
//   - a utf8 name 
//   - a language description
//   - a language code
//   - a writing script description
//   - a writing script code
//   - a priority indicator
//
//The five function parameters
//1. arrUtf8Names, the array of utf8 name objects
//2. arrFlds, the array of field names to include in the returned array
//3. numUtf8Names, specify the number of names to return (-1 for all)
//4. bLabel, specify true for the element labels to be returned
//5. labelSize, specify the length of the label string
function utf8NamesToArr(
        arrUtf8Names = [],
        nameType = consts.labels.prim,
        arrFlds = consts.flds.utf8Name,
        numUtf8Names = 1,
        bLabel = false,
        labelSize = consts.labelSize.medium
    )
{
    if(bLabel) {
        const lblUtf8Name = `${nameType[labelSize]} utf8 ${consts.labels.name[labelSize]}`;

        return multLabelArr( arrFlds.map( fld => fldToLabel( fld, labelSize, lblUtf8Name ) ), numUtf8Names );
    }

    //Simplify the structure of the utf8 name objects
    const retArr = arrUtf8Names
        .map(elem => {
            return {
                name: elem.name,
                lang_desc: elem.language?.description,
                lang_code: elem.language?.dnbCode,
                script_desc: elem.writingScript?.description,
                script_code: elem.writingScript?.dnbCode,
                prio: elem.priority || arrUtf8Names.length + 1
            }
        })
        //Sort the summary objects based on priority
        .sort((elem1, elem2) => elem1.prio - elem2.prio)
        //Flatten the array with only requested values
        .reduce((acc, summ) => acc.concat(objToArr(summ, arrFlds)), []);

    return rightSizeArr(retArr, numUtf8Names === -1 ? -1 : arrFlds.length * numUtf8Names);
}

//Function indsCodesToArr returns an array, of predefined length, containing 
//the industry codes (NACE, SIC, etc.) of a company
//
//The function returns:
//   - an industry code
//   - an industry description
//   - an industry class code
//   - an industry class description
//   - an industry class priority
//   - an industry code priority
//
//The six function parameters
//1. arrIndsCodes, the array of industry code objects
//2. arrFlds, the array of field names to include in the returned array
//3. arrIndsCodeClassPrio, the array of industry class priorities
//4. numIndsCodes, specify the number of industry codes to return (-1 for all)
//5. bLabel, specify true for the element labels to be returned
//6. labelSize, specify the length of the label string
function indsCodesToArr(
        arrIndsCodes = [],
        arrFlds = consts.flds.indsCode,
        arrIndsCodeClassPrio = consts.prios.indsCodeClass,
        numIndsCodes = 1,
        bLabel = false,
        labelSize = consts.labelSize.medium
    )
{
    if(bLabel) {
        const lblIndsCode = consts.labels.inds[labelSize] + ' ' + consts.labels.code[labelSize];

        return multLabelArr( arrFlds.map( fld => fldToLabel( fld, labelSize, lblIndsCode )), numIndsCodes );
    }

    const retArr = arrIndsCodes
        .map(elem => {
            const classPrio = arrIndsCodeClassPrio.findIndex(prio => prio === elem.typeDnBCode);

            return {
                code: elem.code,
                desc: elem.description,
                class_code: elem.typeDnBCode,
                class_desc: elem.typeDescription,
                class_prio: classPrio === -1 ? arrIndsCodeClassPrio.length + 1 : classPrio,
                prio: elem.priority
            }
        })
        .sort((elem1, elem2) => elem1.class_prio - elem2.class_prio || elem1.prio - elem2.prio)
        .reduce((acc, inds) => acc.concat(objToArr(inds, arrFlds)), []);

    return rightSizeArr(retArr, numIndsCodes === -1 ? -1 : arrFlds.length * numIndsCodes);
}

function finsToYrlyRevArr(
        arrFins = [],
        arrFlds = consts.flds.yrlyRev,
        arrReliability = consts.prios.reliability,
        numYrlyRevs = 1,
        bLabel = false,
        labelSize = consts.labelSize.medium
    )
{
    if(bLabel) {
        const lblYrlyRev = consts.labels.yrlyRev[labelSize];

        return multLabelArr( arrFlds.map( fld => fldToLabel( fld, labelSize, lblYrlyRev )), numYrlyRevs );
    }

    //Calculate the target length of the return array
    const targetLen = arrFlds.length * numYrlyRevs;

    //Simplify the structure of the yearly revenue objects
    const retArr = arrFins.map(elem => {
        return {
            rev: elem.revenue,
            yr: elem.year,
            rel: elem.reliability || arrYrlyRevs.length
        }
    })
    //Sort the revenue objects based on reliability
    .sort((elem1, elem2) => elem1.rel - elem2.rel)
    //Flatten the array with only requested values
    .reduce((acc, rev) => acc.concat(objToArr(rev, arrFlds)), []);

    //Return the array if it contains the exact number of revenue figures requested
    //or if numYrlyRevs is -1 (i.e. return all available figures)
    if(numYrlyRevs === -1 || retArr.length === targetLen) return retArr;

    //Slice the array if it contains more than the arrFlds.length * numYrlyRevs
    //elements requested
    if(retArr.length > targetLen) return retArr.slice(0, targetLen);
    
    //At this point, retArr.length < targetLen  must be true
    //Pad the returned array with empty array elements
    return retArr.concat(new Array(targetLen - retArr.length));
}

export default {
    objLeiRegNum,
    iniRegNumArr,
    tradeStylesToArr,
    emailsToArr,
    telsToArr,
    actsToArr,
    summariesToArr,
    regNumsToArr,
    stockExchsToArr,
    utf8NamesToArr,
    indsCodesToArr,
    finsToYrlyRevArr
};
