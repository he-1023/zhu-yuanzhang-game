/* =========================================================
   朱元璋的一生 · 像素史诗
   主程序：场景 / 剧情 / 对话 / 探索
   ========================================================= */
'use strict';

const $=id=>document.getElementById(id);
const W=640, H=360, MAX_STAT=5;

const canvas=$('game');
const ctx=canvas.getContext('2d');
ctx.imageSmoothingEnabled=false;

const UI={
  stage:$('stage'), game:canvas, sceneTint:$('sceneTint'),
  hud:$('hud'), chapterLabel:$('chapterLabel'), placeLabel:$('placeLabel'),
  objectiveBox:$('objectiveBox'), objectiveText:$('objectiveText'),
  minxinPips:$('minxinPips'), weiwangPips:$('weiwangPips'),
  muteBtn:$('muteBtn'),
  titleScreen:$('titleScreen'), titleMenu:$('titleMenu'),
  chapterCard:$('chapterCard'), ccSeal:$('ccSeal'), ccKicker:$('ccKicker'), ccTitle:$('ccTitle'), ccSub:$('ccSub'),
  dialogueBox:$('dialogueBox'), portrait:$('portrait'), speakerName:$('speakerName'), speakerTitle:$('speakerTitle'), dialogueText:$('dialogueText'),
  choiceBox:$('choiceBox'), choicePrompt:$('choicePrompt'), choiceList:$('choiceList'),
  deployScreen:$('deployScreen'), deployKicker:$('deployKicker'), deploySub:$('deploySub'),
  allyCount:$('allyCount'), enemyCount:$('enemyCount'), planCards:$('planCards'), deployConfirm:$('deployConfirm'),
  battleHud:$('battleHud'), hpFill:$('hpFill'), hpText:$('hpText'), battleObjective:$('battleObjective'),
  bannerPips:$('bannerPips'), specialBox:$('specialBox'), specialName:$('specialName'),
  specialState:$('specialState'), specialFill:$('specialFill'), troopText:$('troopText'),
  battleBanner:$('battleBanner'),
  defeatScreen:$('defeatScreen'), retryBtn:$('retryBtn'), backTitleBtn:$('backTitleBtn'),
  endingScreen:$('endingScreen'), endingKicker:$('endingKicker'), endingSeal:$('endingSeal'),
  endingTitle:$('endingTitle'), endingDesc:$('endingDesc'), endingStats:$('endingStats'),
  endingTimeline:$('endingTimeline'), endingQuote:$('endingQuote'), restartBtn:$('restartBtn'),
  helpModal:$('helpModal'), helpClose:$('helpClose'),
  cinematic:$('cinematic'), cinematicLines:$('cinematicLines'),
  toast:$('toast'), fade:$('fade'), flash:$('flash'),
  touchControls:$('touchControls')
};

const keys=new Set();
const S={
  mode:'title', titleVisible:true, starting:false,
  chapter:0, stats:{minxin:0,weiwang:0}, flags:{}, outfit:'boy',
  scene:null, sceneTime:0, particles:[], nearest:null, objective:'',
  player:{x:320,y:300,dir:'up',walk:0,walkDist:0,stepTimer:0},
  dialogue:null, choice:null, deploy:null, chapterCard:null,
  battle:null, defeat:null,
  shakeTime:0, shakeDur:0, shakeMag:0,
  titleIndex:0, helpFrom:'title', touch:false,
  cinematicActive:false, ending:false, lastTime:0, hintTime:0
};

const CHAPTER_META={
  1:{label:'第一章',cn:'壹'},
  2:{label:'第二章',cn:'贰'},
  3:{label:'第三章',cn:'叁'},
  4:{label:'第四章',cn:'肆'},
  5:{label:'第五章',cn:'伍'}
};

const SPEAKERS={
  '朱元璋':{title:()=>S.outfit==='boy'?'放牛娃':S.outfit==='monk'?'行脚僧':S.outfit==='redSoldier'?'红巾军':S.outfit==='emperor'?'洪武皇帝':'吴王'},
  '汤和':{style:'friend',title:'儿时伙伴'},
  '刘继祖':{style:'farmer',title:'乡邻'},
  '朱五四':{style:'farmer',title:'父亲'},
  '陈氏':{style:'woman',title:'母亲'},
  '老僧':{style:'oldMonk',title:'皇觉寺住持'},
  '信使':{style:'messenger',title:'红巾军信使'},
  '郭子兴':{style:'guo',title:'红巾军元帅'},
  '马秀英':{style:'woman',title:()=>S.chapter>=5?'大明皇后':'郭府义女'},
  '徐达':{style:'xu',title:'红巾军将领'},
  '刘伯温':{style:'liu',title:'军师'},
  '李善长':{style:'li',title:'谋士'},
  '陈友谅':{style:'chen',title:'汉王'},
  '元将':{style:'yuanSoldier',title:'元军守将'},
  '旁白':{style:'narrator',title:'洪武纪事'}
};

