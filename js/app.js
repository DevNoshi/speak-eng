var L=[
{id:"dias",n:"Dias",i:[["Monday","segunda-feira"],["Tuesday","terça-feira"],["Wednesday","quarta-feira"],["Thursday","quinta-feira"],["Friday","sexta-feira"],["Saturday","sábado"],["Sunday","domingo"],["Today is Tuesday.","Hoje é terça-feira."],["See you on Friday!","Até sexta!"]]},
{id:"meses",n:"Meses",i:[["January","janeiro"],["February","fevereiro"],["March","março"],["April","abril"],["May","maio"],["June","junho"],["July","julho"],["August","agosto"],["September","setembro"],["October","outubro"],["November","novembro"],["December","dezembro"],["My birthday is in May.","Meu aniversário é em maio."]]},
{id:"anos",n:"Anos e datas",i:[["nineteen ninety-nine","1999"],["two thousand five","2005"],["twenty twenty-six","2026"],["November tenth","10 de novembro"],["It’s November tenth, twenty twenty-six.","Hoje é 10 de novembro de 2026."],["I was born in nineteen ninety-five.","Eu nasci em 1995."]]},
{id:"num",n:"Números",i:[["one","1"],["two","2"],["three","3"],["four","4"],["five","5"],["six","6"],["seven","7"],["eight","8"],["nine","9"],["ten","10"],["eleven","11"],["twelve","12"],["thirteen","13"],["fifteen","15"],["twenty","20"],["thirty","30"],["fifty","50"],["one hundred","100"],["one thousand","1.000"]]},
{id:"dia",n:"Dia a dia",i:[["Good morning!","Bom dia!"],["How are you?","Como vai você?"],["I’m fine, thanks. And you?","Estou bem, obrigado. E você?"],["Nice to meet you.","Prazer em conhecer você."],["Thank you so much.","Muito obrigado."],["You’re welcome.","De nada."],["Excuse me, where is the bathroom?","Com licença, onde fica o banheiro?"],["Could you repeat that, please?","Pode repetir, por favor?"],["I don’t understand.","Eu não entendo."],["How much is this?","Quanto custa isto?"],["See you later!","Até mais tarde!"]]}
];
var C=[
{n:"No café",l:[["A","Hi! What can I get for you?","Oi! O que posso servir?"],["B","I’d like a coffee with milk, please.","Quero um café com leite, por favor."],["A","Sure. Anything else?","Claro. Mais alguma coisa?"],["B","No, that’s all. How much is it?","Não, é só isso. Quanto fica?"],["A","That’s four dollars.","São quatro dólares."],["B","Here you go. Thank you!","Aqui está. Obrigado!"]]},
{n:"Pedindo direção",l:[["A","Excuse me, how do I get to the station?","Com licença, como chego à estação?"],["B","Go straight and turn left at the bank.","Siga em frente e vire à esquerda no banco."],["A","Is it far from here?","É longe daqui?"],["B","No, it’s about five minutes on foot.","Não, uns cinco minutos a pé."],["A","Great, thanks for your help!","Ótimo, obrigado pela ajuda!"]]},
{n:"Conhecendo alguém",l:[["A","Hi, I’m Ana. Nice to meet you.","Oi, sou a Ana. Prazer."],["B","Nice to meet you too. I’m Tom.","Prazer também. Sou o Tom."],["A","Where are you from?","De onde você é?"],["B","I’m from Canada. And you?","Sou do Canadá. E você?"],["A","I’m from Brazil. I’m learning English.","Sou do Brasil. Estou aprendendo inglês."]]}
];
L=L.concat(window.EXTRA||[]);
var S={t:"l",lid:"dias",ci:0,q:null,slow:false,play:-1},K="speakdaily1";
function today(){return new Date().toISOString().slice(0,10)}
function load(){try{var d=JSON.parse(localStorage.getItem(K)||"{}");return d.day===today()?d:{day:today(),plays:0,right:0,convo:false}}catch(e){return{day:today(),plays:0,right:0,convo:false}}}
var P=load();
function save(){try{localStorage.setItem(K,JSON.stringify(P))}catch(e){}}
function voice(){var v=speechSynthesis.getVoices().filter(function(x){return /^en[-_]US/i.test(x.lang)});
return v.filter(function(x){return /google|natural|samantha|aaron|siri/i.test(x.name)})[0]||v[0]||null}
function say(t,count){return new Promise(function(res){
if(!("speechSynthesis" in window)){alert("Seu navegador não tem voz em inglês.");return res()}
speechSynthesis.cancel();var u=new SpeechSynthesisUtterance(t);u.lang="en-US";var v=voice();if(v)u.voice=v;u.rate=S.slow?.65:.95;
u.onend=u.onerror=function(){res()};speechSynthesis.speak(u);
if(count){P.plays++;save()}})}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;")}
function pairs(){var a=[];L.forEach(function(s){s.i.forEach(function(p){if(p[0].length<24)a.push(p)})});return a}
function newQ(){var a=pairs(),c=a[Math.floor(Math.random()*a.length)],o=[c];
while(o.length<3){var r=a[Math.floor(Math.random()*a.length)];if(o.indexOf(r)<0)o.push(r)}
o.sort(function(){return Math.random()-.5});S.q={c:c,o:o,a:null}}
function ctl(){return '<div class="ctl"><button class="chip" data-a="slow" aria-pressed="'+S.slow+'">Voz devagar</button><span>Voz nativa en-US do seu aparelho</span></div>'}
function view(){var h="";
if(S.t=="l"){var s=L.filter(function(x){return x.id==S.lid})[0];
h+='<h1>Lições</h1><p class="sub">Toque na frase para ouvir. Repita em voz alta.</p><div class="chips">'+L.map(function(x){return '<button class="chip" data-a="lid" data-v="'+x.id+'" aria-pressed="'+(x.id==S.lid)+'">'+x.n+'</button>'}).join("")+'</div>'+ctl();
s.i.forEach(function(p){h+='<div class="row"><button class="t" data-a="say" data-v="'+esc(p[0])+'"><span class="en">'+esc(p[0])+'</span><span class="pt">'+esc(p[1])+'</span></button></div>'})}
if(S.t=="c"){var c=C[S.ci];
h+='<h1>Conversas</h1><p class="sub">Ouça o diálogo e depois pratique os dois papéis.</p><div class="chips">'+C.map(function(x,i){return '<button class="chip" data-a="ci" data-v="'+i+'" aria-pressed="'+(i==S.ci)+'">'+x.n+'</button>'}).join("")+'</div>'+ctl()+'<p><button class="btn main" data-a="all">Ouvir tudo</button></p>';
c.l.forEach(function(l,i){h+='<button class="bub '+(l[0]=="B"?"b ":"")+(S.play==i?"on":"")+'" data-a="line" data-v="'+i+'"><small>'+l[0]+'</small><span class="en">'+esc(l[1])+'</span><span class="pt">'+esc(l[2])+'</span></button>'})}
if(S.t=="k"){var T=[["Ouvir 10 frases",P.plays,10],["Acertar 5 no quiz",P.right,5],["Ouvir uma conversa completa",P.convo?1:0,1]];
h+='<h1>Tarefas de hoje</h1><p class="sub">Elas reiniciam a cada dia.</p>';
T.forEach(function(t){var ok=t[1]>=t[2];h+='<div class="task '+(ok?"ok":"")+'"><span class="dot">'+(ok?"✓":"")+'</span><div style="flex:1"><b>'+t[0]+'</b><div class="bar"><i style="width:'+Math.min(100,t[1]/t[2]*100)+'%"></i></div></div><span class="pt">'+Math.min(t[1],t[2])+'/'+t[2]+'</span></div>'});
h+='<h2>Quiz: qual é o inglês?</h2>';if(!S.q)newQ();var q=S.q;
h+='<div class="q"><span class="pt">Português</span><div class="w">'+esc(q.c[1])+'</div>'+q.o.map(function(o,i){var cl="";if(q.a!==null){if(o===q.c)cl="ok";else if(i==q.a)cl="no"}return '<button class="opt '+cl+'" data-a="ans" data-v="'+i+'">'+esc(o[0])+'</button>'}).join("");
if(q.a!==null)h+='<button class="btn main" data-a="next">Próxima</button>';h+='</div>'}
document.getElementById("app").innerHTML=h;
document.querySelectorAll("nav button").forEach(function(b){b.setAttribute("aria-current",b.dataset.t==S.t?"page":"false")})}
document.addEventListener("click",function(e){var el=e.target.closest("[data-a],[data-t]");if(!el)return;
if(el.dataset.t){S.t=el.dataset.t;speechSynthesis.cancel();return view()}
var a=el.dataset.a,v=el.dataset.v;
if(a=="lid"){S.lid=v}else if(a=="ci"){S.ci=+v;S.play=-1}else if(a=="slow"){S.slow=!S.slow}
else if(a=="say"){say(v,true);return view()}
else if(a=="line"){S.play=+v;view();say(C[S.ci].l[+v][1],true).then(function(){S.play=-1;view()});return}
else if(a=="all"){(async function(){for(var i=0;i<C[S.ci].l.length;i++){S.play=i;view();await say(C[S.ci].l[i][1],false)}S.play=-1;P.convo=true;P.plays+=C[S.ci].l.length;save();view()})();return}
else if(a=="ans"&&S.q.a===null){S.q.a=+v;var ok=S.q.o[+v]===S.q.c;if(ok){P.right++;save()}say(S.q.c[0],false)}
else if(a=="next"){S.q=null}
view()});
if("speechSynthesis" in window)speechSynthesis.onvoiceschanged=function(){};
view();
