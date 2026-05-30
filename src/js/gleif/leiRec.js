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
import { gbRegions } from '../../assets/codes/gbRegions.js';
import { ieRegions } from '../../assets/codes/ieRegions.js';

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

//Convert an address object to a localized array, filtering out null values
function addrToArr() {
    const { addressLines, postalCode, city, region, country } = this;

    let cleanRegion = region && region.startsWith( country + '-' ) ? region.slice(3) : region;

    let arrLeiAddr = []; //This array will be returned

    let leiAddrCountry = isoCountries.get(country)?.name || country;

    //Postalcode, city and region address components
    const addrComponents = [];

    //Address lines come first
    if(Array.isArray(addressLines) && addressLines.length) {
        arrLeiAddr = Array.from(addressLines)
    }

    //Specifics of the region, postalcode & city line(s) are very local
    switch(country) {
        case 'AU': //Australia
        case 'NZ': //New Zealand
        case 'SG': //Singapore
            if(country === 'NZ') cleanRegion = null;

            if(country === 'SG') {
                cleanRegion = null;

                const idxLastAddrLine = arrLeiAddr.length - 1;

                if(idxLastAddrLine >= 0) {
                    const wSpace = [ 32, 44 ]; //A space or a comma
                    let idx = 'SINGAPORE'.length + 1;

                    if(arrLeiAddr[idxLastAddrLine].slice('SINGAPORE'.length * -1).toUpperCase() === 'SINGAPORE') {
                        while(wSpace.indexOf(arrLeiAddr[idxLastAddrLine].charCodeAt(arrLeiAddr[idxLastAddrLine].length - idx)) >= 0) { idx++ }

                        arrLeiAddr[idxLastAddrLine] = arrLeiAddr[idxLastAddrLine].slice(0, -1 * (idx - 1))
                    }
                }
            }

            addrComponents.push(city);
            addrComponents.push(cleanRegion);
            addrComponents.push(postalCode);

            arrLeiAddr.push(addrComponents.filter(elem => !!elem).join(' '));

            break;
        case 'CA': //Canada
        case 'US': //United States
        case 'LV': //Latvia
            if(country === 'LV') cleanRegion = null;

            addrComponents.push(city);
            addrComponents.push(cleanRegion);
            addrComponents.push(postalCode);

            if(city && (cleanRegion || postalCode)) addrComponents[0] += ',';

            arrLeiAddr.push(addrComponents.filter(elem => !!elem).join(' '));

            break;
        case 'CY': //Cyprus
        case 'HR': //Croatia
        case 'SE': //Sweden
            addrComponents.push(postalCode?.length ? country + '-' + postalCode : '');
            addrComponents.push(city);

            arrLeiAddr.push(addrComponents.filter(elem => !!elem).join(' '));

            break;
        case 'ES': //Spain
            addrComponents.push(postalCode?.length ? '/' + country + '/' + postalCode + '.- ' : '');
            addrComponents.push(city);

            arrLeiAddr.push(addrComponents.filter(elem => !!elem).join(' '));

            break;
        case 'GB': //Great Britain
        case 'GG': //Guernsey
        case 'JE': //Jersey
        case 'IE': //Ireland
        case 'IM': //Isle of Man
            arrLeiAddr.push(city);

            if(region) {
                switch(country) {
                    case 'GB':
                        arrLeiAddr.push(gbRegions.get(region) || cleanRegion);
                        break;
                    case 'IE':
                        const leiAddrRegion = ieRegions.get(region);

                        if(leiAddrRegion) {
                            arrLeiAddr.push('Co. ' + leiAddrRegion)
                        }
                        else {
                            if(cleanRegion) arrLeiAddr.push(cleanRegion)
                        }

                        break;
                    default:
                        arrLeiAddr.push(cleanRegion);
                }
            }

            arrLeiAddr.push(postalCode);

            break;
        case 'HK': //Hong Kong
        case 'JP': //Japan
            arrLeiAddr.push(city?.length ? city : '');

            if(country === 'JP' && postalCode) leiAddrCountry = postalCode + ' ' + leiAddrCountry

            break;
        case 'FI': //Finland
            if(dupPostalCodeCity(arrLeiAddr, postalCode)) arrLeiAddr.pop(); //fall through intended

        //Default tested for Austria (AT), Belgium (BE), China (CN), Germany (DE),
        //France (FR), Italy (IT, no 2-letter province codes), The Netherlands (NL)
        //and Norway (NO)
        default:
            addrComponents.push(postalCode);
            addrComponents.push(city);

            arrLeiAddr.push(addrComponents.filter(elem => !!elem).join(' '));
    }

    //Add the country name/ISO code
    arrLeiAddr.push(leiAddrCountry);

    return arrLeiAddr.filter(elem => (elem != null && elem !== ''));
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
function LeiRec(objLEI, dataArrIdx = 0) {
    this.root = objLEI; //Safe a reference to the root of the object

    //Data shortcuts
    ({ meta: this.meta, data: this.data } = objLEI);

    if(Array.isArray(this.data)) {
        this.data = this.data[dataArrIdx];
    }

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
