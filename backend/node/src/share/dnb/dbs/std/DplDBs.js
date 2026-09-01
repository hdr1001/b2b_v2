// *********************************************************************
//
// D&B Direct+ Standard Data Blocks JavaScript object wrapper
// Code file: DplDBs.js
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

//D&B Direct+ Data Blocks JavaScript object wrapper
class DplDBs {
    constructor(inp) {
        //Parse the JSON passed in as a string or buffer
        if((typeof inp === 'string' || Buffer.isBuffer(inp)) && inp.length) {
            try {
                this.dplDBs = JSON.parse(inp)
            }
            catch(err) {
                console.error(err.message);
                throw(err);
            }

            //The parsed object should have an organization node
            if(!this.dplDBs.organization) {
                throw new Error('Constructor parameter is valid JSON but not a collection of D&B Direct+ data blocks')
            }

            //Create a shortcut to the organization attribute
            this.org = this.dplDBs.organization;
        }

        //A D&B Direct+ collection of data blocks can be passed in, as an object, to the constructor as well
        if(typeof inp === 'object' && !Buffer.isBuffer(inp)) {
            //The object passed in to the constructor should have an organization node
            if(!inp.organization) {
                throw new Error('The constructor parameter is an object but not a collection of D&B Direct+ data blocks')
            }

            //Store a reference to the object passed in to the constructor
            this.dplDBs = inp;

            //Create a shortcut to the organization attribute
            this.org = inp.organization;
        }
        
        //One-to-one mappings
        this.map121 = { //Collection of directly mapped values
            // Common data-elements
            duns:        this.org.duns,
            primaryName: this.org.primaryName,
            countryISO:  this.org.countryISOAlpha2Code
        }

        //One-to-one mappings of control status details
        if(this.org?.dunsControlStatus) {
            const orgCtrlStatus = this.org.dunsControlStatus;

            this.map121.opStatus = orgCtrlStatus.operatingStatus?.description;
            this.map121.opStatusDate = orgCtrlStatus.operatingStatus?.startDate;
            this.map121.isMarketable = orgCtrlStatus.isMarketable;
        }

        //Miscellaneous one-to-one mappings
        this.map121.startDate = this.org.startDate;
        this.map121.SMB = this.org.organizationSizeCategory?.description;
        this.map121.defaultCurr = this.org.defaultCurrency;
        this.map121.marketable = this.org.dunsControlStatus?.isMarketable;

        //One-to-one mappings of inquiry details
        if(this.dplDBs.inquiryDetail) {
            const inqDetail = this.dplDBs.inquiryDetail;

            this.map121.inqDuns = inqDetail.duns;
            this.map121.tradeUp = inqDetail.tradeUp;
            this.map121.custRef = inqDetail.customerReference;
        }
    }
}
