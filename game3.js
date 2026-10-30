function cScnSave(){ctx.save();}

function drawNpcName(c,npc){
  if(!npc.name)return;
  ctx.save();
  ctx.font='bold 7px "Microsoft YaHei","SimSun",sans-serif';
  const w=ctx.measureText(npc.name).width+8;
  const x=clamp(npc.x-w/2,10,630-w);
  const y=npc.y-33;
  ctx.globalAlpha=.82;
  Art.R(c,x,y,w,10,'rgba(9,7,4,.8)');
  Art.AText(c,npc.name,x+w/2,y+5.3,7,'#d9c297','center');
  ctx.restore();
}

function drawInteractPrompt(target,time){
  const label=target.label||'查看';
  ctx.save();
  ctx.font='bold 8px "Microsoft YaHei","SimSun",sans-serif';
  const tw=ctx.measureText(label).width;
  const w=Math.max(58,tw+38),h=19;
  let x=target.x-w/2;
  let y=target.y-16+Math.sin(time*3)*1.5;
  x=clamp(x,12,628-w);
  y=clamp(y,60,332);
  Art.R(ctx,x+1,y+2,w,h,'rgba(0,0,0,.45)');
  Art.R(ctx,x,y,w,h,'rgba(12,9,6,.94)');
  Art.O(ctx,x,y,w,h,'#a88042');
  Art.R(ctx,x+3,y+3,17,h-6,'#6f2118');
  Art.AText(ctx,'空格',x+11,y+h/2,7,'#ffe3ac','center');
  Art.AText(ctx,label,x+24,y+h/2+0.5,8,'#ead9b2');
  ctx.fillStyle='#a88042';
  ctx.beginPath();ctx.moveTo(target.x-4,y+h);ctx.lineTo(target.x+4,y+h);ctx.lineTo(target.x,y+h+5);ctx.closePath();ctx.fill();
  ctx.restore();
}

function drawSceneAmbient(time){
  const id=S.scene.id;
  if(id==='village'){
    for(let i=0;i<14;i++){
      const x=(hash2(i,4)*640+time*(4+i*.3))%660-10;
      const y=90+hash2(i,8)*240+Math.sin(time*.7+i)*6;
      ctx.save();ctx.globalAlpha=.16+.1*Math.sin(time+i);Art.DOT(ctx,x,y,'#ddc58c');ctx.restore();
    }
    if(S.flags.famineDone){
      for(let i=0;i<2;i++){
        const x=(time*7+i*340)%700-30,y=120+i*28+Math.sin(time+i)*5;
        Art.R(ctx,x,y,3,1,'#211b17');Art.R(ctx,x+4,y,3,1,'#211b17');
      }
    }
  }else if(id==='temple'){
    for(let i=0;i<18;i++){
      const x=430+hash2(i,3)*170+Math.sin(time*.8+i)*16;
      const y=((time*14+i*23)%300)+70;
      const sw=Math.sin(time*2+i)*2;
      Art.R(ctx,x+sw,y,2,1,i%3?'#b7a44e':'#d1bd63');
    }
    for(let i=0;i<4;i++){
      const x=70+i*30+Math.sin(time*.4+i)*7,y=150+i*9;
      ctx.save();ctx.globalAlpha=.12;Art.CIRC(ctx,x,y,2,'#c7bb8e');ctx.restore();
    }
  }else if(id==='camp'){
    for(let i=0;i<22;i++){
      const life=((time*28+i*31)%280)/280;
      const x=450+Math.sin(time*.5+i)*150*(hash2(i,4)*.6+.4);
      const y=288-life*220;
      ctx.save();ctx.globalAlpha=Math.max(0,(1-life)*.7);
      Art.R(ctx,x,y,life>.6?2:1,life>.6?2:1,i%3?'#e39743':'#f7c46e');
      ctx.restore();
    }
  }else if(id==='warRoom'){
    for(let i=0;i<14;i++){
      const x=(hash2(i,2)*220+300+Math.sin(time*.25+i)*15)%640;
      const y=110+hash2(i,5)*180;
      ctx.save();ctx.globalAlpha=.1+.05*Math.sin(time+i);Art.DOT(ctx,x,y,'#e1c17c');ctx.restore();
    }
  }else if(id==='throne'){
    for(let i=0;i<24;i++){
      const x=(hash2(i,3)*560+40+Math.sin(time*.3+i)*10);
      const y=((time*5+i*41)%270)+80;
      ctx.save();ctx.globalAlpha=.16+.12*Math.sin(time*1.2+i);Art.R(ctx,x,y,1,1,'#efd18b');ctx.restore();
    }
  }
}

