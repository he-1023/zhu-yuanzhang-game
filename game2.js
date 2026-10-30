function buildVillage(){
  const sc=makeScene('village','钟离 · 孤庄村','rgba(52,28,10,.12)');
  sc.spawn={x:320,y:318};
  sc.bounds={x:18,y:78,w:604,h:268};
  sc.ground=(c,t)=>Art.groundVillage(c,t);

  addProp(sc,190,(c,t)=>Art.drawHut(c,208,190,116,90,t,{lantern:true,chimney:true}),{x:150,y:136,w:116,h:54});
  addProp(sc,184,(c,t)=>Art.drawHut(c,512,184,94,76,t,{light:'#d8a85c'}),{x:465,y:140,w:94,h:44});
  addProp(sc,268,(c,t)=>Art.drawTree(c,64,268,1.15,t),{x:54,y:256,w:18,h:12});
  addProp(sc,308,(c,t)=>Art.drawTree(c,608,308,1.0,t),{x:598,y:296,w:16,h:12});
  addProp(sc,232,(c,t)=>Art.drawWell(c,132,232,t),{x:117,y:218,w:30,h:14});
  addProp(sc,330,(c,t)=>Art.drawOx(c,98,330,t),{x:80,y:316,w:38,h:14});
  addProp(sc,260,(c,t)=>Art.drawFence(c,232,260,74),{x:232,y:252,w:74,h:8});
  addProp(sc,294,(c,t)=>Art.drawFence(c,352,294,55),{x:352,y:286,w:55,h:8});
  addProp(sc,342,(c,t)=>Art.drawBasket(c,300,342),null);
  addProp(sc,300,(c,t)=>Art.drawRock(c,556,300,.8),null);

  if(S.flags.famineDone){
    addProp(sc,186,(c,t)=>Art.drawGrave(c,86,186,t),null);
    addProp(sc,192,(c,t)=>Art.drawGrave(c,114,192,t),null);
    addProp(sc,184,(c,t)=>Art.drawGrave(c,142,184,t),null);
  }

  if(S.flags.canLeave){
    addProp(sc,260,(c,t)=>drawSignpost(c,306,352,'皇觉寺',t),null);
  }

  addNpc(sc,{
    id:'liu',name:'刘继祖',x:300,y:238,style:'farmer',dir:'down',
    action:async()=>{
      if(!S.flags.famineDone){
        if((S.flags.herbs||0)>=3){
          await say([
            L('刘继祖','重八，你娘他……唉，快回去看看吧。'),
            L('朱元璋','刘伯，我挖到野菜了。')
          ]);
        }else{
          await say([
            L('刘继祖','后坡上还有些苦菜。挖回来，给你娘煮口汤吧。'),
            L('朱元璋','嗯。刘伯，等我娘好了，我给您放一年牛。'),
            L('刘继祖','傻孩子。先顾好你娘。')
          ]);
        }
      }else if(!S.flags.graveGiven){
        S.flags.graveGiven=true;
        await say([
          L('刘继祖','你爹娘的后事，村里人凑了一领草席。'),
          L('刘继祖','村东那片坡地，就给你家吧。让他们入土为安。'),
          L('朱元璋','刘伯……这份恩，重八记下了。'),
          L('刘继祖','记什么恩。活着，比什么都强。'),
          L('刘继祖','皇觉寺有条活路。去吧，别回头。')
        ]);
        addStat('minxin',1,'乡邻的恩情 · 民心+1');
        setObjective('去村口，投皇觉寺');
      }else{
        await say([
          L('刘继祖','皇觉寺在村东。去了，就别再回来了。'),
          L('朱元璋','刘伯，等我出息了，给您修一座大宅子。'),
          L('刘继祖','我不要大宅子。我要你活着。')
        ]);
      }
    }
  });

  addNpc(sc,{
    id:'tang',name:'汤和',x:424,y:304,style:'friend',dir:'left',
    action:async()=>{
      if(!S.flags.famineDone){
        await say([
          L('汤和','重八！后坡上还有几株苦菜，快去挖！'),
          L('汤和','你娘咳得厉害，再不吃点东西，怕撑不过今晚。'),
          L('朱元璋','我知道。可地里连草根都快挖光了。'),
          L('汤和','东边！我昨天看见的。快去。')
        ]);
      }else if(!S.flags.farewell){
        S.flags.farewell=true;
        await say([
          L('汤和','重八，我要去投红巾军了。'),
          L('朱元璋','红巾军？那可是要杀头的。'),
          L('汤和','这世道，饿死和被砍头，有甚分别？'),
          L('汤和','你留下，照顾好自己。等这世道变了，我回来找你。'),
          L('朱元璋','好。活着再见。')
        ]);
        addStat('minxin',1,'与汤和的约定 · 民心+1');
      }else{
        await say([
          L('汤和','濠州城，我等你。'),
          L('朱元璋','你先去。等我把爹娘安顿好。'),
          L('汤和','记住，别死。')
        ]);
      }
    }
  });

  if(!S.flags.famineDone){
    addNpc(sc,{
      id:'father',name:'朱五四',x:182,y:206,style:'farmer',dir:'down',
      action:async()=>{
        await say([
          L('朱五四','重八，地里没粮了。你娘把最后半块糠饼留给了你。'),
          L('朱元璋','爹，我不饿。'),
          L('朱五四','吃吧。活着，才有力气。')
        ]);
      }
    });
    addNpc(sc,{
      id:'mother',name:'陈氏',x:236,y:206,style:'woman',dir:'down',
      action:async()=>{
        if((S.flags.herbs||0)>=3){
          await famineScene();
        }else{
          await say([
            L('陈氏','重八……娘没事。就是有点喘不上气。'),
            L('朱元璋','娘，我去挖野菜。您等着。'),
            L('陈氏','别走远。外头……乱。'),
            L('旁白','母亲的手很凉。你替她掖好被角，转身走进昏黄的暮色。')
          ]);
        }
      }
    });
  }

  const herbSpots=[[478,250],[548,225],[584,274]];
  herbSpots.forEach(([x,y],i)=>{
    const obj={
      id:'herb'+i,x,y,label:'采摘野菜',draw:true,
      vis:()=>!obj.done&&!(S.flags.famineDone),
      drawFn:(c,t)=>{ if(!obj.done)Art.drawHerb(c,x,y,t); },
      action:()=>collectHerb(obj)
    };
    addObject(sc,obj);
  });

  addObject(sc,{
    id:'exit',x:320,y:344,label:'前往皇觉寺',r:42,
    vis:()=>!!S.flags.canLeave,
    drawFn:null,
    action:leaveVillage
  });

  return sc;
}

