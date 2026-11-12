/* Áudio do Speak Daily
   1) Toca MP3 neural pré-gerado: audio/<frase>.mp3 e audio/slow/<frase>.mp3
   2) Se o arquivo não existir (ou estiver offline sem cache), usa a voz do navegador */
(function(){
var el=new Audio(),ready={},pend={},seq=0,gen=0,fin=null,unlocked=false;
var SIL="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
/* mesma regra do tools/gerar-audio.py */
function slug(t){return String(t).toLowerCase().replace(/[\u2018\u2019]/g,"'").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}
function url(t,slow){return "audio/"+(slow?"slow/":"")+slug(t)+".mp3"}
/* iOS só libera o áudio depois de um play() feito dentro de um toque */
function unlock(){if(unlocked)return;unlocked=true;try{el.src=SIL;var p=el.play();if(p&&p.catch)p.catch(function(){})}catch(e){}}
document.addEventListener("click",unlock,{once:true,capture:true});
function load(u){if(ready[u])return Promise.resolve(ready[u]);if(pend[u])return pend[u];
pend[u]=fetch(u).then(function(r){if(!r.ok)throw 0;return r.blob()}).then(function(b){if(!b.size||/text|html|json/.test(b.type))throw 0;ready[u]=URL.createObjectURL(b);delete pend[u];return ready[u]}).catch(function(){delete pend[u];throw 0});
return pend[u]}
function preload(list,slow){list.forEach(function(t){load(url(t,slow)).catch(function(){})})}
/* interrompe o que estiver tocando e libera quem estava esperando */
function halt(){seq++;try{el.pause()}catch(e){}el.onended=el.onerror=null;if("speechSynthesis" in window)speechSynthesis.cancel();if(fin){var f=fin;fin=null;f()}}
function stop(){gen++;halt()}
/* voz do navegador (reserva) */
var vs=[];
function lv(){try{vs=speechSynthesis.getVoices()}catch(e){}}
if("speechSynthesis" in window){lv();if(speechSynthesis.addEventListener)speechSynthesis.addEventListener("voiceschanged",lv)}
function score(v){var n=v.name.toLowerCase(),s=0;if(/^en[-_]us/i.test(v.lang))s+=10;else if(/^en/i.test(v.lang))s+=4;else return -1;
if(/natural|neural|online/.test(n))s+=50;if(/premium|enhanced/.test(n))s+=40;if(/google/.test(n))s+=30;
if(/\b(samantha|ava|allison|aaron|nicky|siri|jenny|aria)\b/.test(n))s+=20;if(/compact|espeak/.test(n))s-=30;return s}
function voice(){lv();var b=null,m=-1;vs.forEach(function(v){var s=score(v);if(s>m){m=s;b=v}});return m>=0?b:null}
function synth(t,slow){return new Promise(function(res){if(!("speechSynthesis" in window)){alert("Não foi possível tocar o áudio neste navegador.");return res()}
var u=new SpeechSynthesisUtterance(String(t).replace(/[\u2018\u2019]/g,"'"));u.lang="en-US";var v=voice();if(v)u.voice=v;u.rate=slow?.75:.95;
fin=res;u.onend=u.onerror=function(){if(fin===res)fin=null;res()};speechSynthesis.speak(u)})}
function run(src){return new Promise(function(res){fin=res;el.onended=el.onerror=function(){if(fin===res)fin=null;res()};el.src=src;var p=el.play();if(p&&p.catch)p.catch(function(){if(fin===res)fin=null;res()})})}
function say(t,slow){halt();var my=seq,u=url(t,slow);
if(ready[u])return run(ready[u]);
return load(u).then(function(src){return my===seq?run(src):0},function(){return my===seq?synth(t,slow):0})}
window.Snd={say:say,stop:stop,preload:preload,gen:function(){return gen}};
})();