/* =========================================================
   场景小物件
   ========================================================= */
function drawLeafPile(c,x,y,t){
  Art.SHADOW(c,x,y,10,3);
  for(let i=0;i<12;i++){
    const px=x+Math.cos(i*2.3)*8*(hash2(i,4)*.6+.4);
    const py=y-2-Math.sin(i*1.7)*4;
    Art.R(c,px,py,i%3?2:3,1,i%3?'#a38e43':'#c3ae58');
  }
  if(Math.sin(t*3+x)>.85){Art.DOT(c,x+6,y-12,'#e7d47b');}
}

function drawTempleGate(c,x,y,t){
  Art.SHADOW(c,x,y,48,6,.2);
  // stone feet
  Art.R(c,x-44,y-6,14,6,'#5b5c50');
  Art.R(c,x+30,y-6,14,6,'#5b5c50');
  // tall red posts
  Art.R(c,x-40,y-66,7,62,'#5c2b21');
  Art.R(c,x-38,y-66,3,62,'#7a392b');
  Art.R(c,x+33,y-66,7,62,'#5c2b21');
  Art.R(c,x+36,y-66,3,62,'#7a392b');
  // cross beams
  Art.R(c,x-49,y-68,98,5,'#6b3828');
  Art.R(c,x-52,y-72,104,3,'#3b1d16');
  // little tiled roof
  c.fillStyle='#2b2d28';
  c.beginPath();
  c.moveTo(x-58,y-73);c.lineTo(x-43,y-86);c.lineTo(x+43,y-86);c.lineTo(x+58,y-73);c.closePath();c.fill();
  Art.R(c,x-61,y-75,122,3,'#1b1d1a');
  Art.R(c,x-46,y-88,92,3,'#494b43');
  Art.R(c,x-54,y-76,108,2,'#56584e');
  for(let i=0;i<6;i++)Art.R(c,x-38+i*15,y-83,2,9,'#1f211e');
  // sign
  Art.R(c,x-27,y-62,54,15,'#24160e');
  Art.R(c,x-25,y-60,50,11,'#4a2d1b');
  Art.AText(c,'皇觉寺',x,y-54.5,8,'#d7b66e','center');
  // lanterns
  for(const px of [x-35,x+35]){
    Art.R(c,px-3,y-51,6,8,'#9e2b22');
    Art.R(c,px-2,y-49,4,4,'#e5ad5d');
    Art.GLOW(c,px,y-47,15,'#e1a45a',.12);
  }
  Art.R(c,x-31,y-4,62,4,'#46473d');
}

function drawSignpost(c,x,y,text,t){
  Art.SHADOW(c,x,y,8,2);
  Art.R(c,x-1,y-35,3,35,'#553b24');
  Art.R(c,x-17,y-40,34,14,'#6e4f2d');
  Art.R(c,x-15,y-38,30,10,'#8b6a3d');
  Art.AText(c,text,x,y-33,7,'#e0c68e','center');
  Art.R(c,x-7,y-42,14,2,'#4a3420');
}

/* =========================================================
   剧情：第一章
   ========================================================= */
async function startChapter1(){
  S.chapter=1;S.outfit='boy';S.flags={};
  saveGame();renderStats();
  S.mode='cutscene';setHudVisible(false);setObjective('');
  Sfx.setMusic('explore');
  await fadeOut(480);
  setScene('village');
  await chapterCard(1,'钟离孤庄','元至正四年 · 淮西大旱');
  await fadeIn(520);
  await say([
    L('旁白','元至正四年，濠州钟离。'),
    L('旁白','旱灾、蝗灾、瘟疫接踵而至。淮西大地，十室九空。'),
    L('朱元璋','娘咳了三天，家里连一粒米也没有了。'),
    L('汤和','重八！后坡上还有几株苦菜，去挖些回来！'),
    L('旁白','你叫朱重八。这一年，你十七岁。')
  ]);
  setObjective('找些野菜，带回破屋（0/3）');
  beginExplore();
}

