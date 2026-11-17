// *********************************************************************
//
// D&B Direct+ Standard Data Blocks JavaScript object wrapper
// Code file for data block Principals & Contacts
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

import { objToArr } from '../../../utils.js';
import { isObject, isObjectEmpty } from '../../../../share/utils.js';
import dnbUtils from '../../utils.js';

//Create a custom principal object from the D&B principal object
function createCustPrin(objPrin) {
    if(!objPrin) return null;

    const oRet = {};

    //Level 1 and 2 fields
    //Names
    oRet.name = objPrin.fullName;
    oRet.first_name = objPrin.givenName;
    oRet.middle_name = objPrin.middleName;
    oRet.last_name = objPrin.familyName;
    oRet.pre_name = objPrin.namePrefix;
    oRet.suff_name = objPrin.nameSuffix;

    //Other names
    const utf8Names = objPrin.otherLanguageNames;

    if(Array.isArray(utf8Names) && utf8Names.length > 0) {
        oRet.utf8_name = utf8Names[0].fullName;
        oRet.utf8_first_name = utf8Names[0].givenName;
        oRet.utf8_last_name = utf8Names[0].familyName;

        if(utf8Names[0].language?.description) oRet.utf8_name_lang = utf8Names[0].language.description;
        if(utf8Names[0].writingScript?.description) oRet.utf8_name_script = utf8Names[0].writingScript.description;
    }

    //Make educated guess about subjectType and get the DUNS
    if(Array.isArray(objPrin.idNumbers) && objPrin.idNumbers.length) {
        oRet.type = 'Businesses';

        const arrDUNS = objPrin.idNumbers.filter(id => id.idType?.dnbCode === 3575);

        if(arrDUNS.length > 0) oRet.duns = arrDUNS[0].idNumber;
    }

    //Summarize the principal titles
    const jobTitles = objPrin.jobTitles;

    if(Array.isArray(jobTitles) && jobTitles.length > 0) {
        oRet.titles = jobTitles.map(jobTitle => jobTitle.title).join(', ')
    }

    //Summarize the management responsibilities of a principal
    const mgmtResp = objPrin.managementResponsibilities;

    if(Array.isArray(mgmtResp) && mgmtResp.length > 0) {
        oRet.mgmt_resp = mgmtResp.map(resp => resp.description).join(', ')
    }

    //Miscellaneous
    oRet.assn_start_date = objPrin.associationStartDate;
    oRet.gender = objPrin.gender?.description;

    //Level 3 fields
    //First override the subject type guessed above
    if(objPrin.subjectType) oRet.type = objPrin.subjectType;

    oRet.birthdate = objPrin.birthDate;
    oRet.natl = objPrin.nationality?.isoAlpha2Code;
    oRet.sign_auth = objPrin.isSigningAuthority;
    oRet.bkr_hist = objPrin.hasBankruptcyHistory;
    oRet.dsq = objPrin.isDisqualifiedDirector;

    //Responsible areas is implemented a bit wonky
    if(Array.isArray(objPrin.responsibleAreasEntry)) {
        if(objPrin.responsibleAreasEntry.length > 0) {
            oRet.resp_area = objPrin.responsibleAreasEntry[0].description;
        }
    }

    if(!oRet.resp_area && objPrin.responsibleAreas) {
        if(Array.isArray(objPrin.responsibleAreas)) {
            if(objPrin.responsibleAreas.length > 0) {
                oRet.resp_area = objPrin.responsibleAreas[0].description;
            }
        }
        else if(Object.isObject(objPrin.responsibleAreas)) {
            oRet.resp_area = objPrin.responsibleAreas?.description;
        }
    }

    return oRet;
}

//Initialize the custom principals array
function iniPrinArr(mostSenior, arrCurrPrin) {
    if(!mostSenior) return [];

    let arrPrin = [ createCustPrin(mostSenior) ];

    arrPrin[0].most_senior = true;

    if(!arrCurrPrin || arrCurrPrin.length === 0) return arrPrin;

    return arrPrin.concat(arrCurrPrin.map( createCustPrin ));
}

function prinsToArr(arrPrins, arrFlds, numPrins, bLabel, labelSize) {
    const retArr = arrPrins.reduce((acc, princ) => acc.concat(objToArr( princ, arrFlds )), []);

    return dnbUtils.rightSizeArr(retArr, numPrins === -1 ? -1 : arrFlds.length * numPrins);
}

export default {
    iniPrinArr,
    prinsToArr
};
