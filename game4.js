const NIGHT_RAID_CONFIG={
  id:'nightRaid',kind:'land',title:'夜袭元营',
  kicker:'第 三 章 · 初 露 锋 芒',
  sub:'三百红巾，趁夜反劫元军大营。',
  allyLabel:'红巾锐士 · 三百',
  enemyLabel:'元军守营 · 数千',
  playerHp:130,
  special:'roar',specialName:'战吼',
  maxEnemies:8,
  banners:[
    {x:126,y:116,hp:130,emblem:'元'},
    {x:320,y:102,hp:140,emblem:'元'},
    {x:514,y:118,hp:130,emblem:'元'}
  ],
  boss:{x:320,y:108,hp:250,name:'元将 · 帖木儿',style:'yuanSoldier'},
  spawnPoints:[[90,104],[320,96],[550,104],[190,112],[450,108]],
  allyCount:10,
  plans:[
    {icon:'火',label:'火攻破营',en:'FIRE RAID',desc:'先掷火把，烧乱元军马厩。火光一起，敌军自乱。',tags:['绝技威力 +35%','绝技冷却 -1 秒'],effect:{weiwang:1},mods:{specialPower:1.35,specialCd:-1}},
    {icon:'锋',label:'三路强攻',en:'ALL-OUT',desc:'分三路同时突入，以最快速度凿穿敌营。不给自己留退路。',tags:['主帅攻击 +5','部曲攻击 +2'],effect:{weiwang:1},mods:{heroAtk:5,allyAtk:2}},
    {icon:'围',label:'围三阙一',en:'OPEN GATE',desc:'放开北面缺口，只烧南面粮草。敌军无心死战，自会溃散。',tags:['敌军体力 -15%','敌将增援 -2'],effect:{minxin:1},mods:{enemyHp:.85,maxEnemies:-2}}
  ]
};

async function startNightRaid(){
  if(S.flags.raidStarted)return;
  S.flags.raidStarted=true;
  S.mode='cutscene';
  const plan=await choosePlan(NIGHT_RAID_CONFIG);
  if(!plan)return;
  await say([
    L('朱元璋','众军听令——'),
    L('朱元璋','今夜，只许向前，不许回头。'),
    L('旁白','火把次第亮起。三百人压低身子，没入夜色。')
  ]);
  S.mode='cutscene';
  await fadeOut(500);
  const won=await playBattle(Object.assign({},NIGHT_RAID_CONFIG,{plan}));
  if(won)await chapter3Victory();
}

async function chapter3Victory(){
  S.flags.ch3Won=true;
  S.mode='cutscene';
  setHudVisible(false);
  setObjective('');
  Sfx.setMusic('explore');
  await fadeOut(550);
  setScene('camp',{spawn:{x:320,y:292}});
  S.scene.tint='rgba(66,28,10,.18)';
  UI.sceneTint.style.background=S.scene.tint;
  await fadeIn(600);
  await say([
    L('旁白','天将破晓。'),
    L('郭子兴','一夜破三营！好一个朱元璋！'),
    L('朱元璋','大帅，元军粮草已尽。'),
    L('郭子兴','好，好！从今日起，你领一营兵马。'),
    L('马秀英','把手伸出来。'),
    L('朱元璋','一点小伤。'),
    L('马秀英','骗人。'),
    L('旁白','她低头替你包扎，发丝扫过手背。火堆噼啪作响。'),
    L('旁白','至正十二年，你娶了马姑娘。'),
    L('旁白','没有凤冠霞帔，只有一床旧被，两碗热粥。'),
    L('马秀英','往后，我陪你走。'),
    L('朱元璋','好。')
  ]);
  await wait(350);
  await startChapter4();
}

/* =========================================================
   剧情：第四章
   ========================================================= */