async function collectHerb(obj){
  if(obj.done||S.mode!=='explore')return;
  obj.done=true;
  S.flags.herbs=(S.flags.herbs||0)+1;
  const n=S.flags.herbs;
  Sfx.sfx('pickup');
  spawnParticles(obj.x,obj.y-8,'#bfe17b',10,30,.6,20);
  showToast(`采到苦菜 · ${n} / 3`);
  if(n>=3){
    setObjective('回家看看爹娘');
    await say([
      L('朱元璋','三株……够了。娘有救了。'),
      L('旁白','你把野菜紧紧揣进怀里，向破屋跑去。风从田埂上吹过，像有人在哭。')
    ]);
  }else{
    setObjective(`找些野菜，带回破屋（${n}/3）`);
  }
}

async function famineScene(){
  if(S.flags.famineStarted)return;
  S.flags.famineStarted=true;
  S.mode='cutscene';
  setHudVisible(false);
  setObjective('');
  await fadeOut(520);
  S.flags.famineDone=true;
  S.flags.canLeave=true;
  setScene('village',{spawn:{x:268,y:218}});
  S.scene.tint='rgba(52,24,12,.24)';
  UI.sceneTint.style.background=S.scene.tint;
  await cinematicText([
    '你把三株野菜捧到娘面前。',
    '可她已经睁不开眼了。',
    '那一夜，爹、娘、大哥，先后走了。',
    '你连一块葬他们的地都没有。'
  ],1700);
  await fadeIn(650);
  await say([
    L('旁白','天亮了。你跪在破屋前，膝盖陷进湿冷的黄土。'),
    L('刘继祖','重八，起来。'),
    L('刘继祖','你爹娘的后事，村里人凑了一领草席。村东那片坡地，就给你家吧。'),
    L('朱元璋','刘伯……我连一口薄棺都买不起。'),
    L('刘继祖','这世道，能入土，已是天大的体面。'),
    L('朱元璋','我记住了。'),
    L('旁白','你亲手垒起三座土坟。没有碑，只有三块石头。'),
    L('刘继祖','皇觉寺有条活路。去吧，别回头。')
  ]);
  setObjective('去村口，投皇觉寺');
  beginExplore();
  addStat('minxin',1,'乡邻的恩情 · 民心+1');
}

async function leaveVillage(){
  if(S.mode!=='explore'||!S.flags.canLeave)return;
  S.mode='cutscene';
  setHudVisible(false);
  await startChapter2();
}

/* =========================================================
   剧情：第二章
   ========================================================= */
async function startChapter2(){
  S.chapter=2;S.outfit='monk';S.flags={};saveGame();renderStats();
  S.mode='cutscene';setHudVisible(false);setObjective('');
  Sfx.setMusic('explore');
  await fadeOut(480);
  setScene('temple');
  await chapterCard(2,'皇觉寺','元至正四年 · 淮西');
  await fadeIn(520);
  await say([
    L('旁白','至正四年，你入皇觉寺，做了行脚僧。'),
    L('老僧','重八，从今日起，你法名如净。'),
    L('朱元璋','师父，我爹娘都走了。'),
    L('老僧','那就替他们，好好活着。'),
    L('老僧','扫尽庭前落叶，再来见我。')
  ]);
  setObjective('扫净庭前三堆落叶（0/3）');
  beginExplore();
}

async function sweepLeaf(obj){
  if(obj.done||S.mode!=='explore')return;
  obj.done=true;
  S.flags.leaves=(S.flags.leaves||0)+1;
  const n=S.flags.leaves;
  Sfx.noise(.24,2600,.04);
  spawnParticles(obj.x,obj.y-5,'#b6a24f',9,26,.7,24);
  addShake(.18,1.5);
  showToast(`扫净落叶 · ${n} / 3`);
  if(n>=3){
    setObjective('山门外，似乎有人在等你');
    await say([
      L('朱元璋','三堆落叶，扫净了。'),
      L('旁白','你直起腰。山门外传来急促的脚步声。')
    ]);
  }else{
    setObjective(`扫净庭前三堆落叶（${n}/3）`);
  }
}

async function ringBell(){
  if(S.mode!=='explore')return;
  S.flags.bell=(S.flags.bell||0)+1;
  Sfx.sfx('bell');
  addShake(.55,5);
  spawnParticles(100,190,'#d9c07a',10,30,1,18);
  if(S.flags.bell===1){
    await say([L('旁白','钟声撞开晨雾，惊起满山寒鸦。')]);
  }else if(S.flags.bell===3&&!S.flags.bellReward){
    S.flags.bellReward=true;
    await say([
      L('旁白','三声钟响，余音在山谷间久久不散。'),
      L('朱元璋','爹，娘……你们听见了吗？')
    ]);
    addStat('minxin',1,'钟声涤心 · 民心+1');
  }else if(S.flags.bell<4){
    await say([L('旁白','钟声回荡，山门外的世界却越来越远。')]);
  }else{
    await say([L('朱元璋','钟声再响，也敲不醒这世道。')]);
  }
}

