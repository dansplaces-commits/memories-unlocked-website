const menu=document.querySelector('.menu'),nav=document.querySelector('nav');menu?.addEventListener('click',()=>{const open=nav.style.display==='flex';nav.style.display=open?'none':'flex';if(!open){Object.assign(nav.style,{position:'absolute',top:'68px',left:'0',right:'0',background:'#08263e',padding:'25px',flexDirection:'column',alignItems:'center'})}});
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(id==='#')return;const el=document.querySelector(id);if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth'})}}));

const explainer=document.getElementById('explainer');
const exTitle=document.getElementById('explainerTitle');
const exCopy=document.getElementById('explainerCopy');
const exKicker=document.getElementById('explainerKicker');
const exVisual=document.getElementById('explainerVisual');
const exDots=document.getElementById('explainerDots');
const exProgress=document.getElementById('explainerProgress');
let exIndex=0,exTimer=null,exStarted=0,audioCtx=null,audioPulse=null;

const exScenes=[
  {k:'HOW IT WORKS',t:'Every place has a story.',c:'Follow the footsteps. Unlock the memories. Leave a trail worth following.',i:'✦',tone:523.25},
  {k:'STEP 1 OF 5',t:'Create a Journey',c:'Add a trip you’ve taken — or somewhere you dream of going.',i:'🗺️',tone:587.33},
  {k:'STEP 2 OF 5',t:'Pin a Place',c:'Drop a pin on the places that mattered most.',i:'📍',tone:659.25},
  {k:'STEP 3 OF 5',t:'Capture the Memory',c:'Add photos, stories and the moments you never want to lose.',i:'📷',tone:698.46},
  {k:'STEP 4 OF 5',t:'Leave a Clue',c:'Add a message, hint or challenge for the people who follow.',i:'🔑',tone:783.99},
  {k:'STEP 5 OF 5',t:'Follow the Footsteps',c:'Retrace the journey, unlock the story and continue the trail.',i:'👣',tone:880},
  {k:'YOUR LEGACY',t:'Your memories become a trail.',c:'A trail your family can rediscover, retrace and continue.',i:'↝',tone:987.77},
  {k:'MEMORIES UNLOCKED',t:'Every place has a story.',c:'Start yours.',i:'🔓',tone:1046.5}
];

function exBeep(freq=660,d=.11,vol=.035){
  try{
    audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();
    const o=audioCtx.createOscillator(),g=audioCtx.createGain();
    o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(vol,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+d);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+d);
  }catch(e){}
}
function exRender(i){
  exIndex=(i+exScenes.length)%exScenes.length;
  const s=exScenes[exIndex];
  exKicker.textContent=s.k;exTitle.textContent=s.t;exCopy.textContent=s.c;exVisual.innerHTML=`<span>${s.i}</span>`;
  exDots.innerHTML=exScenes.map((_,n)=>`<i class="${n===exIndex?'active':''}"></i>`).join('');
  exProgress.style.transition='none';exProgress.style.width='0%';requestAnimationFrame(()=>requestAnimationFrame(()=>{exProgress.style.transition='width 4.8s linear';exProgress.style.width='100%'}));
  exVisual.classList.remove('pop');void exVisual.offsetWidth;exVisual.classList.add('pop');
  exBeep(s.tone);
}
function exAdvance(){exRender(exIndex+1);if(exIndex===exScenes.length-1){clearInterval(exTimer);exTimer=null}}
function exPlay(from=0){clearInterval(exTimer);exRender(from);exStarted=Date.now();exTimer=setInterval(exAdvance,5000)}
function exOpen(){
  explainer.classList.add('open');explainer.setAttribute('aria-hidden','false');document.body.classList.add('video-opened');exPlay(0);
}
function exClose(){
  clearInterval(exTimer);exTimer=null;explainer.classList.remove('open');explainer.setAttribute('aria-hidden','true');document.body.classList.remove('video-opened');
}
document.querySelectorAll('[data-video-open]').forEach(b=>b.addEventListener('click',exOpen));
document.querySelectorAll('[data-video-close]').forEach(b=>b.addEventListener('click',exClose));
document.querySelector('[data-video-replay]')?.addEventListener('click',()=>exPlay(0));
document.querySelector('[data-video-next]')?.addEventListener('click',exAdvance);
explainer?.addEventListener('click',e=>{if(e.target===explainer)exClose()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&explainer?.classList.contains('open'))exClose()});
