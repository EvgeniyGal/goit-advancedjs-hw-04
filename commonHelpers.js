import{a as S,S as I,i as M}from"./assets/vendor-2177039f.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const u of o.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&a(u)}).observe(document,{childList:!0,subtree:!0});function r(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerpolicy&&(o.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?o.credentials="include":n.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(n){if(n.ep)return;n.ep=!0;const o=r(n);fetch(n.href,o)}})();async function g(t=1,e,r="popular"){const a={image_type:"photo",page:t,key:"40827343-3d4cfe2da7e34096e28537a58",orientation:"horizontal",safesearch:!0,per_page:40,q:e,order:r};return(await S.get("https://pixabay.com/api/",{params:a})).data}let s,d,f,c="popular";const h=new I(".gallery a");let m=!1,i;const l={form:document.querySelector(".search-form"),gallery:document.querySelector(".gallery"),popularBtn:document.querySelector('[name="popular"]'),latestBtn:document.querySelector('[name="latest"]'),target:document.querySelector(".target")};let T={rootMargin:"200px",threshold:1};const q=new IntersectionObserver($,T);q.observe(l.target);addEventListener("wheel",()=>clearInterval(i));addEventListener("click",()=>clearInterval(i));addEventListener("scrollend",()=>{window.scrollY+window.innerHeight+1>document.body.scrollHeight&&clearInterval(i)});l.popularBtn.addEventListener("click",L);l.latestBtn.addEventListener("click",L);function L(t){const e=t.target;if(e.name!==c){if(!d){c=e.name,b(e.name);return}s=1,c=e.name,g(s,d,c).then(({hits:r,totalHits:a})=>{f=a,l.gallery.innerHTML=y(r),h.refresh(),clearInterval(i),v()}).catch(r=>console.log(r)),b(e.name)}}function $(t){s>Math.ceil(f/40)||!m||(s++,g(s,d,c).then(({hits:e,totalHits:r})=>{f=r,l.gallery.insertAdjacentHTML("beforeend",y(e)),h.refresh(),clearInterval(i),v(),s===Math.ceil(r/40)&&p("warning","bottomCenter","We're sorry,","but you've reached the end of search results.")}).catch(e=>console.log(e)))}l.form.addEventListener("submit",B);function B(t){t.preventDefault(),t.currentTarget.elements.searchQuery.value&&(s=1,m=!1,d=t.currentTarget.elements.searchQuery.value,g(s,d,c).then(({hits:e,totalHits:r}={})=>{r>0?(f=r,l.gallery.innerHTML=y(e),h.refresh(),p("success","topLeft","Hooray!",`We found ${r} images.`),setTimeout(()=>m=!0,3e3),clearInterval(i),v()):(p("warning","center","Sorry,","there are no images matching your search query. Please try again."),l.gallery.innerHTML="")}).catch(e=>console.log(e.message)))}function y(t){return t.map(({webformatURL:e,largeImageURL:r,tags:a,comments:n,downloads:o,views:u,likes:w})=>`
        <div class="photo-card">
         <a href="${r}"><img src="${e}" alt="${a}" />
            <div class="info">
            <p class="info-item">
              <b>Likes</b> ${w}
            </p>
            <p class="info-item">
              <b>Views</b> ${u}
            </p>
            <p class="info-item">
              <b>Comments</b> ${n}
            </p>
            <p class="info-item">
              <b>Downloads</b> ${o}
            </p>
          </div></a>
          </div>
    `).join("")}function b(t){l.latestBtn.classList.toggle("active-btn",t==="latest"),l.popularBtn.classList.toggle("active-btn",t==="popular")}function p(t,e,r,a){M[t]({position:e,title:r,message:a})}function v(){let t=window.scrollY;i=setInterval(()=>{window.scroll(0,t),t+=1},20)}
//# sourceMappingURL=commonHelpers.js.map