function buildTemple(){
  const sc=makeScene('temple','皇觉寺 · 山门','rgba(15,26,22,.16)');
  sc.spawn={x:320,y:314};
  sc.bounds={x:30,y:84,w:580,h:258};
  sc.ground=(c,t)=>Art.groundTemple(c,t);

  addProp(sc,192,(c,t)=>Art.drawTempleHall(c,320,192,t),{x:198,y:58,w:244,h:132});
  addProp(sc,230,(c,t)=>Art.drawBell(c,100,230,t,Math.sin(t*.8)*.2),{x:86,y:210,w:28,h:18});
  addProp(sc,290,(c,t)=>Art.drawTree(c,548,290,1.18,t,'ginkgo'),{x:537,y:278,w:20,h:12});
  addProp(sc,305,(c,t)=>Art.drawCypress(c,52,305,1.05,t),{x:44,y:294,w:16,h:11});
  addProp(sc,240,(c,t)=>Art.drawIncense(c,400,240,t),{x:385,y:224,w:30,h:14});
  addProp(sc,268,(c,t)=>Art.drawStoneLantern(c,245,268,t,true),{x:234,y:256,w:22,h:10});
  addProp(sc,278,(c,t)=>Art.drawStoneLantern(c,435,278,t,true),{x:424,y:266,w:22,h:10});
  addProp(sc,250,(c,t)=>drawTempleGate(c,320,348,t),null);
  if(S.flags.canLeave)addProp(sc,252,(c,t)=>drawSignpost(c,362,352,'濠州',t),null);

  if(!S.flags.letter){
    addNpc(sc,{
      id:'monk',name:'老僧',x:320,y:212,style:'oldMonk',dir:'down',
      action:talkMonk
    });
  }else{
    addNpc(sc,{
      id:'monk',name:'老僧',x:320,y:212,style:'oldMonk',dir:'down',
      action:talkMonk
    });
  }
  addNpc(sc,{
    id:'messenger',name:'信使',x:392,y:326,style:'messenger',dir:'left',
    vis:()=>!!(S.flags.leaves>=3&&!S.flags.letter),
    action:letterScene
  });

  const leafSpots=[[202,308],[382,312],[520,304]];
  leafSpots.forEach(([x,y],i)=>{
    const obj={
      id:'leaf'+i,x,y,label:'清扫落叶',r:29,
      vis:()=>!obj.done,
      drawFn:(c,t)=>{if(!obj.done)drawLeafPile(c,x,y,t);},
      action:()=>sweepLeaf(obj)
    };
    addObject(sc,obj);
  });

  addObject(sc,{
    id:'bell',x:100,y:236,label:'撞钟',r:36,
    vis:()=>true,drawFn:null,action:ringBell
  });

  addObject(sc,{
    id:'exit',x:320,y:346,label:'下山，投奔红巾军',r:42,
    vis:()=>!!S.flags.canLeave,drawFn:null,action:leaveTemple
  });

  return sc;
}

