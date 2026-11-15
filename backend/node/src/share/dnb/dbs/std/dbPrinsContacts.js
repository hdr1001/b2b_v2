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
import dnbUtils from '../../utils.js';

//Create a custom principal object from the D&B principal object
function createCustPrin(objPrin) {
    if(!objPrin) return null;

    const oRet = {};

    oRet.type = objPrin.subjectType;
    oRet.name = objPrin.fullName;
    oRet.birthdate = objPrin.birthDate;
    oRet.first_name = objPrin.givenName;
    oRet.middle_name = objPrin.middleName;
    oRet.last_name = objPrin.familyName;
    oRet.pre_name = objPrin.namePrefix;
    oRet.suff_name = objPrin.nameSuffix;
    oRet.assn_start_date = objPrin.associationStartDate;
    oRet.sign_auth = objPrin.isSigningAuthority;
    oRet.natl = objPrin.nationality?.isoAlpha2Code;
    oRet.gender = objPrin.gender?.description;
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
