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
import { isoCountries } from '../../assets/codes/isoCountries.js';

//Check for a duplicate postal code (and city)
function dupPostalCodeCity(arrLeiAddr, postalCode) {
    let pc1, pc2;

    const leiAddr = arrLeiAddr[ arrLeiAddr.length - 1 ];

    const idxSpace = leiAddr.indexOf(' ');

    if(idxSpace > 0) {
        pc1 = leiAddr.slice(0, idxSpace)
    }
    else {
        return false
    }

    const idxDash = postalCode.indexOf('-');

    pc2 = (idxDash === -1) ? postalCode : postalCode.slice(idxDash + 1)

    if(pc1 === pc2) return true;

    return false;
}

//Convert an address object to an array, filtering out null values
function addrToArr() {
    const { addressLines, postalCode, city, region, country } = this;

    const cleanRegion = region && region.startsWith( country + '-' ) ? region.slice(3) : region;

    let arrLeiAddr = [], sPcCityLine;

    if(Array.isArray(addressLines) && addressLines.length) {
        arrLeiAddr = Array.from(addressLines)
    }

    switch(country) {
        case 'AU':
            sPcCityLine = `${city?.length ? city + ' ' : ''}${cleanRegion?.length ? cleanRegion + ' ' : ''}${postalCode?.length ? postalCode : ''}`;
            break;
        case 'CA':
        case 'US':
            sPcCityLine = `${city?.length ? city + ', ' : ''}${cleanRegion?.length ? cleanRegion + ' ' : ''}${postalCode?.length ? postalCode : ''}`;
            break;
        case 'CY':
            sPcCityLine = `${postalCode?.length ? country + '-' + postalCode + ' ' : ''}${city?.length ? city : ''}`;
            break;
        case 'ES':
            sPcCityLine = `${postalCode?.length ? '/' + country + '/' + postalCode + '.- ' : ''}${city?.length ? city : ''}`;
            break;
        case 'FI':
//            if(dupPostalCodeCity(arrLeiAddr, postalCode)) arrLeiAddr.pop();
            break;
        case 'GB':
//            addrConversion.postalCodeOnLastLine = true;
            break;
        default:
            sPcCityLine = `${postalCode?.length ? postalCode + ' ' : ''}${city?.length ? city : ''}`;
    }

    arrLeiAddr.push(sPcCityLine);

    arrLeiAddr.push(isoCountries.get(country)?.name || country);

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
    this.root = objLEI; //Safe a reference to the root of the object

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

        this.entity.legalAddr = legalAddr;
    }

    if(this.entity?.headquartersAddress) {
        //Object headquartersAddress exists
        const hqAddr = this.entity.headquartersAddress;

        //Add methods to return ...
        hqAddr.toString = addrToStr; //... a concatenated address string
        hqAddr.sameValueAs = addrSameValueAs; //... a method to compare other address objects
        hqAddr.toArr = addrToArr; //... an array of address components

        this.entity.hqAddr = hqAddr;
    }

    if(this.entity?.otherAddresses && this.entity.otherAddresses.length) {
        //Array otherAddresses exists and is not empty
        const otherAddrs = this.entity.otherAddresses;

        //Add methods to return ...
        otherAddrs.forEach(elem => elem.toString = addrToStr); //... a concatenated address
        otherAddrs.forEach(elem => elem.sameValueAs = addrSameValueAs); //... a method to compare other address objects
        otherAddrs.forEach(elem => elem.toArr = addrToArr); //... an array of address components
    }
}

export default LeiRec;
