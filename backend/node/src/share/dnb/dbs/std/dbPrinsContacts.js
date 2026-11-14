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

import dnbUtils from '../../utils.js';

function prinsToArr(arrPrins, arrFlds, numPrins, bLabel, labelSize) {
    const retArr = arrPrins
        .map(elem => {
            return {
                type: elem.subjectType,
                most_senior: elem.mostSenior ? true : false,
                name: elem.fullName,
                birthdate: elem.birthDate,
                first_name: elem.givenName,
                middle_name: elem.middleName,
                last_name: elem.familyName,
                pre_name: elem.namePrefix,
                suff_name: elem.nameSuffix,
                assn_start_date: elem.associationStartDate,
                sign_auth: elem.isSigningAuthority
            }
        })

    return dnbUtils.rightSizeArr(retArr, numPrins === -1 ? -1 : arrFlds.length * numPrins);
}

export default {
    prinsToArr
};
