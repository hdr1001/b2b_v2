// *********************************************************************
//
// Collection of shared backend utilities
// JavaScript code file: utils.js
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

//A decoder takes a stream of bytes as input & emits a stream of code points
const dcdrUtf8 = new TextDecoder('utf-8');

//Convert null or undefined to an empty string
const nullUndefToEmptyStr = elem => elem == null ? '' : elem;

//Test if a variable is an object ➡️ null doesn't qualify!
const isObject = obj => typeof obj === 'object' && obj !== null;

//ISO 8601 UTC Z date/time string to YYYYMMDD or YYMMDD
function sDateIsoToYYYYMMDD (sDateIso, length = 8) {
    return typeof sDateIso === 'string'
        ? sDateIso.split('T')[0].replace(/-/g,'').slice(length * -1)
        : '';
}

export {
    dcdrUtf8,
    nullUndefToEmptyStr,
    isObject,
    sDateIsoToYYYYMMDD
};
