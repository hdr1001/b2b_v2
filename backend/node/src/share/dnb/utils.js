// *********************************************************************
//
// Collection of shared utilities for processing D&B data
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

export default {
    rightSizeArr
};
