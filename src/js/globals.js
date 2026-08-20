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

const newLineSep = '\n';
const joinSep = ', ';
const delimSep = '|';

const connB2bApi = {
    protocol: 'http',
    host: 'localhost',
    port: 3000,
    path: 'b2b/api'
};

let urlB2bApi = new URL(`${connB2bApi.path}/`, `${connB2bApi.protocol}://${connB2bApi.host}:${connB2bApi.port}/`);

export default {
    newLineSep,
    joinSep,
    delimSep,
    urlB2bApi
};
