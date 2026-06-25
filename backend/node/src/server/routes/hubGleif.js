// *********************************************************************
//
// Business-to-business application backend (v2)
// The API server /hub/gleif routes
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

import express from 'express';
import { apiReqs } from '../../share/apiDefs.js';
import apiKeyReq from '../../share/apiReq.js';
import { B2bApiErr } from '../../share/b2bApiErr.js';

const router = express.Router();

router.get('/', (req, resp) => {
    resp.json( apiReqs.get('gleif') );
});

router.get(`/lei/:key`, async(req, resp, next) => {
    try{
        await apiKeyReq(req, resp, next);
    }
    catch(err) {
        if(err instanceof B2bApiErr) return next(err);

        console.error( `Unexpected error in /gleif/lei/${req.params.key} route:`, err );

        next( new B2bApiErr('unexpected', `Requested: ${req.path}`) );
    }
});

export default router;
