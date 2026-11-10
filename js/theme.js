(function(){var b=document.getElementById("theme"),m=matchMedia("(prefers-color-scheme: dark)"),r=document.documentElement;
function dark(){var t=r.getAttribute("data-theme");return t?t==="dark":m.matches}
function paint(){b.textContent=dark()?"☀ Tema claro":"☾ Tema escuro"}
b.onclick=function(){var n=dark()?"light":"dark";r.setAttribute("data-theme",n);try{localStorage.setItem("sd-theme",n)}catch(e){}paint()};
if(m.addEventListener)m.addEventListener("change",paint);paint()})();
