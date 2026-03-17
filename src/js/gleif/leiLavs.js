/* ********************************************************************
//
// Business-to-business (B2B) application v2
// LEI ➡️ label / array values data structure
//
// Copyright 2026 Hans de Rooij 
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ***************************************************************** */

import { entRegAuthorities as entRegAuths } from '../../assets/codes/entityRegAuths.js';
import { entLegalForms } from '../../assets/codes/entityLegalForms.js';
import LabelArrValues from '../ui/lvsLabelArrValues.js';
import RptSection from '../ui/rptSection.js';

export function getLeiSections(b2bRec) {
    function getArrAddrLavs(b2bRec) {
        const retArr = [];

        const legalAddr = b2bRec.entity.legalAddr;
        const hqAddr = b2bRec.entity.hqAddr;

        retArr.push( new LabelArrValues( 'Legal address', legalAddr.toArr() ));

        if(!legalAddr.sameValueAs(hqAddr)) {
            retArr.push( new LabelArrValues( 'HQ address', hqAddr.toArr() ));
        }

        return retArr;
    }

    return [
        new RptSection( 'LEI record', 
            [
                new LabelArrValues( 'LEI', b2bRec.attribs?.lei ),
                new LabelArrValues( 'Name', b2bRec.entity.legalName.name ),
                new LabelArrValues( 'Other name(s)', b2bRec.entity.otherNames.map(elem => elem.name) ),
                new LabelArrValues( 'Transliterated name(s)', b2bRec.entity.transliteratedOtherNames.map(elem => elem.name) )
            ]
        ),
        new RptSection( 'Address(es)', getArrAddrLavs(b2bRec) ),
        new RptSection( 'Registration', 
            [
                new LabelArrValues( 'Identifier', b2bRec.entity?.registeredAs ),
                new LabelArrValues( 'Authority', entRegAuths.get(b2bRec.entity?.registeredAt?.id)?.desc || b2bRec.entity?.registeredAt?.id ),
                new LabelArrValues( 'Jurisdiction', b2bRec.entity?.jurisdiction ),
                new LabelArrValues( 'Legal form', entLegalForms.get(b2bRec.entity?.legalForm?.id)?.desc || b2bRec.entity?.legalForm?.id ),
                new LabelArrValues( 'Status', b2bRec.entity?.status )
            ]
        )
    ];
}
