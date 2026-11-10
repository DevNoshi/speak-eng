var K="sd2",LS={},S={v:"home",id:null,st:"learn",qi:0,qs:[],sc:0,xp:0,slow:false,play:-1};
var M=[{n:"Fundamentos",s:"Datas, números e horas",c:"m1",l:["dias","meses","anos","num","hora"]},{n:"Vocabulário",s:"Cores, família e verbos",c:"m2",l:["cores","familia","verbos"]},{n:"Comunicação",s:"Frases úteis e conversas",c:"m3",l:["dia","c0","c1","c2"]}];
L=L.concat(window.EXTRA||[]);
L.forEach(function(s){LS[s.id]={n:s.n,i:s.i}});
C.forEach(function(c,k){LS["c"+k]={n:"Conversa: "+c.n,i:c.l.map(function(l){return[l[1],l[2]]}),d:c.l}});
LS.mix={n:"Revisão geral",i:[]};
L.forEach(function(s){s.i.forEach(function(p){if(p[0].length<24)LS.mix.i.push(p)})});
function $(i){return document.getElementById(i)}
function td(o){var d=new Date();d.setDate(d.getDate()-(o||0));return d.toISOString().slice(0,10)}
function ld(){var d={};try{d=JSON.parse(localStorage.getItem(K)||"{}")}catch(e){}d.done=d.done||{};d.xp=d.xp||0;d.streak=d.streak||0;if(!d.day||d.day.d!==td())d.day={d:td(),plays:0,right:0,les:0};return d}
var P=ld();
function sv(){try{localStorage.setItem(K,JSON.stringify(P))}catch(e){}}
function gain(x){P.xp+=x;if(P.last!==td()){P.streak=P.last===td(1)?P.streak+1:1;P.last=td()}sv()}
function ok(id){return P.done[id]>=60}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;")}
function voice(){var v=speechSynthesis.getVoices().filter(function(x){return /^en[-_]US/i.test(x.lang)});return v.filter(function(x){return /google|natural|samantha|aaron|siri/i.test(x.name)})[0]||v[0]||null}
function say(t,n){return new Promise(function(res){if(!("speechSynthesis" in window)){alert("Seu navegador não tem voz em inglês.");return res()}
speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(t);u.lang="en-US";var v=voice();if(v)u.voice=v;u.rate=S.slow?.65:.95;u.onend=u.onerror=function(){res()};speechSynthesis.speak(u);if(n){P.day.plays++;sv()}})}
function mk(id){var it=LS[id].i,a=it.slice().sort(function(){return Math.random()-.5}).slice(0,5);
return a.map(function(c){var o=[c];while(o.length<3){var r=it[Math.floor(Math.random()*it.length)];if(o.indexOf(r)<0)o.push(r)}return{c:c,o:o.sort(function(){return Math.random()-.5}),a:null}})}
function nextL(){for(var m=0;m<M.length;m++)for(var j=0;j<M[m].l.length;j++)if(!ok(M[m].l[j]))return M[m].l[j];return null}
function home(){var h="<h1>Sua trilha</h1>",n=nextL();
if(n)h+='<button class="hero" data-a="open" data-v="'+n+'"><small>Continuar de onde parou</small><b>'+LS[n].n+'</b><span>Começar lição</span></button>';
M.forEach(function(m){var d=m.l.filter(ok).length;
h+='<section class="mod '+m.c+'"><div class="mh"><div><h2>'+m.n+'</h2><p>'+m.s+'</p></div><span>'+d+'/'+m.l.length+'</span></div><div class="bar"><i style="width:'+d/m.l.length*100+'%"></i></div>'+
m.l.map(function(id,i){var b=P.done[id];return '<button class="les" data-a="open" data-v="'+id+'"><span class="dot'+(ok(id)?" ok":"")+'">'+(ok(id)?"✓":i+1)+'</span><span class="lt"><b>'+LS[id].n+'</b><small>'+LS[id].i.length+' frases · '+(b!=null?"melhor: "+b+"%":"não iniciada")+'</small></span></button>'}).join("")+'</section>'});
return h}
function goals(){var D=P.day,tot=0,g=[["Ouvir 10 frases",D.plays,10],["Concluir 1 lição",D.les,1],["Acertar 10 perguntas",D.right,10]];
M.forEach(function(m){tot+=m.l.filter(ok).length});
var h='<h1>Metas de hoje</h1><p class="sub">Elas reiniciam a cada dia. Lição concluída = 60% ou mais no treino.</p>';
g.forEach(function(x){var c=x[1]>=x[2];h+='<div class="goal'+(c?" ok":"")+'"><div class="mh"><b>'+x[0]+'</b><span>'+Math.min(x[1],x[2])+'/'+x[2]+'</span></div><div class="bar"><i style="width:'+Math.min(100,x[1]/x[2]*100)+'%"></i></div></div>'});
return h+'<h2 style="margin-top:20px">Seu progresso</h2><p class="sub">Sequência: '+P.streak+' dia(s) · XP total: '+P.xp+' · Lições concluídas: '+tot+' de 12</p>'}
function bub(l,i){return '<button class="bub '+(l[0]=="B"?"b ":"")+(S.play==i?"on":"")+'" data-a="line" data-v="'+i+'"><small>'+l[0]+'</small><span class="en">'+esc(l[1])+'</span><span class="pt">'+esc(l[2])+'</span></button>'}
function lesson(s){var mix=S.id=="mix",h='<button class="back" data-a="home">← Trilha</button><h1>'+s.n+'</h1>',st=function(a){return mix?"":'<div class="steps">'+(a?"<b>1 Aprender</b><span>2 Praticar</span>":"<span>1 Aprender</span><b>2 Praticar</b>")+'</div>'};
if(S.st=="learn"){h+=st(1)+'<div class="ctl"><button class="chip" data-a="slow" aria-pressed="'+S.slow+'">Voz devagar</button></div>';
if(s.d)h+='<p><button class="btn main" data-a="all">Ouvir tudo</button></p>'+s.d.map(bub).join("");
else h+=s.i.map(function(p){return '<div class="row"><button class="t" data-a="say" data-v="'+esc(p[0])+'"><span class="en">'+esc(p[0])+'</span><span class="pt">'+esc(p[1])+'</span></button></div>'}).join("");
return h+'<p><button class="btn main" data-a="quiz">Praticar</button></p>'}
if(S.st=="quiz"){var q=S.qs[S.qi];
return h+st(0)+'<div class="bar"><i style="width:'+S.qi/S.qs.length*100+'%"></i></div><p class="sub">Pergunta '+(S.qi+1)+' de '+S.qs.length+'</p><div class="q"><span class="pt">Como se diz em inglês?</span><div class="w">'+esc(q.c[1])+'</div>'+q.o.map(function(o,i){var c="";if(q.a!==null){if(o===q.c)c=" ok";else if(i==q.a)c=" no"}return '<button class="opt'+c+'" data-a="ans" data-v="'+i+'">'+esc(o[0])+'</button>'}).join("")+(q.a!==null?'<button class="btn main" data-a="nx">'+(S.qi+1<S.qs.length?"Próxima":"Ver resultado")+'</button>':"")+'</div>'}
var p=Math.round(S.sc/S.qs.length*100);
return h+'<div class="q"><div class="w">'+S.sc+' de '+S.qs.length+' acertos</div><p class="sub">'+(p>=60?"Lição concluída!":"Releia a lição e tente de novo.")+' Você ganhou '+S.xp+' XP.</p><button class="btn main" data-a="home">Voltar à trilha</button> <button class="btn" data-a="quiz">Tentar de novo</button></div>'}
function view(){var h=S.v=="home"?home():S.v=="goals"?goals():lesson(LS[S.id]);$("app").innerHTML=h;
$("stats").innerHTML='<span class="pill">🔥 '+P.streak+'</span><span class="pill">⭐ '+P.xp+'</span>';
var cur=S.v=="goals"?"goals":S.id=="mix"&&S.v=="lesson"?"mix":"home";
document.querySelectorAll("nav button").forEach(function(b){b.setAttribute("aria-current",b.dataset.t==cur?"page":"false")})}
function startQ(){S.qs=mk(S.id);S.qi=0;S.sc=0;S.st="quiz"}
document.addEventListener("click",function(e){var el=e.target.closest("[data-a],[data-t]");if(!el)return;
if("speechSynthesis" in window&&(el.dataset.t||el.dataset.a=="home"||el.dataset.a=="open"))speechSynthesis.cancel();
if(el.dataset.t){var t=el.dataset.t;if(t=="mix"){S.v="lesson";S.id="mix";startQ()}else S.v=t;return view()}
var a=el.dataset.a,v=el.dataset.v;
if(a=="open"){S.v="lesson";S.id=v;S.st="learn"}
else if(a=="home"){S.v="home"}
else if(a=="slow"){S.slow=!S.slow}
else if(a=="say"){say(v,true);return view()}
else if(a=="line"){S.play=+v;view();say(LS[S.id].d[+v][1],true).then(function(){S.play=-1;view()});return}
else if(a=="all"){(async function(){var d=LS[S.id].d;for(var i=0;i<d.length;i++){S.play=i;view();await say(d[i][1],false)}S.play=-1;P.day.plays+=d.length;sv();view()})();return}
else if(a=="quiz"){startQ()}
else if(a=="ans"){var q=S.qs[S.qi];if(q.a===null){q.a=+v;if(q.o[q.a]===q.c){S.sc++;P.day.right++;sv()}say(q.c[0],false)}}
else if(a=="nx"){if(S.qi+1<S.qs.length)S.qi++;else{var p=Math.round(S.sc/S.qs.length*100);S.xp=S.sc*10+20;gain(S.xp);if(S.id!="mix"){P.done[S.id]=Math.max(P.done[S.id]||0,p);if(p>=60)P.day.les++}sv();S.st="end"}}
view()});
view();
