/* ********************************************************************
//
// Business-to-business (B2B) application v2
// Application's waiting animation dialog  
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

export default function addDialogPlzWait() {
    const dialogPlzWait = document.createElement('dialog');
    dialogPlzWait.id = 'dialog-plz-wait';

    const aboutTitle = document.createElement('div');
    aboutTitle.id = 'dialog-title';
    aboutTitle.innerHTML = 'One moment please ...';
 
    dialogPlzWait.appendChild(aboutTitle);

    const divAnimation = document.createElement('div');
    divAnimation.classList.add('plz-wait');

    for(let i = 0; i < 5; i++) {
        divAnimation.appendChild(document.createElement('div')).classList.add('plz-wait-box')
    }
    
    dialogPlzWait.appendChild(divAnimation);

    return dialogPlzWait;
}
