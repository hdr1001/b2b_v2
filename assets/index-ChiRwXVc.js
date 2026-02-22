(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(){let e=document.querySelector(`#nav-about`),t=document.querySelector(`#nav-contact`),n=document.querySelector(`#dialog-about`),r=n.querySelector(`.icon-close`);e.addEventListener(`click`,()=>n.showModal()),t.addEventListener(`click`,()=>console.log(`Contact clicked`)),n.addEventListener(`click`,e=>{e.target===n&&n.close()}),r.addEventListener(`click`,()=>n.close())}console.log(`Top of main.js`),document.querySelector(`#app`).innerHTML=`
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
    <header>About B2B v2
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="14px" height="14px" viewBox="0 0 12 12" class="icon icon-close" id="close-about">
        <path d="m2.25,10.5c-.192,0-.384-.073-.53-.22-.293-.293-.293-.768,0-1.061L9.22,1.72c.293-.293.768-.293,1.061,0s.293.768,0,1.061l-7.5,7.5c-.146.146-.338.22-.53.22Z" fill="currentColor" stroke-width="0" data-color="color-2"></path>
        <path d="m9.75,10.5c-.192,0-.384-.073-.53-.22L1.72,2.78c-.293-.293-.293-.768,0-1.061s.768-.293,1.061,0l7.5,7.5c.293.293.293.768,0,1.061-.146.146-.338.22-.53.22Z" stroke-width="0" fill="currentColor"></path>
      </svg>
    </header>
    <table>
      <tr><th>Application:</th><td>Business-to-business</td></tr>
      <tr><th>Version:</th><td>2.0.0</td></tr>
      <tr><th>Copyright:</th><td>&copy;2026 Hans de Rooij</td></tr>
      <tr><th>License:</th><td>Apache 2.0</td></tr>
    </table>
  </dialog>
`,document.addEventListener(`DOMContentLoaded`,()=>{console.log(`DOM content loaded`),e()});