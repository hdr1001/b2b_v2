/* ********************************************************************
//
// Business-to-business (B2B) application v2
// Global constants and variables
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

import { Network } from "lucide";

const newLineSep = '\n';
const joinSep = ', ';
const delimSep = '|';

class ConnB2bApi {
    constructor() {
        this.iniConn = {
            protocol: 'http',
            host: 'localhost',
            port: 3000,
            path: 'b2b/api',
        };

        this.currConn = { ...this.iniConn };

        this.url = new URL(
            `${this.currConn.path}${this.currConn.path.slice(-1) === '/' ? '' : '/'}`,
            `${this.currConn.protocol}://${this.currConn.host}:${this.currConn.port}/`
        );

        this.status = {
            validated: {
                tszReq: 0,
                tszResp: 0
            },
            ok: null,
            testUrl: '',
            httpStatus: 0,
            msg: ''
        }
    }

    async validate() {
        this.status.ok = false;

        this.status.testUrl = `${this.url.toString()}about`;

        this.status.validated.tszReq = Date.now();
        this.status.validated.tszResp = 0;

        this.status.httpStatus = 0; 

        try {
            const apiResp = await fetch(this.status.testUrl);

            this.status.validated.tszResp = Date.now();

            this.status.httpStatus = apiResp.status; 

            if(!apiResp.ok) throw new Error(`API data fetch resulted in HTTP status ${apiResp.status}`)

            this.status.ok = true;

            this.status.msg = `API data fetch resulted in a HTTP status okay. Status: ${apiResp.status}`;
        }
        catch(err) {
            this.status.msg = err.message;
        }

        return this.status;
    }
}

const connB2bApi = new ConnB2bApi;

export default {
    newLineSep,
    joinSep,
    delimSep,
    connB2bApi
};