async function startChapter4(){
  S.chapter=4;S.outfit='general';S.flags={};saveGame();renderStats();
  S.mode='cutscene';setHudVisible(false);setObjective('');
  Sfx.setMusic('explore');
  await fadeOut(480);
  setScene('warRoom');
  await chapterCard(4,'鄱阳烽火','元至正二十三年 · 应天');
  await fadeIn(520);
  await say([
    L('旁白','至正二十三年，应天帅帐。'),
    L('刘伯温','陈友谅倾国而来，号称六十万。巨舰相连，蔽江而下。'),
    L('徐达','我军舟小。若正面硬冲，是以卵击石。'),
    L('刘伯温','巨舰相连，最怕火。'),
    L('朱元璋','传令，把所有火船都调上来。')
  ]);
  const strategy=await choose('六十万大军压境。这一仗，怎么打？',[
    {label:'以火破敌',sub:'火烧连环船，一战定乾坤。',value:'fire',effect:{weiwang:1},toast:'火攻定策'},
    {label:'诱敌深入',sub:'弃小城，拉长敌阵，再断其粮道。',value:'lure',effect:{minxin:1},toast:'以退为进'},
    {label:'亲率死士',sub:'主帅先登，以命搏命。',value:'lead',effect:{weiwang:2},toast:'身先士卒'}
  ]);
  S.flags.strategy=strategy;
  S.flags.strategyChosen=true;
  if(strategy==='fire'){
    await say([
      L('刘伯温','火借风势，可烧他个樯橹灰飞。'),
      L('朱元璋','传令，火船列阵。'),
      L('徐达','末将愿为先锋。')
    ]);
  }else if(strategy==='lure'){
    await say([
      L('刘伯温','主公能忍，将士便能胜。'),
      L('朱元璋','把洪都让给他。他船大，进退不便。'),
      L('徐达','等他粮尽，我们再收网。')
    ]);
  }else{
    await say([
      L('徐达','不可！主公万金之躯——'),
      L('朱元璋','万金之躯，也是从死人堆里爬出来的。'),
      L('徐达','……若主公执意，臣愿为先锋。')
    ]);
  }
  setObjective('在帅帐案前，定下出征之计');
  beginExplore();
}

async function openPoyangBattle(){
  if(S.mode!=='explore')return;
  if(!S.flags.strategyChosen){
    await say([L('刘伯温','主公，先定大略，再谈刀兵。')]);
    return;
  }
  if(S.flags.poyangStarted)return;
  S.flags.poyangStarted=true;
  S.mode='cutscene';
  const plan=await choosePlan(POYANG_CONFIG);
  if(!plan)return;
  await say([
    L('朱元璋','点火。'),
    L('旁白','一百二十艘火船顺风而下。湖面被火光照得如同白昼。')
  ]);
  S.mode='cutscene';
  await fadeOut(500);
  const won=await playBattle(Object.assign({},POYANG_CONFIG,{plan}));
  if(won)await chapter4Victory();
}

const POYANG_CONFIG={
  id:'poyang',kind:'water',title:'鄱阳湖决战',
  kicker:'第 四 章 · 问 鼎 天 下',
  sub:'六十万汉军蔽江而来。火船已备，只待东风。',
  allyLabel:'大明水师 · 二十万',
  enemyLabel:'汉军 · 六十万',
  playerHp:145,
  special:'fire',specialName:'火攻',
  maxEnemies:10,
  banners:[
    {x:126,y:126,hp:180,emblem:'汉'},
    {x:320,y:106,hp:195,emblem:'汉'},
    {x:514,y:128,hp:180,emblem:'汉'}
  ],
  boss:{x:320,y:112,hp:380,name:'汉王 · 陈友谅',style:'chen'},
  spawnPoints:[[84,112],[230,108],[410,108],[556,112],[320,100]],
  allyCount:11,
  plans:[
    {icon:'火',label:'火船突袭',en:'FIRE SHIPS',desc:'以火船撞入敌阵，借风纵火。烈焰一起，巨舰便成焦土。',tags:['火攻威力 +40%','绝技冷却 -2 秒'],effect:{weiwang:1},mods:{specialPower:1.4,specialCd:-2}},
    {icon:'舟',label:'铁索连舟',en:'CHAINED FLEET',desc:'以铁索连接战船，稳如城垒。先立于不败，再图取胜。',tags:['主帅生命 +40','部曲生命 +30%'],effect:{minxin:1},mods:{hpBonus:40,allyHpMul:1.3}},
    {icon:'波',label:'分波扰敌',en:'SPLIT WAVES',desc:'小舟四散，轮番骚扰。让六十万大军，在湖面上疲于奔命。',tags:['敌军数量 -2','主帅移速 +15%'],effect:{minxin:1,weiwang:1},mods:{maxEnemies:-2,speedMul:1.15,enemyHp:.92}}
  ]
};

