import{a as T,S,i as H}from"./assets/vendor-2177039f.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const d of o.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&n(d)}).observe(document,{childList:!0,subtree:!0});function a(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerpolicy&&(o.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?o.credentials="include":e.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(e){if(e.ep)return;e.ep=!0;const o=a(e);fetch(e.href,o)}})();async function g(t=1,r,a="popular"){const n={image_type:"photo",page:t,key:"40827343-3d4cfe2da7e34096e28537a58",orientation:"horizontal",safesearch:!0,per_page:40,q:r,order:a};return(await T.get("https://pixabay.com/api/",{params:n})).data}let i,f,m,u="popular";const h=new S(".gallery a");let l=!1,c;const s={form:document.querySelector(".search-form"),gallery:document.querySelector(".gallery"),popularBtn:document.querySelector('[name="popular"]'),latestBtn:document.querySelector('[name="latest"]'),target:document.querySelector(".target")};let I={rootMargin:"200px",threshold:1};const M=new IntersectionObserver(q,I);M.observe(s.target);addEventListener("wheel",()=>clearInterval(c));addEventListener("click",()=>clearInterval(c));addEventListener("scrollend",()=>{window.scrollY+window.innerHeight+1>document.body.scrollHeight&&(clearInterval(c),i>=Math.ceil(m/40)&&p("warning","bottomCenter","We're sorry,","but you've reached the end of search results."))});s.popularBtn.addEventListener("click",w);s.latestBtn.addEventListener("click",w);async function w(t){const r=t.target;if(r.name===u)return;if(!f){u=r.name,b(r.name);return}i=1,u=r.name,l=!1,b(r.name);const a=await g(i,f,u);try{const{hits:n,totalHits:e}=a;m=e,s.gallery.innerHTML=y(n),h.refresh(),clearInterval(c),v(),setTimeout(()=>l=!0,3e3)}catch{}}async function q(t){if(i>=Math.ceil(m/40)||!l)return;i++,l=!1;const r=await g(i,f,u);try{const{hits:a,totalHits:n}=r;m=n,s.gallery.insertAdjacentHTML("beforeend",y(a)),h.refresh(),clearInterval(c),v(),setTimeout(()=>l=!0,3e3)}catch{}}s.form.addEventListener("submit",$);async function $(t){if(t.preventDefault(),t.currentTarget.elements.searchQuery.value.trim()){i=1,l=!1,f=t.currentTarget.elements.searchQuery.value;const a=await g(i,f,u);try{const{hits:n,totalHits:e}=a;e>0?(m=e,s.gallery.innerHTML=y(n),h.refresh(),p("success","topLeft","Hooray!",`We found ${e} images.`),setTimeout(()=>l=!0,3e3),clearInterval(c),v()):(p("warning","center","Sorry,","there are no images matching your search query. Please try again."),s.gallery.innerHTML="")}catch{}}else t.currentTarget.reset()}function y(t){return t.map(({webformatURL:r,largeImageURL:a,tags:n,comments:e,downloads:o,views:d,likes:L})=>`
        <div class="photo-card">
         <a href="${a}"><img src="${r}" alt="${n}" />
            <div class="info">
            <p class="info-item">
              <b>Likes</b> ${L}
            </p>
            <p class="info-item">
              <b>Views</b> ${d}
            </p>
            <p class="info-item">
              <b>Comments</b> ${e}
            </p>
            <p class="info-item">
              <b>Downloads</b> ${o}
            </p>
          </div></a>
          </div>
    `).join("")}function b(t){s.latestBtn.classList.toggle("active-btn",t==="latest"),s.popularBtn.classList.toggle("active-btn",t==="popular")}function p(t,r,a,n){H[t]({position:r,title:a,message:n})}function v(){let t=window.scrollY;c=setInterval(()=>{window.scroll(0,t),t+=1},20)}
//# sourceMappingURL=commonHelpers.js.map
