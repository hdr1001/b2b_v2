(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(){let e=document.querySelector(`#nav-about`),t=document.querySelector(`#nav-contact`),n=document.querySelector(`#dialog-about`);e.addEventListener(`click`,()=>n.showModal()),t.addEventListener(`click`,()=>console.log(`Contact clicked`))}console.log(`Top of main.js`),document.querySelector(`#app`).innerHTML=`
  <header>
    <div class="app-name">B2B v2</div>
    <nav>
      <a href="javascript:void(0)">Home</a>
      <a href="javascript:void(0)" id="nav-about">About</a>
      <a href="javascript:void(0)" id="nav-contact">Contact</a>
    </nav>
  </header>
  <main id="app-main"></main>
`,document.querySelector(`#app-main`).innerHTML=`
  <dialog id="dialog-about">
    <header>About B2B v2</header>
    <table>
      <tr><th>Application:</th><td>Business-to-business</td></tr>
      <tr><th>Version:</th><td>2.0.0</td></tr>
      <tr><th>Copyright:</th><td>&copy;2026 Hans de Rooij</td></tr>
      <tr><th>License:</th><td>Apache 2.0</td></tr>
    </table>
  </dialog>
`,document.addEventListener(`DOMContentLoaded`,()=>{console.log(`DOM content loaded`),e()});