async function chapter4Victory(){
  S.flags.ch4Won=true;
  S.mode='cutscene';
  setHudVisible(false);
  setObjective('');
  Sfx.setMusic('throne');
  await fadeOut(600);
  await cinematicText([
    '湖水被火光烧成了赤色。',
    '陈友谅中箭身亡，六十万大军土崩瓦解。',
    '至正二十七年，徐达、常遇春率军北伐。',
    '次年八月，明军攻入大都。元帝北逃，元朝覆灭。'
  ],1700);
  await startChapter5();
}

/* =========================================================
   剧情：第五章 / 结局
   ========================================================= */
async function startChapter5(){
  S.chapter=5;S.outfit='emperor';S.flags={};saveGame();renderStats();
  S.mode='cutscene';setHudVisible(false);setObjective('');
  Sfx.setMusic('throne');
  await fadeOut(480);
  setScene('throne');
  await chapterCard(5,'洪武元年','公元 1368 年 · 应天');
  await fadeIn(600);
  await say([
    L('旁白','洪武元年，正月初四。应天，奉天殿。'),
    L('马秀英','重八，你看。这天下，终于太平了。'),
    L('朱元璋','秀英，从钟离到奉天殿，我们走了二十四年。'),
    L('马秀英','去吧。文武百官，都在等你。'),
    L('旁白','大殿之外，钟鼓齐鸣。你抬头，看见万里晴空。')
  ]);
  setObjective('走上丹陛，登基称帝');
  beginExplore();
}

async function ascendThrone(){
  if(S.mode!=='explore'||S.flags.ascended)return;
  S.flags.ascended=true;
  S.mode='cutscene';
  setHudVisible(false);
  setObjective('');
  await say([
    L('旁白','你整理冕服，一步一步，走上丹陛。'),
    L('刘伯温','请陛下定国号、建元。'),
    L('朱元璋','国号——大明。'),
    L('朱元璋','纪元——洪武。'),
    L('刘伯温','日月重开，天下更始。')
  ]);
  const priority=await choose('洪武之治，你首先看重什么？',[
    {label:'重农桑，轻徭役',sub:'让百姓先吃饱饭。',value:'farm',effect:{minxin:2},toast:'与民休息'},
    {label:'整吏治，肃贪腐',sub:'元以宽失天下，当以严明治吏。',value:'law',effect:{weiwang:2},toast:'铁腕治吏'},
    {label:'修武备，固边防',sub:'边关未靖，大明要有犁，也要有剑。',value:'army',effect:{minxin:1,weiwang:1},toast:'文武并重'}
  ]);
  S.flags.priority=priority;
  if(priority==='farm'){
    await say([
      L('朱元璋','朕起于田亩，知道一亩田、一碗饭，比什么祥瑞都重。'),
      L('朱元璋','天下新定，先让百姓喘一口气。'),
      L('刘伯温','陛下圣明。')
    ]);
  }else if(priority==='law'){
    await say([
      L('朱元璋','元以宽失天下。朕要以严明治吏，让百姓有冤可诉。'),
      L('朱元璋','贪官污吏，朕一个也不饶。'),
      L('旁白','殿上文武，齐齐屏住了呼吸。')
    ]);
  }else{
    await say([
      L('朱元璋','边关未靖。大明要有犁，也要有剑。'),
      L('朱元璋','百姓要能种田，边关也要能御敌。'),
      L('徐达','臣愿为大明守边，万死不辞。')
    ]);
  }
  await say([
    L('旁白','百官跪伏，山呼万岁。'),
    L('旁白','你坐在龙椅上，忽然想起很多年前，钟离的那场大雪。'),
    L('朱元璋','……朕，知道了。')
  ]);
  await fadeOut(650);
  await cinematicText([
    '洪武元年正月初四，你即皇帝位。',
    '国号大明，建元洪武。',
    '三十一年后，洪武三十一年，你走完了这一生。',
    '史书只写了寥寥数笔。',
    '可这一路的风雪，只有你自己知道。'
  ],1650);
  UI.fade.classList.add('on');
  await wait(450);
  await showEnding();
}