async function letterScene(){
  if(S.mode!=='explore'||S.flags.letter)return;
  S.flags.letter=true;
  await say([
    L('信使','可是朱重八？'),
    L('朱元璋','我是。'),
    L('信使','汤和大哥让我捎来的。他说，你看了就明白。'),
    L('旁白','信纸粗糙，字迹歪斜，却带着一路风尘。'),
    L('汤和','重八：濠州城头已插满红巾。郭大帅正在招兵买马。'),
    L('汤和','当年说要让这世道换个模样——现在，时候到了。'),
    L('汤和','我在濠州等你。　　　　　　　　汤和'),
    L('朱元璋','汤和……他真的去了。')
  ]);
  setObjective('去大殿前，向老僧辞行');
}

async function talkMonk(){
  if(S.mode!=='explore')return;
  if(!S.flags.leaves||S.flags.leaves<3){
    await say([
      L('老僧','庭前落叶未净，心也未净。'),
      L('朱元璋','师父，这寺里寺外，都是落叶。'),
      L('老僧','那就一堆一堆地扫。')
    ]);
    return;
  }
  if(!S.flags.letter){
    await say([
      L('老僧','山门外，有人等你。'),
      L('朱元璋','师父知道我要求什么？'),
      L('老僧','我不知道。但你的心，已经不在佛前了。')
    ]);
    return;
  }
  if(S.flags.joined){
    await say([
      L('老僧','去吧。山高路远，别忘了自己从何处来。'),
      L('朱元璋','师父保重。')
    ]);
    return;
  }
  await say([
    L('老僧','信，我看了。'),
    L('朱元璋','师父，我想下山。'),
    L('老僧','山下是刀山火海。你去了，未必回得来。'),
    L('朱元璋','留在寺里，就能活吗？'),
    L('老僧','……不能。'),
    L('老僧','这世道，佛不渡人，人自渡。')
  ]);
  let choice='';
  while(true){
    choice=await choose('乱世洪流，已到山门。你往何处去？',[
      {label:'下山，投红巾军',sub:'去濠州，找汤和。刀山火海，也要闯一闯。',value:'join',effect:{weiwang:1},toast:'下山投军'},
      {label:'留在皇觉寺',sub:'青灯古佛，了此残生。',value:'stay'}
    ]);
    if(choice==='join')break;
    await say([
      L('老僧','寺门能关住风，关不住天下。'),
      L('老僧','你心里的火，还没灭。'),
      L('朱元璋','……师父，我做不到。')
    ]);
  }
  S.flags.joined=true;
  S.flags.canLeave=true;
  await say([
    L('老僧','好。既然要走，就堂堂正正地走。'),
    L('老僧','记住，你也是穷苦人出身。将来若有出头之日，别让百姓再受你受过的苦。'),
    L('朱元璋','重八记下了。'),
    L('老僧','去吧。')
  ]);
  Sfx.sfx('bell');
  flashScreen();
  setObjective('从山门下山，投奔濠州红巾军');
}

async function leaveTemple(){
  if(S.mode!=='explore'||!S.flags.canLeave)return;
  S.mode='cutscene';
  setHudVisible(false);
  await startChapter3();
}

/* =========================================================
   剧情：第三章
   ========================================================= */
async function startChapter3(){
  S.chapter=3;S.outfit='redSoldier';S.flags={};saveGame();renderStats();
  S.mode='cutscene';setHudVisible(false);setObjective('');
  Sfx.setMusic('explore');
  await fadeOut(480);
  setScene('camp');
  await chapterCard(3,'投军','元至正十二年 · 濠州');
  await fadeIn(520);
  await say([
    L('旁白','至正十二年，濠州红巾军大营。'),
    L('汤和','重八！我就知道你会来！'),
    L('朱元璋','家里没活路了。听说红巾军，专打元狗。'),
    L('汤和','嘘——走，我带你去见郭大帅。'),
    L('旁白','营中火把猎猎。远处传来磨刀的声音。')
  ]);
  setObjective('去帅帐拜见郭子兴');
  beginExplore();
}

