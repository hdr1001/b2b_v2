(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(){let e=document.querySelector(`#nav-about`),t=document.querySelector(`#nav-contact`),n=document.querySelector(`#dialog-about`);e.addEventListener(`click`,()=>n.showModal()),t.addEventListener(`click`,()=>console.log(`Contact clicked`)),n.querySelector(`#dialog-btn-close`).addEventListener(`click`,()=>n.close())}document.querySelector(`#app`).innerHTML=`
  <header>
    <div class="app-name">B2B v2</div>
    <nav>
      <a href="#home">Home</a>
      <a href="#about" id="nav-about">About</a>
      <a href="#contact" id="nav-contact">Contact</a>
    </nav>
  </header>
  <main id="app-main">
  </main>
`,document.querySelector(`#app-main`).innerHTML=`
  <dialog id="dialog-about">
    <h2>Welcome to B2B v2</h2>
    <p>This is the main application for business-to-business interactions.</p>
    <button id="dialog-btn-close">Close</button>
  </dialog>
`,document.addEventListener(`DOMContentLoaded`,()=>{console.log(`DOM content loaded`),e()});