async function showEnding(){
  const mx=S.stats.minxin,wy=S.stats.weiwang;
  let title='布衣天子';
  if(mx>=4&&wy>=4)title='洪武大帝';
  else if(mx>=wy+2)title='仁德天子';
  else if(wy>=mx+2)title='铁血洪武';
  let desc='你起于布衣，提三尺剑，平群雄，驱胡元，终登大宝。';
  if(S.flags.priority==='farm'||mx>=4)desc+='你轻徭薄赋，劝课农桑，让百姓从战火里喘过一口气。';
  if(S.flags.priority==='law'||wy>=4)desc+='你整肃吏治，铁腕治贪，朝堂为之震栗。';
  if(S.flags.priority==='army')desc+='你修武备、固边防，为大明打下二百七十六年的山河骨架。';
  const quotes={
    farm:'「朕本淮右布衣，天下于我何加焉。」',
    law:'「吾治乱世，刑不得不重。」',
    army:'「驱逐胡虏，恢复中华，立纲陈纪，救济斯民。」'
  };
  UI.endingKicker.textContent='洪武三十一年 · 公元 1398 年';
  UI.endingSeal.textContent='明';
  UI.endingTitle.textContent=title;
  UI.endingDesc.textContent=desc;
  UI.endingStats.innerHTML=`
    <div class="es-item"><span>民心</span><b>${mx}</b><small>/ ${MAX_STAT}</small></div>
    <div class="es-item"><span>威望</span><b>${wy}</b><small>/ ${MAX_STAT}</small></div>
    <div class="es-item"><span>在位</span><b>三十一年</b></div>
    <div class="es-item"><span>享年</span><b>七十一岁</b></div>`;
  const timeline=[
    ['壹','1344','钟离饥荒','放牛娃朱重八'],
    ['贰','1352','投奔红巾','从军，改名元璋'],
    ['叁','1368','应天称帝','国号大明，建元洪武'],
    ['肆','1398','洪武驾崩','葬于孝陵']
  ];
  UI.endingTimeline.innerHTML=timeline.map(t=>`
    <div class="et-item"><div class="et-dot"><span>${t[0]}</span></div><b>${t[1]} · ${t[2]}</b><small>${t[3]}</small></div>
  `).join('');
  UI.endingQuote.textContent=quotes[S.flags.priority]||quotes.farm;
  S.mode='ending';
  S.ending=true;
  setHudVisible(false);
  syncTouch();
  Sfx.setMusic('ending');
  UI.endingScreen.classList.remove('hidden');
  await wait(80);
  UI.fade.classList.remove('on');
  await wait(700);
}

/* =========================================================
   标题 / 初始化
   ========================================================= */
function setTitleSelection(i){
  const items=[...document.querySelectorAll('.menu-item')];
  if(!items.length)return;
  S.titleIndex=(i+items.length)%items.length;
  items.forEach((el,idx)=>el.classList.toggle('selected',idx===S.titleIndex));
}

async function startNewGame(){
  if(S.starting)return;
  S.starting=true;
  Sfx.unlock();
  Sfx.sfx('confirm');
  S.titleVisible=false;
  UI.titleScreen.classList.add('hidden');
  S.stats={minxin:0,weiwang:0};
  S.flags={};
  S.chapter=1;
  S.outfit='boy';
  renderStats();
  await startChapter1();
  S.starting=false;
}

async function continueGame(){
  const save=readSave();
  if(!save)return;
  Sfx.unlock();
  Sfx.sfx('confirm');
  S.titleVisible=false;
  UI.titleScreen.classList.add('hidden');
  S.stats=save.stats;
  S.flags={};
  S.chapter=save.chapter;
  S.outfit=S.chapter===1?'boy':S.chapter===2?'monk':S.chapter===3?'redSoldier':S.chapter===4?'general':'emperor';
  renderStats();
  if(S.chapter===1)await startChapter1();
  else if(S.chapter===2)await startChapter2();
  else if(S.chapter===3)await startChapter3();
  else if(S.chapter===4)await startChapter4();
  else await startChapter5();
}

function openHelp(){
  if(S.mode==='cinematic'||S.mode==='ending'||S.mode==='battle'||S.mode==='defeat')return;
  S.helpFrom=S.mode;
  S.mode='help';
  UI.helpModal.classList.remove('hidden');
  Sfx.sfx('ui');
  syncTouch();
}