async function talkGuo(){
  if(S.mode!=='explore')return;
  if(S.flags.ch3Won){
    await say([
      L('郭子兴','好小子。一夜破三营，我郭子兴没看错人。'),
      L('朱元璋','全赖大帅调度。'),
      L('郭子兴','少来这套。去吧，马姑娘还等着给你上药。')
    ]);
    return;
  }
  if(!S.flags.named){
    await say([
      L('郭子兴','你就是汤和说的那个重八？'),
      L('朱元璋','是。'),
      L('郭子兴','身子骨倒是结实。为何来投军？'),
      L('朱元璋','……')
    ]);
    const reason=await choose('郭子兴盯着你。你要如何回答？',[
      {label:'“为活命。”',sub:'家里死绝了，只想讨一条活路。',value:'live',effect:{minxin:1},toast:'实话实说'},
      {label:'“为杀出一条活路。”',sub:'这世道不给人活，就杀出一条血路。',value:'fight',effect:{weiwang:1},toast:'锋芒毕露'},
      {label:'“为让穷人不再挨饿。”',sub:'你见过太多人饿死。',value:'people',effect:{minxin:1,weiwang:1},toast:'布衣之志'}
    ]);
    if(reason==='live'){
      await say([
        L('郭子兴','实在。我喜欢实在人。'),
        L('郭子兴','活命不难。难的是，活得像个人。')
      ]);
    }else if(reason==='fight'){
      await say([
        L('郭子兴','好大的口气。'),
        L('郭子兴','不过，这年头，没这点狠劲，活不长。')
      ]);
    }else{
      await say([
        L('郭子兴','让穷人不再挨饿……'),
        L('郭子兴','我起兵的时候，也这么说过。'),
        L('郭子兴','希望你别忘了今天这句话。')
      ]);
    }
    await say([
      L('郭子兴','从今日起，你便叫——朱元璋。'),
      L('郭子兴','璋，是锐利的美玉。我要你做一把，诛灭元朝的利刃。')
    ]);
    S.flags.named=true;
    S.outfit='general';
    Sfx.sfx('confirm');
    flashScreen();
    await say([
      L('朱元璋','朱元璋……谢大帅赐名。'),
      L('郭子兴','别谢我。去火堆边，马姑娘给你留了吃的。')
    ]);
    setObjective('去火堆旁，和马姑娘说说话');
    return;
  }
  if(!S.flags.metMa){
    await say([L('郭子兴','急什么？先去吃点东西。马姑娘在火堆边。')]);
    return;
  }
  await say([
    L('郭子兴','元军今夜必来劫粮。'),
    L('郭子兴','我要你带一队人，反劫他的营。'),
    L('朱元璋','多少人？'),
    L('郭子兴','三百。够不够？'),
    L('朱元璋','够了。'),
    L('郭子兴','这一仗，你来定计。')
  ]);
  await startNightRaid();
}

async function talkMa(){
  if(S.mode!=='explore')return;
  if(!S.flags.named){
    await say([
      L('马秀英','你就是朱重八？'),
      L('朱元璋','……是。'),
      L('马秀英','郭大帅在帅帐前等你。先去吧。'),
      L('马秀英','锅里给你留了块饼。回来吃。')
    ]);
    return;
  }
  if(S.flags.ch3Won){
    await say([
      L('马秀英','把手伸出来。'),
      L('朱元璋','一点小伤。'),
      L('马秀英','小伤也是伤。'),
      L('马秀英','以后，不许再这样拼命了。'),
      L('朱元璋','……好。')
    ]);
    return;
  }
  if(!S.flags.metMa){
    S.flags.metMa=true;
    await say([
      L('马秀英','你就是朱重八？郭大帅一天要提你八回。'),
      L('朱元璋','我……只是个放牛的。'),
      L('马秀英','放牛的就不能当英雄了？'),
      L('马秀英','给，刚出炉的烧饼。'),
      L('旁白','烧饼烫得你直吸气。她笑起来，像冬日里的一炉火。'),
      L('朱元璋','烫……'),
      L('马秀英','慢点吃。往后打仗，记得留着命回来。')
    ]);
    addStat('minxin',1,'马姑娘的烧饼 · 民心+1');
    setObjective('回帅帐领兵，夜袭元营');
    return;
  }
  await say([
    L('马秀英','夜袭之前，把这个带上。'),
    L('朱元璋','这是什么？'),
    L('马秀英','平安符。我娘留下的。'),
    L('马秀英','别弄丢了。')
  ]);
}