function buildCamp(){
  const sc=makeScene('camp','濠州 · 红巾军大营','rgba(7,12,24,.30)');
  sc.spawn={x:352,y:330};
  sc.bounds={x:26,y:92,w:588,h:248};
  sc.ground=(c,t)=>Art.groundCamp(c,t);

  addProp(sc,196,(c,t)=>Art.drawTent(c,320,196,164,104,t,{color:'#7f5d3d',dark:'#4c3825',light:'#9b764e',flag:'#a8291f'}),{x:246,y:112,w:148,h:60});
  addProp(sc,252,(c,t)=>Art.drawTent(c,106,252,94,74,t,{color:'#6e6045',dark:'#453b2a',light:'#8a7a59'}),{x:66,y:194,w:80,h:44});
  addProp(sc,248,(c,t)=>Art.drawTent(c,548,248,96,76,t,{color:'#72583e',dark:'#473425',light:'#8d6c4a'}),{x:508,y:188,w:80,h:46});
  addProp(sc,288,(c,t)=>Art.drawCampfire(c,450,288,t),null);
  addProp(sc,282,(c,t)=>Art.drawWeaponRack(c,188,282,t),{x:168,y:266,w:42,h:18});
  addProp(sc,166,(c,t)=>Art.drawBanner(c,252,166,54,t,'#8f2018','朱'),null);
  addProp(sc,166,(c,t)=>Art.drawBanner(c,394,166,54,t,'#8f2018','红'),null);
  addProp(sc,250,(c,t)=>Art.drawTorch(c,66,250,t),null);
  addProp(sc,268,(c,t)=>Art.drawTorch(c,584,268,t),null);
  addProp(sc,324,(c,t)=>Art.drawCrate(c,520,324,.9),{x:510,y:310,w:22,h:15});
  addProp(sc,330,(c,t)=>Art.drawCrate(c,92,330,.8),{x:83,y:317,w:20,h:14});
  addProp(sc,340,(c,t)=>Art.drawSack(c,542,340,.8),null);

  addNpc(sc,{
    id:'guo',name:'郭子兴',x:320,y:220,style:'guo',dir:'down',
    action:talkGuo
  });
  addNpc(sc,{
    id:'ma',name:'马秀英',x:430,y:302,style:'woman',dir:'left',
    action:talkMa
  });
  addNpc(sc,{
    id:'xu',name:'徐达',x:210,y:266,style:'xu',dir:'right',
    action:async()=>{
      if(!S.flags.named){
        await say([L('徐达','新来的？郭大帅在帅帐前。别让他等。')]);
      }else if(!S.flags.metMa){
        await say([
          L('徐达','我叫徐达。听说你一个人敢追着元兵砍？'),
          L('朱元璋','不砍他，他就砍我。'),
          L('徐达','……有点意思。待会儿夜袭，我跟你走。'),
          L('朱元璋','好。')
        ]);
      }else if(!S.flags.ch3Won){
        await say([
          L('徐达','打夜仗，别光盯着前面。火一起，敌人会从暗处摸过来。'),
          L('朱元璋','记住了。'),
          L('徐达','你死不了。我看人很准。')
        ]);
      }else{
        await say([L('徐达','这一仗，打得漂亮。')]);
      }
    }
  });
  addNpc(sc,{
    id:'tang',name:'汤和',x:285,y:320,style:'friend',dir:'right',
    action:async()=>{
      if(!S.flags.named){
        await say([L('汤和','快去吧！郭大帅就在帅帐前，别让他等急了。')]);
      }else if(!S.flags.ch3Won){
        await say([
          L('汤和','重八，你穿上这身甲，还真像那么回事。'),
          L('朱元璋','少贫嘴。'),
          L('汤和','活着回来。咱俩还得回孤庄喝酒。')
        ]);
      }else{
        await say([L('汤和','我就知道，你不是池子里的鱼。')]);
      }
    }
  });

  return sc;
}