function closeHelp(){
  UI.helpModal.classList.add('hidden');
  S.mode=S.helpFrom||'title';
  Sfx.sfx('ui');
  syncTouch();
}

function handleTitleAction(action){
  if(action==='new'){
    startNewGame();
  }else if(action==='continue'){
    const save=readSave();
    if(save)continueGame();
    else showToast('还没有旧梦可以续写');
  }else if(action==='help'){
    openHelp();
  }
}

function handleKeyPress(code){
  if(code==='Escape'&&S.mode==='help'){
    closeHelp();return;
  }
  if(S.mode==='title'){
    if(code==='ArrowUp'||code==='KeyW'){setTitleSelection(S.titleIndex-1);Sfx.sfx('ui');}
    else if(code==='ArrowDown'||code==='KeyS'){setTitleSelection(S.titleIndex+1);Sfx.sfx('ui');}
    else if(code==='Enter'||code==='Space'||code==='KeyZ'){
      const items=[...document.querySelectorAll('.menu-item')];
      const item=items[S.titleIndex];
      if(item&&!item.classList.contains('disabled'))handleTitleAction(item.dataset.action);
    }
    return;
  }
  if(S.mode==='help'){
    if(code==='Enter'||code==='Space'||code==='Escape'||code==='KeyZ')closeHelp();
    return;
  }
  if(S.mode==='chapter'){
    if(code==='Enter'||code==='Space'||code==='KeyZ')finishChapterCard();
    return;
  }
  if(S.mode==='dialogue'){
    if(code==='Enter'||code==='Space'||code==='KeyZ')advanceDialogue();
    return;
  }
  if(S.mode==='choice'){
    const c=S.choice;if(!c)return;
    if(code==='ArrowUp'||code==='KeyW'){c.index=(c.index-1+c.options.length)%c.options.length;renderChoices();Sfx.sfx('ui');}
    else if(code==='ArrowDown'||code==='KeyS'){c.index=(c.index+1)%c.options.length;renderChoices();Sfx.sfx('ui');}
    else if(code==='Enter'||code==='Space'||code==='KeyZ')confirmChoice();
    return;
  }
  if(S.mode==='deploy'){
    const d=S.deploy;if(!d)return;
    if(code==='ArrowLeft'||code==='KeyA'){d.index=(d.index-1+d.config.plans.length)%d.config.plans.length;renderPlanCards();Sfx.sfx('ui');}
    else if(code==='ArrowRight'||code==='KeyD'){d.index=(d.index+1)%d.config.plans.length;renderPlanCards();Sfx.sfx('ui');}
    else if(code==='Enter'||code==='Space'||code==='KeyZ')confirmDeploy();
    return;
  }
  if(S.mode==='explore'){
    if(code==='Space'||code==='Enter'||code==='KeyZ'){interact();return;}
    if(code==='Escape'){openHelp();return;}
    return;
  }
  if(S.mode==='battle'){
    if(code==='Space'||code==='Enter'||code==='KeyZ'){castBattleSpecial();return;}
    return;
  }
  if(S.mode==='defeat'){
    if(code==='Enter'||code==='Space'||code==='KeyZ')retryBattle();
    else if(code==='Escape')location.reload();
    return;
  }
  if(S.mode==='ending'){
    if(code==='Enter'||code==='Space'||code==='KeyZ')location.reload();
    return;
  }
  if(S.mode==='cinematic'){
    return;
  }
}

/* =========================================================
   主循环
   ========================================================= */
function update(dt){
  if(S.titleVisible)S.sceneTime+=0;
  if(S.scene&&S.mode!=='battle'&&S.mode!=='defeat'&&S.mode!=='battleEnd')S.sceneTime+=dt;
  if(S.shakeTime>0){
    S.shakeTime-=dt;
    if(S.shakeTime<=0){S.shakeTime=0;S.shakeMag=0;S.shakeDur=0;}
  }
  if(S.mode==='dialogue')updateDialogue(dt);
  if(S.mode==='explore')updateExplore(dt);
  if(S.mode==='battle')updateBattle(dt);
  if(S.mode==='battleEnd'||S.mode==='defeat')updateBattleVisuals(dt);
  if(S.scene)updateParticles(dt);
}

