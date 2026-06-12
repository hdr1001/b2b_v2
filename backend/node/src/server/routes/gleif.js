// *********************************************************************
//
// Business-to-business application backend (v2)
// The API server /gleif routes
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

const router = express.Router();

const urlLei = new URL('https://api.gleif.org/api/v1/lei-records/');

router.get(`/lei/:lei`, (req, resp) => {
    console.log(`${urlLei}${req.params.lei}`);

    fetch(`${urlLei}${req.params.lei}`)
        .then( res => res.text() )
        .then( leiRec => {typeof leiRec === 'string' ? resp.set('Content-Type', 'application/json').send(leiRec) : resp.json(leiRec)} );
});

export default router;
