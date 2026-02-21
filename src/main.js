/* ********************************************************************
//
// Business-to-business (B2B) application v2
// Application entry point and main application logic
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
import './style.css';
import setupEventListeners from './evntListen.js';

console.log('Top of main.js');

//Main application structure
document.querySelector('#app').innerHTML = `
  <header>
    <div class="app-name">B2B v2</div>
    <nav>
      <a href="javascript:void(0)">Home</a>
      <a href="javascript:void(0)" id="nav-about">About</a>
      <a href="javascript:void(0)" id="nav-contact">Contact</a>
    </nav>
  </header>
  <main id="app-main"></main>
`;

//The about dialog
document.querySelector('#app-main').innerHTML = `
  <dialog id="dialog-about">
    <header>About B2B v2</header>
    <table>
      <tr><th>Application:</th><td>Business-to-business</td></tr>
      <tr><th>Version:</th><td>2.0.0</td></tr>
      <tr><th>Copyright:</th><td>&copy;2026 Hans de Rooij</td></tr>
      <tr><th>License:</th><td>Apache 2.0</td></tr>
    </table>
  </dialog>
`;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded');

    setupEventListeners();
});