/* =========================================================
   基础工具
   ========================================================= */
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const L=(speaker,text)=>({speaker,text});

function fitStage(){
  const s=Math.min(window.innerWidth/1280,window.innerHeight/720);
  UI.stage.style.transform=`translate(-50%,-50%) scale(${s})`;
}

function addShake(dur=.25,mag=4){
  S.shakeTime=Math.max(S.shakeTime,dur);
  S.shakeDur=Math.max(S.shakeDur,dur);
  S.shakeMag=Math.max(S.shakeMag,mag);
}

function flashScreen(){
  UI.flash.classList.add('on');
  setTimeout(()=>UI.flash.classList.remove('on'),80);
}

function showToast(text,duration=1900){
  UI.toast.textContent=text;
  UI.toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t=setTimeout(()=>UI.toast.classList.remove('show'),duration);
}

function setHudVisible(v){
  UI.hud.classList.toggle('hidden',!v);
}

function setObjective(text){
  S.objective=text||'';
  UI.objectiveText.textContent=S.objective;
  UI.objectiveBox.classList.toggle('hidden',!S.objective);
}

function renderStats(){
  const build=(el,val,wei)=>{
    el.innerHTML='';
    for(let i=0;i<MAX_STAT;i++){
      const pip=document.createElement('i');
      if(i<val)pip.className='on';
      el.appendChild(pip);
    }
    el.classList.toggle('wei',!!wei);
  };
  build(UI.minxinPips,S.stats.minxin,false);
  build(UI.weiwangPips,S.stats.weiwang,true);
}

function addStat(key,amount,label){
  if(!amount)return;
  const names={minxin:'民心',weiwang:'威望'};
  const before=S.stats[key]||0;
  S.stats[key]=clamp(before+amount,0,MAX_STAT);
  const gained=S.stats[key]-before;
  renderStats();
  if(gained>0){
    showToast(label||`${names[key]} +${gained}`);
    Sfx.sfx('confirm');
  }
}

function applyEffects(effect,label){
  if(!effect)return;
  let gained=[];
  for(const [k,v] of Object.entries(effect)){
    if(k==='minxin'||k==='weiwang'){
      const before=S.stats[k];
      S.stats[k]=clamp(before+v,0,MAX_STAT);
      const g=S.stats[k]-before;
      if(g>0)gained.push({k,label:k==='minxin'?'民心':'威望',v:g});
    }
  }
  renderStats();
  if(gained.length){
    Sfx.sfx('confirm');
    showToast(`${label||''}${label?' · ':''}${gained.map(g=>`${g.label} +${g.v}`).join('　')}`);
  }
}

function saveGame(){
  try{
    localStorage.setItem('zhu_life_save_v1',JSON.stringify({
      chapter:S.chapter,
      stats:{...S.stats},
      date:Date.now()
    }));
  }catch(e){}
  refreshContinue();
}

function readSave(){
  try{
    const raw=localStorage.getItem('zhu_life_save_v1');
    if(!raw)return null;
    const data=JSON.parse(raw);
    if(!data||!data.chapter||data.chapter<1||data.chapter>5)return null;
    return {
      chapter:data.chapter,
      stats:{
        minxin:clamp(Number(data.stats&&data.stats.minxin)||0,0,MAX_STAT),
        weiwang:clamp(Number(data.stats&&data.stats.weiwang)||0,0,MAX_STAT)
      }
    };
  }catch(e){return null;}
}

function refreshContinue(){
  const btn=document.querySelector('.menu-item[data-action="continue"]');
  if(!btn)return;
  const save=readSave();
  if(save){
    btn.classList.remove('disabled');
    const small=btn.querySelector('small');
    if(small)small.textContent=`第 ${save.chapter} 章`;
  }else{
    btn.classList.add('disabled');
    const small=btn.querySelector('small');
    if(small)small.textContent='NO SAVE';
  }
}

function refreshMute(){
  UI.muteBtn.classList.toggle('muted',Sfx.muted);
  UI.muteBtn.textContent=Sfx.muted?'静':'音';
  UI.muteBtn.setAttribute('aria-label',Sfx.muted?'开启声音':'关闭声音');
}

/* =========================================================
   音频 / 画面过渡
   ========================================================= */
function fadeOut(ms=480){
  UI.fade.classList.add('on');
  return wait(ms);
}
async function fadeIn(ms=520){
  UI.fade.classList.add('on');
  await wait(30);
  UI.fade.classList.remove('on');
  await wait(ms);
}

