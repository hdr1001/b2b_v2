// *********************************************************************
//
// Custom error class for the B2B API server
// JavaScript code file: b2bApiErr.js
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

import { isObject } from "../../../../src/js/utils.js";

//HTTP status codes
const httpStatus = {
    okay: { description: 'Request succeeded', code: 200 },
    accepted: { description: 'Accepted', code: 202 },
    notFound: { description: 'Unable to locate', code: 404 },
    unprocessableEntity: { description: 'Unprocessable entity', code: 422 },
    serverErr: { description: 'Server Error', code: 500 }
};
 
//API Hub errors
const b2bErrCode = new Map([
    [ 'unexpected', { code: 0, desc: 'Unexpected error occurred in API HUB', httpStatus: httpStatus.serverErr } ],
    [ 'unableToLocate', { code: 1, desc: 'Unable to locate the requested resource', httpStatus: httpStatus.notFound } ],
    [ 'invalidParameter', { code: 2, desc: 'Invalid parameter', httpStatus: httpStatus.unprocessableEntity } ],
    [ 'extnlApiErr', { code: 3, desc: 'External API returned an error', httpStatus: httpStatus.serverErr } ],
    [ 'httpErrReturn', { code: 4, desc: 'External API returned an HTTP error status', httpStatus: httpStatus.serverErr } ],
    [ 'semanticError', { code: 5, desc: 'Semantically erroneous request', httpStatus: httpStatus.unprocessableEntity } ],
    [ 'serverError', { code: 6, desc: 'Server error', httpStatus: httpStatus.serverErr } ],
    [ 'unprocessableEntity', { code: 7, desc: 'Unprocessable entity', httpStatus: httpStatus.unprocessableEntity } ]
]);

//API Hub custom error class
class B2bApiErr extends Error {
    constructor(errKey, addtlErrMsg, extnlApiHttpStatus, extnlApiBody) {
        const b2bErr = b2bErrCode.get(errKey) || b2bErrCode.get('unexpected');

        //Call the parent constructor with the error description as message
        super(b2bErr.desc);

        this.b2bErr = b2bErr;

        if(addtlErrMsg) this.addtlMessage = addtlErrMsg;

        if(extnlApiHttpStatus || extnlApiBody) {
            this.extnlApi = {};

            if(extnlApiHttpStatus) this.extnlApi.httpStatus = extnlApiHttpStatus;

            if(extnlApiBody) {
                if(typeof extnlApiBody === 'string') {
                    try {
                        this.extnlApi.body = JSON.parse(extnlApiBody)
                    }
                    catch(err) {
                        console.error('Error parsing external API body:', err);
                    }
                }

                if(isObject(extnlApiBody)) this.extnlApi.body = extnlApiBody;
            }
        }
    }

    get httpStatus() {
        return this.b2bErr.httpStatus.code;
    }

    toJSON() {
        const ret = {};

        ret.message = this.message; //From the parent Error class
        ret.addtlMessage = this.addtlMessage;
        ret.code = this.b2bErr.code;
        ret.httpStatus = this.httpStatus;

        if(this.extnlApi) {
            ret.externalApi = {};

            if(this.extnlApi.httpStatus) ret.externalApi.httpStatus = this.extnlApi.httpStatus;
            if(this.extnlApi.body) ret.externalApi.body = this.extnlApi.body;
        }

        return ret;
    }
}

export {
    httpStatus,
    b2bErrCode,
    B2bApiErr
}