function render(time){
  ctx.imageSmoothingEnabled=false;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#080706';
  ctx.fillRect(0,0,W,H);
  if(S.titleVisible&&(S.mode==='title'||S.mode==='help')){
    Art.drawTitleScene(ctx,time);
    return;
  }
  if(S.battle&&(S.mode==='battle'||S.mode==='battleEnd'||S.mode==='defeat')){
    renderBattle(time);
    return;
  }
  if(S.scene){
    renderScene(time);
    return;
  }
  Art.drawTitleScene(ctx,time);
}

function loop(now){
  const dt=Math.min(.05,Math.max(0,(now-S.lastTime)/1000||.016));
  S.lastTime=now;
  try{
    update(dt);
    render(now/1000);
    syncTouch();
  }catch(err){
    console.error('GAME LOOP',err&&err.stack||err);
  }
  requestAnimationFrame(loop);
}

/* =========================================================
   事件绑定
   ========================================================= */
function bindEvents(){
  window.addEventListener('resize',fitStage);
  window.addEventListener('orientationchange',()=>setTimeout(fitStage,120));
  window.addEventListener('keydown',e=>{
    const blocked=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','Enter','Escape'].includes(e.code);
    if(blocked)e.preventDefault();
    Sfx.unlock();
    keys.add(e.code);
    if(e.repeat)return;
    handleKeyPress(e.code);
  });
  window.addEventListener('keyup',e=>keys.delete(e.code));
  window.addEventListener('blur',()=>keys.clear());
  document.addEventListener('visibilitychange',()=>{if(document.hidden)keys.clear();});
  window.addEventListener('pointerdown',()=>Sfx.unlock(),{once:true});

  document.querySelectorAll('.menu-item').forEach((item,idx)=>{
    item.addEventListener('click',()=>{
      if(S.mode!=='title')return;
      setTitleSelection(idx);
      if(item.classList.contains('disabled'))return;
      handleTitleAction(item.dataset.action);
    });
    item.addEventListener('mouseenter',()=>{
      if(S.mode==='title')setTitleSelection(idx);
    });
  });

  UI.dialogueBox.addEventListener('pointerdown',e=>{
    e.preventDefault();
    if(S.mode==='dialogue')advanceDialogue();
  });
  UI.deployConfirm.addEventListener('click',e=>{e.stopPropagation();if(S.mode==='deploy')confirmDeploy();});
  UI.specialBox.addEventListener('click',e=>{e.stopPropagation();if(S.mode==='battle')castBattleSpecial();});
  UI.helpClose.addEventListener('click',closeHelp);
  UI.retryBtn.addEventListener('click',e=>{e.stopPropagation();retryBattle();});
  UI.backTitleBtn.addEventListener('click',()=>location.reload());
  UI.restartBtn.addEventListener('click',()=>location.reload());
  UI.muteBtn.addEventListener('click',e=>{
    e.stopPropagation();
    Sfx.unlock();
    Sfx.toggleMute();
    refreshMute();
    showToast(Sfx.muted?'声音已关闭':'声音已开启',1000);
  });
  const rotateDismiss=$('rotateDismiss');
  if(rotateDismiss)rotateDismiss.addEventListener('click',()=>{
    $('rotateOverlay').classList.add('hidden');
  });

  document.querySelectorAll('#touchControls [data-key]').forEach(btn=>{
    const key=btn.dataset.key;
    const down=e=>{
      e.preventDefault();e.stopPropagation();
      Sfx.unlock();
      if(!keys.has(key)){keys.add(key);handleKeyPress(key);}
    };
    const up=e=>{e.preventDefault();keys.delete(key);};
    btn.addEventListener('pointerdown',down);
    btn.addEventListener('pointerup',up);
    btn.addEventListener('pointercancel',up);
    btn.addEventListener('pointerleave',up);
    btn.addEventListener('contextmenu',e=>e.preventDefault());
  });
}

function init(){
  S.touch=('ontouchstart' in window)||(navigator.maxTouchPoints>0)||
    window.matchMedia('(pointer: coarse)').matches||
    window.matchMedia('(any-pointer: coarse)').matches||
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  fitStage();
  bindEvents();
  refreshMute();
  renderStats();
  refreshContinue();
  setTitleSelection(0);
  Sfx.setMusic('title');
  S.mode='title';
  S.titleVisible=true;
  S.lastTime=performance.now();
  requestAnimationFrame(loop);
}

init();