async function cinematicText(lines,per=1750){
  const prev=S.mode;
  S.mode='cinematic';
  S.cinematicActive=true;
  setHudVisible(false);
  syncTouch();
  UI.fade.classList.remove('on');
  UI.cinematic.classList.remove('hidden');
  UI.cinematicLines.className='cinematic-lines';
  UI.cinematicLines.textContent='';
  await wait(80);
  for(let i=0;i<lines.length;i++){
    UI.cinematicLines.classList.remove('show');
    UI.cinematicLines.classList.add('dim');
    await wait(120);
    UI.cinematicLines.textContent=lines[i];
    UI.cinematicLines.classList.remove('dim');
    void UI.cinematicLines.offsetWidth;
    UI.cinematicLines.classList.add('show');
    if(i===0)Sfx.sfx('bell');
    await wait(per);
  }
  UI.cinematicLines.classList.remove('show');
  await wait(380);
  UI.cinematic.classList.add('hidden');
  S.cinematicActive=false;
  S.mode=prev;
}

/* =========================================================
   章节卡 / 对话 / 抉择
   ========================================================= */
function chapterCard(num,title,sub){
  return new Promise(resolve=>{
    if(S.chapterCard)return;
    const meta=CHAPTER_META[num]||{label:`第${num}章`,cn:'壹'};
    S.mode='chapter';
    UI.ccSeal.textContent=meta.cn;
    UI.ccKicker.textContent=meta.label;
    UI.ccTitle.textContent=title;
    UI.ccSub.textContent=sub||'';
    UI.chapterCard.classList.remove('hidden','out');
    void UI.chapterCard.offsetWidth;
    const timer=setTimeout(()=>finishChapterCard(),2300);
    S.chapterCard={resolve,timer,closing:false};
  });
}

function finishChapterCard(){
  const cc=S.chapterCard;
  if(!cc||cc.closing)return;
  cc.closing=true;
  clearTimeout(cc.timer);
  UI.chapterCard.classList.add('out');
  setTimeout(()=>{
    UI.chapterCard.classList.add('hidden');
    UI.chapterCard.classList.remove('out');
    S.chapterCard=null;
    S.mode='cutscene';
    cc.resolve();
  },480);
}

function speakerInfo(name){
  const info=SPEAKERS[name]||{};
  return {
    style:name==='朱元璋'?S.outfit:(info.style||'boy'),
    title:typeof info.title==='function'?info.title():(info.title||''),
    name
  };
}

function renderDialogueLine(){
  const d=S.dialogue;
  if(!d)return;
  const line=d.lines[d.index];
  const info=speakerInfo(line.speaker||'旁白');
  UI.speakerName.textContent=info.name;
  UI.speakerTitle.textContent=info.title;
  Art.drawPortrait(UI.portrait,info.style);
  UI.dialogueText.textContent='';
  d.chars=0;
  d.typing=true;
  d.blipAcc=0;
  UI.dialogueBox.classList.remove('hidden');
  Sfx.sfx('talk');
}

function say(lines){
  if(typeof lines==='string')lines=[L('旁白',lines)];
  if(!Array.isArray(lines)||!lines.length)return Promise.resolve();
  return new Promise(resolve=>{
    const prev=S.mode;
    S.mode='dialogue';
    S.dialogue={lines,index:0,resolve,prev,chars:0,typing:true,blipAcc:0};
    renderDialogueLine();
    syncTouch();
  });
}

function finishDialogue(){
  const d=S.dialogue;
  if(!d)return;
  UI.dialogueBox.classList.add('hidden');
  S.dialogue=null;
  S.mode=d.prev;
  Sfx.sfx('ui');
  syncTouch();
  d.resolve();
}

function advanceDialogue(){
  const d=S.dialogue;
  if(!d)return;
  const line=d.lines[d.index];
  const full=String(line.text||'');
  if(d.typing){
    d.typing=false;
    d.chars=full.length;
    UI.dialogueText.textContent=full;
    return;
  }
  d.index++;
  if(d.index>=d.lines.length){
    finishDialogue();
  }else{
    renderDialogueLine();
  }
}

function updateDialogue(dt){
  const d=S.dialogue;
  if(!d||!d.typing)return;
  const line=d.lines[d.index];
  const full=String(line.text||'');
  d.chars+=dt*54;
  const n=Math.min(full.length,Math.floor(d.chars));
  UI.dialogueText.textContent=full.slice(0,n);
  d.blipAcc+=dt;
  if(d.blipAcc>.11&&n<full.length){
    d.blipAcc=0;
    Sfx.sfx('talk');
  }
  if(n>=full.length){
    d.typing=false;
    UI.dialogueText.textContent=full;
  }
}