function buildWarRoom(){
  const sc=makeScene('warRoom','应天 · 帅帐','rgba(40,20,8,.13)');
  sc.spawn={x:320,y:308};
  sc.bounds={x:26,y:104,w:588,h:236};
  sc.ground=(c,t)=>Art.groundWarRoom(c,t);
  addProp(sc,225,(c,t)=>Art.drawWarTable(c,320,225,t),{x:244,y:188,w:152,h:38});
  addProp(sc,176,(c,t)=>Art.drawScreen(c,62,106,94,70,t),null);
  addProp(sc,258,(c,t)=>Art.drawArmorStand(c,566,258,t),{x:550,y:242,w:32,h:16});
  addProp(sc,140,(c,t)=>Art.drawBanner(c,520,140,50,t,'#8f2018','明'),null);

  addNpc(sc,{
    id:'liu',name:'刘伯温',x:436,y:202,style:'liu',dir:'left',
    action:async()=>{
      if(!S.flags.strategyChosen){
        await say([L('刘伯温','主公，先定大略，再谈刀兵。')]);
      }else{
        await say([
          L('刘伯温','六十万对二十万，账面上我们必败。'),
          L('刘伯温','但兵者，诡道也。陈友谅的船越大，越难回头。'),
          L('朱元璋','所以，就用火。'),
          L('刘伯温','主公已经看到胜机了。')
        ]);
      }
    }
  });
  addNpc(sc,{
    id:'li',name:'李善长',x:208,y:204,style:'li',dir:'right',
    action:async()=>{
      await say([
        L('李善长','粮草已备足三月，火船一百二十艘。'),
        L('朱元璋','够烧了。'),
        L('李善长','臣只盼主公，烧完之后，还能平安回来。')
      ]);
    }
  });
  addNpc(sc,{
    id:'xu',name:'徐达',x:464,y:268,style:'xu',dir:'left',
    action:async()=>{
      await say([
        L('徐达','末将愿为先锋。若冲不破敌阵，提头来见。'),
        L('朱元璋','我不要你的头。我要你活着，把大明的旗插到对岸。'),
        L('徐达','……是！')
      ]);
    }
  });
  addNpc(sc,{
    id:'ma',name:'马秀英',x:222,y:284,style:'woman',dir:'right',
    action:async()=>{
      await say([
        L('马秀英','我在应天等你。'),
        L('朱元璋','等我回来。'),
        L('马秀英','你每次都这么说。'),
        L('马秀英','所以，每次都一定要回来。')
      ]);
    }
  });

  addObject(sc,{
    id:'mapTable',x:320,y:266,label:'定策出征',r:36,
    vis:()=>true,drawFn:null,action:openPoyangBattle
  });

  return sc;
}

function buildThrone(){
  const sc=makeScene('throne','应天 · 奉天殿','rgba(38,20,8,.08)');
  sc.spawn={x:320,y:324};
  sc.bounds={x:60,y:98,w:520,h:244};
  sc.ground=(c,t)=>Art.groundThrone(c,t);
  addProp(sc,132,(c,t)=>Art.drawThrone(c,320,132,t),{x:254,y:94,w:132,h:88});

  addNpc(sc,{
    id:'ma',name:'马秀英',x:245,y:238,style:'woman',dir:'right',
    action:async()=>{
      await say([
        L('马秀英','重八，你还记得钟离的雪吗？'),
        L('朱元璋','记得。还有你塞给我的那半块烧饼。'),
        L('马秀英','都当皇帝了，还惦记半块烧饼。'),
        L('朱元璋','那半块烧饼，比这满殿的金子都暖。')
      ]);
    }
  });
  addNpc(sc,{
    id:'xu',name:'徐达',x:414,y:240,style:'xu',dir:'left',
    action:async()=>{
      await say([
        L('徐达','臣徐达，愿为大明开疆拓土，万死不辞。'),
        L('朱元璋','起来。今日之后，这天下，要一起守。')
      ]);
    }
  });
  addNpc(sc,{
    id:'liu',name:'刘伯温',x:190,y:298,style:'liu',dir:'right',
    action:async()=>{
      await say([
        L('刘伯温','天下初定，当与民休息。'),
        L('朱元璋','先生说得对。朕吃过饿肚子的苦，不能再让百姓吃。'),
        L('刘伯温','如此，是大明之幸。')
      ]);
    }
  });
  addNpc(sc,{
    id:'li',name:'李善长',x:446,y:298,style:'li',dir:'left',
    action:async()=>{
      await say([
        L('李善长','百官已列班，吉时将至。'),
        L('朱元璋','好。'),
        L('李善长','臣，恭请陛下登基。')
      ]);
    }
  });
  addNpc(sc,{
    id:'tang',name:'汤和',x:156,y:330,style:'friend',dir:'right',
    action:async()=>{
      await say([
        L('汤和','重八……不，陛下。'),
        L('朱元璋','没人的时候，还叫重八。'),
        L('汤和','嘿。咱俩，真从孤庄走到这儿了。'),
        L('朱元璋','是啊。走了二十四年。')
      ]);
    }
  });

  addObject(sc,{
    id:'throne',x:320,y:188,label:'登基称帝',r:42,
    vis:()=>!S.flags.ascended,drawFn:null,action:ascendThrone
  });

  return sc;
}

