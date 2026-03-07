/* ********************************************************************
//
// Business-to-business (B2B) application v2
// LEI record prototype & constructor function
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

import globals from '../globals.js';
import { sDateIsoToYYYYMMDD } from '../utils.js';
import { entLegalForms } from '../../assets/codes/entityLegalForms.js';
import { entRegAuthorities as entRegAuths } from '../../assets/codes/entityRegAuths.js';
import LabelValue from '../ui/labelValue.js';

//Convert an address object to an array, filtering out null values
function addrToArr() {
    let arrLeiAddr;

    if(Array.isArray(this.addressLines) && this.addressLines.length) {
        arrLeiAddr = Array.from(this.addressLines)
    }
    else {
        arrLeiAddr = [];
    }

    arrLeiAddr.push(this.postalCode);

    arrLeiAddr.push(this.city);

    arrLeiAddr.push(this.region);

    arrLeiAddr.push(this.country);

    return arrLeiAddr.filter(elem => elem != null);
}

//Convert an address object to a concatenated string
function addrToStr() {
    return this.toArr().join(globals.joinSep);
}

function addrSameValueAs(otherAddr) {
    return Array.isArray(this.addressLines) && Array.isArray(otherAddr.addressLines) &&
        this.addressLines.length && otherAddr.addressLines.length &&
        this.addressLines[0] === otherAddr.addressLines[0]
}

//Constructor function for level 1 LEI data
function LeiRec(objLEI) {
    //Data shortcuts
    ({ meta: this.meta, data: this.data } = objLEI);

    if(this.data) ({ attributes: this.attribs, relationships: this.relationships } = this.data);

    if(this.attribs) ({ entity: this.entity } = this.attribs);

    //(Sub-)object functionality
    if(this.entity?.otherNames) {
        //Array otherNames exists (can be empty though 🙂)
        const otherNames = this.entity.otherNames;

        //otherNames array exists, add toString method to return concatenated other names
        otherNames.toString = () => otherNames.map(elem => elem.name).join(globals.joinSep);
    }

    if(this.entity?.legalAddress) {
        //Object legalAddress exists
        const legalAddr = this.entity.legalAddress;

         //Add methods to return ...
        legalAddr.toString = addrToStr; //... a concatenated address string
        legalAddr.sameValueAs = addrSameValueAs; //... a method to compare other address objects
        legalAddr.toArr = addrToArr; //... an array of address components
    }

    if(this.entity?.headquartersAddress) {
        //Object headquartersAddress exists
        const hqAddr = this.entity.headquartersAddress;

        //Add methods to return ...
        hqAddr.toString = addrToStr; //... a concatenated address string
        hqAddr.sameValueAs = addrSameValueAs; //... a method to compare other address objects
        hqAddr.toArr = addrToArr; //... an array of address components
    }
}

//A template for producing a record consisting of label/value pairs
Object.defineProperty(LeiRec.prototype, 'toLabelValueRec', {
    get: function() {
        return [
            new LabelValue( 'LEI', this.attribs?.lei ),
            new LabelValue( 'Name', this.entity?.legalName?.name ),
            new LabelValue( 'Other names', this.entity?.otherNames ),
            new LabelValue( 'Legal address', this.entity?.legalAddress),
            this.entity?.legalAddress && this.entity.legalAddress.sameValueAs(this.entity?.headquartersAddress)
                ? null
                : new LabelValue( 'HQ address', this.entity?.headquartersAddress),
            new LabelValue( 'Legal form', entLegalForms.get(this.entity?.legalForm?.id)?.desc || this.entity?.legalForm?.id ),
            new LabelValue( 'Registration number', this.entity?.registeredAs ),
            new LabelValue( 'Registered at', entRegAuths.get(this.entity?.registeredAt?.id)?.desc || this.entity?.registeredAt?.id ),
            new LabelValue( 'Status', this.entity?.status ),
            new LabelValue( 'Published on', sDateIsoToYYYYMMDD(this.meta?.goldenCopy?.publishDate))
        ].filter(elem => elem !== null);
    }
});

LeiRec.prototype.toString = function() {
    return this.toLabelValueRec
        .map( elem => String(elem) )
        .filter( elem => elem !== '' )
        .join( globals.newLineSep );
}

export default LeiRec;