function choose(prompt,options){
  return new Promise(resolve=>{
    const prev=S.mode;
    S.mode='choice';
    S.choice={prompt,options,index:0,resolve,prev};
    UI.choicePrompt.textContent=prompt;
    renderChoices();
    UI.choiceBox.classList.remove('hidden');
    syncTouch();
  });
}

function renderChoices(){
  const c=S.choice;
  if(!c)return;
  UI.choiceList.innerHTML='';
  c.options.forEach((opt,i)=>{
    const btn=document.createElement('button');
    btn.className='choice-option'+(i===c.index?' selected':'');
    btn.type='button';
    const idx=['甲','乙','丙','丁'][i]||String(i+1);
    btn.innerHTML=`<span class="choice-index">${idx}</span><span class="choice-copy"><b></b><small></small></span>`;
    btn.querySelector('b').textContent=opt.label||'';
    btn.querySelector('small').textContent=opt.sub||'';
    btn.addEventListener('click',e=>{
      e.stopPropagation();
      if(S.mode!=='choice'||!S.choice)return;
      S.choice.index=i;
      renderChoices();
      confirmChoice();
    });
    UI.choiceList.appendChild(btn);
  });
}

function confirmChoice(){
  const c=S.choice;
  if(!c)return;
  const opt=c.options[c.index];
  UI.choiceBox.classList.add('hidden');
  S.choice=null;
  S.mode=c.prev;
  applyEffects(opt.effect,opt.label);
  Sfx.sfx('confirm');
  syncTouch();
  c.resolve(opt.value!==undefined?opt.value:opt.label);
}

/* =========================================================
   点将出征
   ========================================================= */
function choosePlan(config){
  return new Promise(resolve=>{
    const prev=S.mode;
    S.mode='deploy';
    S.deploy={config,index:0,resolve,prev};
    setHudVisible(false);
    UI.deployKicker.textContent=config.kicker||'战 前 谋 划';
    UI.deploySub.textContent=config.sub||'选择一条破敌之策';
    UI.allyCount.textContent=config.allyLabel||'我 军';
    UI.enemyCount.textContent=config.enemyLabel||'敌 军';
    renderPlanCards();
    UI.deployScreen.classList.remove('hidden');
    syncTouch();
    Sfx.sfx('confirm');
  });
}

function renderPlanCards(){
  const d=S.deploy;
  if(!d)return;
  UI.planCards.innerHTML='';
  d.config.plans.forEach((plan,i)=>{
    const card=document.createElement('button');
    card.type='button';
    card.className='plan-card'+(i===d.index?' selected':'');
    card.innerHTML=`
      <div class="plan-seal">${plan.icon||'策'}</div>
      <h3></h3>
      <div class="plan-en"></div>
      <p></p>
      <div class="plan-tags"></div>`;
    card.querySelector('h3').textContent=plan.label;
    card.querySelector('.plan-en').textContent=plan.en||'STRATAGEM';
    card.querySelector('p').textContent=plan.desc||'';
    const tags=card.querySelector('.plan-tags');
    (plan.tags||[]).forEach(tag=>{
      const sp=document.createElement('span');
      sp.className='plan-tag';sp.textContent=tag;tags.appendChild(sp);
    });
    card.addEventListener('click',()=>{
      if(S.mode!=='deploy'||!S.deploy)return;
      S.deploy.index=i;
      renderPlanCards();
      Sfx.sfx('ui');
    });
    UI.planCards.appendChild(card);
  });
}

function confirmDeploy(){
  const d=S.deploy;
  if(!d)return;
  const plan=d.config.plans[d.index];
  UI.deployScreen.classList.add('hidden');
  S.deploy=null;
  S.mode=d.prev;
  applyEffects(plan.effect,plan.label);
  Sfx.sfx('confirm');
  syncTouch();
  d.resolve(plan);
}

/* =========================================================
   玩家 / 场景
   ========================================================= */
function makeScene(id,place,tint){
  return {
    id,place,tint:tint||'rgba(0,0,0,0)',chapter:S.chapter,
    spawn:{x:320,y:300},bounds:{x:20,y:76,w:600,h:270},
    props:[],solids:[],npcs:[],objects:[],ground:()=>{}
  };
}

function addProp(sc,baseY,draw,solid){
  sc.props.push({baseY,draw});
  if(!solid)return;
  if(Array.isArray(solid))sc.solids.push(...solid);
  else sc.solids.push(solid);
}

function addNpc(sc,opts){
  const npc=Object.assign({
    dir:'down',r:31,label:'交谈',vis:()=>true,style:'farmer'
  },opts);
  sc.npcs.push(npc);
  return npc;
}

function addObject(sc,obj){
  obj.vis=obj.vis||(()=>true);
  obj.r=obj.r||30;
  sc.objects.push(obj);
  return obj;
}