const SCENE_BUILDERS={village:buildVillage,temple:buildTemple,camp:buildCamp,warRoom:buildWarRoom,throne:buildThrone};

function setScene(id,opts={}){
  const builder=SCENE_BUILDERS[id];
  if(!builder)return;
  const sc=builder();
  S.scene=sc;
  S.sceneTime=0;
  S.hintTime=0;
  S.particles=[];
  const sp=opts.spawn||sc.spawn;
  S.player.x=sp.x;
  S.player.y=sp.y;
  S.player.dir=sp.dir||'up';
  S.player.walk=0;
  S.player.walkDist=0;
  S.nearest=null;
  UI.placeLabel.textContent=sc.place;
  UI.chapterLabel.textContent=(CHAPTER_META[sc.chapter]||{}).label||'';
  UI.sceneTint.style.background=sc.tint;
}

function beginExplore(){
  S.mode='explore';
  setHudVisible(true);
  UI.battleHud.classList.add('hidden');
  UI.touchControls.classList.remove('hidden');
  if(S.chapter===1&&!S.flags.hintShown){
    S.flags.hintShown=true;
    S.hintTime=9;
  }
  syncTouch();
  updateNearest();
}

function syncTouch(){
  const on=S.touch&&(S.mode==='explore'||S.mode==='battle');
  UI.touchControls.classList.toggle('hidden',!on);
}

function collides(x,y){
  const sc=S.scene;
  if(!sc)return true;
  const b={x:x-5,y:y-7,w:10,h:7};
  const bo=sc.bounds;
  if(b.x<bo.x||b.x+b.w>bo.x+bo.w||b.y<bo.y||b.y+b.h>bo.y+bo.h)return true;
  for(const s of sc.solids){
    if(b.x<s.x+s.w&&b.x+b.w>s.x&&b.y<s.y+s.h&&b.y+b.h>s.y)return true;
  }
  return false;
}

function faceEachOther(npc){
  const p=S.player;
  const dx=p.x-npc.x,dy=p.y-npc.y;
  if(Math.abs(dx)>Math.abs(dy))npc.dir=dx>0?'right':'left';
  else npc.dir=dy>0?'down':'up';
  if(Math.abs(dx)>Math.abs(dy))p.dir=dx>0?'left':'right';
  else p.dir=dy>0?'up':'down';
}

function updateNearest(){
  const p=S.player;
  let best=null,bestD=9999;
  if(!S.scene)return;
  for(const npc of S.scene.npcs){
    if(!npc.vis())continue;
    const d=Math.hypot((p.x-npc.x)*.85,(p.y-npc.y)*1.05);
    if(d<40&&d<bestD){
      bestD=d;best={kind:'npc',ref:npc,x:npc.x,y:npc.y-34,label:npc.label||'交谈'};
    }
  }
  for(const obj of S.scene.objects){
    if(!obj.vis())continue;
    const d=Math.hypot((p.x-obj.x)*.85,(p.y-obj.y)*1.05);
    if(d<36&&d<bestD){
      bestD=d;best={kind:'obj',ref:obj,x:obj.x,y:obj.y-20,label:obj.label||'查看'};
    }
  }
  S.nearest=best;
}

function updateExplore(dt){
  const p=S.player,sc=S.scene;
  if(!sc)return;
  let dx=0,dy=0;
  if(keys.has('ArrowLeft')||keys.has('KeyA'))dx-=1;
  if(keys.has('ArrowRight')||keys.has('KeyD'))dx+=1;
  if(keys.has('ArrowUp')||keys.has('KeyW'))dy-=1;
  if(keys.has('ArrowDown')||keys.has('KeyS'))dy+=1;
  if(dx&&dy){dx*=.7071;dy*=.7071;}
  const speed=78;
  if(dx||dy){
    if(Math.abs(dx)>Math.abs(dy))p.dir=dx>0?'right':'left';
    else p.dir=dy>0?'down':'up';
    const nx=p.x+dx*speed*dt;
    if(!collides(nx,p.y))p.x=nx;
    const ny=p.y+dy*speed*dt;
    if(!collides(p.x,ny))p.y=ny;
    const moved=Math.hypot(dx,dy)*speed*dt;
    p.walkDist+=moved;
    p.stepTimer+=dt;
    const f=Math.floor(p.walkDist/7)%4;
    p.walk=f===1?1:f===3?2:0;
    if(p.stepTimer>.31){
      p.stepTimer=0;
    }
  }else{
    p.walk=0;
    p.stepTimer=0;
  }
  if(S.hintTime>0)S.hintTime=Math.max(0,S.hintTime-dt);
  updateNearest();
}

async function interact(){
  if(S.mode!=='explore'||!S.nearest)return;
  const target=S.nearest;
  if(target.kind==='npc'){
    faceEachOther(target.ref);
    const fn=target.ref.action;
    if(fn)await fn();
  }else{
    S.player.dir=S.player.y<target.ref.y?'down':'up';
    const fn=target.ref.action;
    if(fn)await fn();
  }
  updateNearest();
}

function spawnParticles(x,y,color,count=8,speed=35,life=.7,gravity=30){
  for(let i=0;i<count;i++){
    const a=Math.random()*Math.PI*2;
    const sp=speed*(.3+Math.random()*.7);
    S.particles.push({
      x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-10,
      life:life*(.6+Math.random()*.6),max:life,
      color,size:Math.random()>.7?2:1,gravity
    });
  }
}

function updateParticles(dt){
  for(const p of S.particles){
    p.life-=dt;
    p.vy+=p.gravity*dt;
    p.x+=p.vx*dt;
    p.y+=p.vy*dt;
  }
  S.particles=S.particles.filter(p=>p.life>0);
}

function drawParticles(c){
  for(const p of S.particles){
    const a=clamp(p.life/p.max,0,1);
    c.save();c.globalAlpha=a;
    c.fillStyle=p.color;
    c.fillRect(Math.round(p.x),Math.round(p.y),p.size,p.size);
    c.restore();
  }
}

/* =========================================================
   场景绘制
   ========================================================= */
function renderScene(time){
  const sc=S.scene;
  if(!sc)return;
  cScnSave();
  if(S.shakeTime>0){
    const f=S.shakeTime/S.shakeDur;
    ctx.translate((Math.random()*2-1)*S.shakeMag*f,(Math.random()*2-1)*S.shakeMag*f);
  }
  sc.ground(ctx,time);
  const items=[];
  for(const prop of sc.props)items.push({y:prop.baseY,draw:prop.draw});
  for(const obj of sc.objects){
    if(!obj.vis()||!obj.drawFn)continue;
    items.push({y:obj.y,draw:obj.drawFn});
  }
  for(const npc of sc.npcs){
    if(!npc.vis())continue;
    items.push({y:npc.y,draw:(c,t)=>{
      let dir=npc.dir;
      const d=Math.hypot(S.player.x-npc.x,S.player.y-npc.y);
      if(d<64){
        const dx=S.player.x-npc.x,dy=S.player.y-npc.y;
        if(Math.abs(dx)>Math.abs(dy))dir=dx>0?'right':'left';
        else dir=dy>0?'down':'up';
      }
      Art.drawHuman(c,npc.x,npc.y,npc.style,dir,0,t);
      if(d<122)drawNpcName(c,npc);
    }});
  }
  items.push({y:S.player.y,draw:(c,t)=>{
    Art.drawHuman(c,S.player.x,S.player.y,S.outfit,S.player.dir,S.player.walk,t);
  }});
  items.sort((a,b)=>a.y-b.y);
  for(const it of items)it.draw(ctx,time);
  drawSceneAmbient(time);
  drawParticles(ctx);
  if(S.mode==='explore'&&S.hintTime>0&&!S.touch){
    ctx.save();ctx.globalAlpha=clamp(S.hintTime/2,0,1)*.8;
    Art.AText(ctx,'方向键 移动　·　空格 交谈',18,346,9,'#d8c296','left');
    ctx.restore();
  }
  if(S.mode==='explore'&&S.nearest)drawInteractPrompt(S.nearest,time);
  ctx.restore();
}