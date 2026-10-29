/* =========================================================
   朱元璋的一生 · 即时战阵
   方向键走位，部曲自动接战，空格释放主帅绝技。
   ========================================================= */
'use strict';

const B_BOUNDS={x:28,y:104,w:584,h:240};

function bxClamp(v,a,b){return Math.max(a,Math.min(b,v));}

function createBattle(config){
  const plan=config.plan||{mods:{}};
  const mods=plan.mods||{};
  const maxHp=Math.round((config.playerHp||125)+(mods.hpBonus||0));
  const specialMax=Math.max(4,(config.special==='fire'?9:8)+(mods.specialCd||0));
  const b={
    config,plan,mods,time:0,ending:false,result:null,
    player:{
      x:320,y:292,hp:maxHp,maxHp,atk:16+(mods.heroAtk||0),
      speed:(config.special==='fire'?108:104)*(mods.speedMul||1),
      dir:'up',walk:0,walkDist:0,atkCd:0,specialCd:1.6,specialMax,
      hurt:0,invuln:0,attackAnim:0,ready:0
    },
    allies:[],enemies:[],banners:[],projectiles:[],effects:[],floaters:[],particles:[],corpses:[],
    bannerTotal:config.banners.length,bannersLeft:config.banners.length,
    phase:'banners',boss:null,bossTimer:-1,
    spawnTimer:1.4,reinforceTimer:8,
    maxEnemies:Math.max(4,(config.maxEnemies||8)+(mods.maxEnemies||0)),
    shakeTime:0,shakeDur:0,shakeMag:0,flash:0,ready:1.2,sfxTimer:0,
    hudTimer:0
  };
  b.banners=config.banners.map(bn=>({
    team:'enemy',type:'banner',x:bn.x,y:bn.y,
    hp:Math.round(bn.hp*1.6),maxHp:Math.round(bn.hp*1.6),
    emblem:bn.emblem||'元',dead:false,hurt:0,burn:0,burnTick:0
  }));
  b.bannersLeft=b.banners.length;
  // 主帅亲军
  const offsets=[
    [-48,8],[48,8],[-90,20],[90,20],[-30,28],[30,28],
    [-66,38],[66,38],[-102,42],[102,42],[0,44],[0,20]
  ];
  for(let i=0;i<Math.min(offsets.length,config.allyCount||10);i++){
    const [ox,oy]=offsets[i];
    b.allies.push(makeAlly(b,i%4===3?'archer':'spear',320+ox,292+oy));
  }
  for(let i=0;i<6;i++)spawnEnemy(b,i%4===3?'archer':'spear');
  addEffectText(b,config.title,'',2.2);
  return b;
}

function makeAlly(b,type,x,y){
  const archer=type==='archer';
  const mul=b.mods.allyHpMul||1;
  const hp=Math.round((archer?27:38)*mul);
  return {
    team:'ally',type,x,y,hp,maxHp:hp,
    atk:(archer?5.2:7)+(b.mods.allyAtk||0),
    speed:archer?43:53,
    range:archer?132:22,
    atkCd:.2+Math.random()*.4,dir:'up',walk:0,hurt:0,stun:0,dead:false,charge:0
  };
}

function makeEnemy(b,type,x,y){
  const archer=type==='archer';
  const hpMul=b.mods.enemyHp||1;
  const hp=Math.round((archer?24:31)*hpMul);
  return {
    team:'enemy',type,x,y,hp,maxHp:hp,
    atk:archer?4.2:5.1,
    speed:archer?32:39,
    range:archer?142:20,
    atkCd:.3+Math.random()*.7,dir:'down',walk:0,hurt:0,stun:0,dead:false
  };
}

function spawnEnemy(b,type){
  const pts=b.config.spawnPoints||[[320,104]];
  const pt=pts[Math.floor(Math.random()*pts.length)];
  const e=makeEnemy(b,type||(Math.random()<.26?'archer':'spear'),pt[0]+(Math.random()*36-18),pt[1]+(Math.random()*14-7));
  b.enemies.push(e);
  spawnBattleParticles(b,e.x,e.y-4,'#8a5b3c',4,20,.4,10);
}

function spawnAlly(b,type='spear',x=null,y=null){
  const a=makeAlly(b,type,x===null?320+(Math.random()*120-60):x,y===null?336:y);
  b.allies.push(a);
  spawnBattleParticles(b,a.x,a.y-4,'#d8ad64',4,20,.4,10);
  return a;
}

function addBattleShake(b,dur=0.25,mag=5){
  b.shakeTime=Math.max(b.shakeTime,dur);
  b.shakeDur=Math.max(b.shakeDur,dur);
  b.shakeMag=Math.max(b.shakeMag,mag);
}

function spawnBattleParticles(b,x,y,color,count=8,speed=35,life=.7,gravity=20){
  for(let i=0;i<count;i++){
    const a=Math.random()*Math.PI*2;
    const s=speed*(.3+Math.random()*.7);
    b.particles.push({
      x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-12,
      life:life*(.6+Math.random()*.6),max:life,
      color,size:Math.random()>.7?2:1,gravity
    });
  }
}

function addEffectText(b,text,sub='',life=1.8,y=118){
  b.effects.push({type:'text',text,sub,x:320,y,life,max:life});
}

function addRing(b,x,y,maxR,color='#e7b55c',life=.55){
  b.effects.push({type:'ring',x,y,r:8,maxR,life,max:life,color});
}

function addFloater(b,x,y,text,color='#ffe0a3',size=8){
  b.floaters.push({x,y,text,color,size,life:.9,max:.9});
}

function unitDist(a,b){
  return Math.hypot(a.x-b.x,(a.y-b.y)*.82);
}

function nearestEnemy(b,x,y,maxD=9999,includeBanners=false){
  let best=null,bd=maxD;
  for(const e of b.enemies){
    if(e.dead)continue;
    const d=unitDist({x,y},e);
    if(d<bd){bd=d;best=e;}
  }
  if(includeBanners){
    for(const bn of b.banners){
      if(bn.dead)continue;
      const d=Math.hypot(x-bn.x,(y-bn.y)*.8);
      if(d<bd){bd=d;best=bn;}
    }
  }
  return best;
}

function nearestFriendForEnemy(b,e){
  let best=b.player,bd=unitDist(e,b.player);
  for(const a of b.allies){
    if(a.dead)continue;
    const d=unitDist(e,a);
    if(d<bd){bd=d;best=a;}
  }
  return best;
}

function nearestBanner(b,x,y){
  let best=null,bd=9999;
  for(const bn of b.banners){
    if(bn.dead)continue;
    const d=Math.hypot(x-bn.x,(y-bn.y)*.8);
    if(d<bd){bd=d;best=bn;}
  }
  return best;
}

function moveUnit(u,tx,ty,speed,dt,b){
  const dx=tx-u.x,dy=ty-u.y;
  const d=Math.hypot(dx,dy)||1;
  u.x+=dx/d*speed*dt;
  u.y+=dy/d*speed*dt;
  u.x=bxClamp(u.x,B_BOUNDS.x,B_BOUNDS.x+B_BOUNDS.w);
  u.y=bxClamp(u.y,B_BOUNDS.y,B_BOUNDS.y+B_BOUNDS.h);
  if(Math.abs(dx)>Math.abs(dy))u.dir=dx>0?'right':'left';
  else u.dir=dy>0?'down':'up';
  u.walk=1;
}

function damageUnit(b,target,dmg,source,fromPlayer=false){
  if(!target||target.dead)return;
  target.hp-=dmg;
  target.hurt=.16;
  addFloater(b,target.x+(Math.random()*8-4),target.y-(target.type==='banner'?72:24),`-${Math.round(dmg)}`,fromPlayer?'#ffe39a':'#f3ddc0',fromPlayer?9:8);
  spawnBattleParticles(b,target.x,target.y-16,fromPlayer?'#f0b75d':'#c76a4b',fromPlayer?7:4,38,.45,22);
  if(fromPlayer){
    b.sfxTimer=Math.max(0,b.sfxTimer);
    if(b.sfxTimer<=0){Sfx.sfx('slash');b.sfxTimer=.09;}
  }
  if(target.type==='banner'){
    if(target.hp<=0)destroyBanner(b,target);
    return;
  }
  if(target.hp<=0){
    if(target.type==='boss'){
      target.dead=true;
      b.corpses.push({x:target.x,y:target.y,team:'enemy',type:'boss',life:5,max:5});
      addRing(b,target.x,target.y,100,'#f4c46e',.9);
      addEffectText(b,'敌将已破','',2.2);
      addBattleShake(b,.8,11);
      Sfx.sfx('explosion');
      endBattle(true);
    }else{
      target.dead=true;
      b.corpses.push({x:target.x,y:target.y,team:target.team,type:target.type,life:4,max:4});
      spawnBattleParticles(b,target.x,target.y-8,target.team==='ally'?'#8f5a42':'#5d3a32',8,30,.6,35);
    }
  }
}

function destroyBanner(b,bn){
  if(bn.dead)return;
  bn.dead=true;
  bn.hp=0;
  b.bannersLeft--;
  b.bannersLeft=Math.max(0,b.bannersLeft);
  const px=bn.x,py=bn.y;
  addRing(b,px,py-20,110,'#f1b55d',.9);
  addBattleShake(b,.55,9);
  Sfx.sfx('explosion');
  spawnBattleParticles(b,px,py-30,'#e58c3d',26,85,1.1,20);
  spawnBattleParticles(b,px,py-24,'#3b3329',18,45,1.4,-8);
  b.player.hp=Math.min(b.player.maxHp,b.player.hp+15);
  addFloater(b,b.player.x,b.player.y-28,'军心 +15','#a9d27b',9);
  addEffectText(b,'帅旗已破',`敌旗 ${b.bannerTotal-b.bannersLeft} / ${b.bannerTotal}`,1.5,150);
  for(let i=0;i<2;i++)spawnAlly(b,i?'archer':'spear',320+(i?28:-28),338);
  if(b.bannersLeft<=0){
    b.phase='bossWait';
    b.bossTimer=2.1;
    b.spawnTimer=999;
    addEffectText(b,'敌将现身','准备迎战',1.8);
  }
}

function spawnBoss(b){
  const cfg=b.config.boss;
  if(!cfg)return;
  const hp=Math.round(cfg.hp*(b.mods.bossHp||1));
  const boss={
    team:'enemy',type:'boss',boss:true,x:cfg.x,y:cfg.y,
    hp,maxHp:hp,atk:9,speed:32,range:36,atkCd:1.2,specialCd:2.4,
    dir:'down',walk:0,hurt:0,stun:0,dead:false,
    name:cfg.name,style:cfg.style||'yuanSoldier'
  };
  b.enemies.push(boss);
  b.boss=boss;
  b.phase='boss';
  b.spawnTimer=5.5;
  addBattleShake(b,.6,10);
  addRing(b,boss.x,boss.y,100,'#d0573f',1.1);
  addEffectText(b,'敌将现身',cfg.name,2.2);
  Sfx.sfx('special');
  spawnBattleParticles(b,boss.x,boss.y-20,'#e07b3f',22,55,1,20);
}

function battleAttackMelee(b,attacker,target){
  const dmg=attacker.atk*(attacker.team==='ally'&&attacker.type==='spear'?1:1);
  damageUnit(b,target,dmg,attacker,attacker.team==='ally'&&attacker===b.player);
  if(attacker===b.player){
    attacker.attackAnim=.18;
    addSlashEffect(b,target.x,target.y-14,attacker.dir);
  }else{
    b.effects.push({type:'spark',x:target.x,y:target.y-12,life:.16,max:.16,color:'#e4bd76'});
  }
}

function addSlashEffect(b,x,y,dir){
  b.effects.push({type:'slash',x,y,dir,life:.18,max:.18,color:'#f5d28a'});
}

function shootArrow(b,unit,target){
  const sx=unit.x,sy=unit.y-11;
  const dx=target.x-sx,dy=(target.y-10)-sy;
  const d=Math.hypot(dx,dy)||1;
  const speed=205;
  b.projectiles.push({
    x:sx,y:sy,vx:dx/d*speed,vy:dy/d*speed,
    team:unit.team,dmg:unit.atk,life:2.3,dead:false
  });
  unit.walk=0;
}

function updatePlayerBattle(b,dt){
  const p=b.player;
  p.atkCd=Math.max(0,p.atkCd-dt);
  p.specialCd=Math.max(0,p.specialCd-dt);
  p.hurt=Math.max(0,p.hurt-dt);
  p.invuln=Math.max(0,p.invuln-dt);
  p.attackAnim=Math.max(0,p.attackAnim-dt);

  let dx=0,dy=0;
  if(keys.has('ArrowLeft')||keys.has('KeyA'))dx-=1;
  if(keys.has('ArrowRight')||keys.has('KeyD'))dx+=1;
  if(keys.has('ArrowUp')||keys.has('KeyW'))dy-=1;
  if(keys.has('ArrowDown')||keys.has('KeyS'))dy+=1;
  if(dx&&dy){dx*=.7071;dy*=.7071;}
  if(dx||dy){
    if(Math.abs(dx)>Math.abs(dy))p.dir=dx>0?'right':'left';
    else p.dir=dy>0?'down':'up';
    p.x=bxClamp(p.x+dx*p.speed*dt,B_BOUNDS.x,B_BOUNDS.x+B_BOUNDS.w);
    p.y=bxClamp(p.y+dy*p.speed*dt,B_BOUNDS.y,B_BOUNDS.y+B_BOUNDS.h);
    p.walk=(Math.floor((b.time*10)%4)===1||Math.floor((b.time*10)%4)===3)?1:0;
  }else{
    p.walk=0;
  }
  const target=nearestEnemy(b,p.x,p.y,40,true);
  if(target&&p.atkCd<=0){
    p.atkCd=.36;
    p.dir=target.x>p.x?'right':target.x<p.x?'left':(target.y>p.y?'down':'up');
    battleAttackMelee(b,p,target);
  }
}

function updateAllies(b,dt){
  for(const a of b.allies){
    if(a.dead)continue;
    a.hurt=Math.max(0,a.hurt-dt);
    a.stun=Math.max(0,a.stun-dt);
    a.atkCd=Math.max(0,a.atkCd-dt);
    if(a.stun>0)continue;
    let target=nearestEnemy(b,a.x,a.y,9999,false);
    if(target&&unitDist(a,target)>150){
      const banner=nearestBanner(b,a.x,a.y);
      if(banner&&unitDist(a,target)>130)target=banner;
    }
    if(!target)target=nearestBanner(b,a.x,a.y);
    if(!target)continue;
    const dist=unitDist(a,target);
    if(a.type==='archer'){
      if(dist<56){
        const dx=a.x-target.x,dy=a.y-target.y,d=Math.hypot(dx,dy)||1;
        moveUnit(a,a.x+dx/d*60,a.y+dy/d*60,a.speed*.8,dt,b);
        a.walk=1;
      }else if(dist>a.range){
        moveUnit(a,target.x,target.y,a.speed,dt,b);
        a.walk=1;
      }else{
        a.walk=0;
        a.dir=target.x>a.x?'right':target.x<a.x?'left':(target.y>a.y?'down':'up');
        if(a.atkCd<=0){a.atkCd=1.15;shootArrow(b,a,target);}
      }
    }else{
      if(dist>a.range){
        moveUnit(a,target.x,target.y,a.speed,dt,b);
        a.walk=1;
      }else{
        a.walk=0;
        a.dir=target.x>a.x?'right':target.x<a.x?'left':(target.y>a.y?'down':'up');
        if(a.atkCd<=0){a.atkCd=.86;battleAttackMelee(b,a,target);}
      }
    }
  }
}

function updateEnemies(b,dt){
  for(const e of b.enemies){
    if(e.dead||e.boss)continue;
    e.hurt=Math.max(0,e.hurt-dt);
    e.stun=Math.max(0,e.stun-dt);
    e.atkCd=Math.max(0,e.atkCd-dt);
    if(e.stun>0)continue;
    const target=nearestFriendForEnemy(b,e);
    if(!target)continue;
    const dist=unitDist(e,target);
    if(e.type==='archer'){
      if(dist<54){
        const dx=e.x-target.x,dy=e.y-target.y,d=Math.hypot(dx,dy)||1;
        moveUnit(e,e.x+dx/d*60,e.y+dy/d*60,e.speed*.8,dt,b);
      }else if(dist>e.range){
        moveUnit(e,target.x,target.y,e.speed,dt,b);
        e.walk=1;
      }else{
        e.walk=0;
        e.dir=target.x>e.x?'right':target.x<e.x?'left':(target.y>e.y?'down':'up');
        if(e.atkCd<=0){e.atkCd=1.3;shootArrow(b,e,target);}
      }
    }else{
      if(dist>e.range){
        moveUnit(e,target.x,target.y,e.speed,dt,b);
        e.walk=1;
      }else{
        e.walk=0;
        e.dir=target.x>e.x?'right':target.x<e.x?'left':(target.y>e.y?'down':'up');
        if(e.atkCd<=0){
          e.atkCd=.95;
          if(target===b.player)damagePlayerB(b,e.atk,false);
          else damageUnit(b,target,e.atk,e,false);
        }
      }
    }
  }
}

function damagePlayerB(b,dmg,heavy=false){
  const p=b.player;
  if(p.invuln>0||b.ending)return;
  p.hp-=dmg;
  p.hurt=.2;
  p.invuln=.28;
  addFloater(b,p.x,p.y-30,`-${Math.round(dmg)}`,'#ff7d62',9);
  addBattleShake(b,.25,heavy?8:4);
  b.flash=.14;
  Sfx.sfx('hit');
  if(p.hp<=0){
    p.hp=0;
    endBattle(false);
  }
}

function updateBoss(b,dt){
  const boss=b.boss;
  if(!boss||boss.dead)return;
  boss.hurt=Math.max(0,boss.hurt-dt);
  boss.atkCd=Math.max(0,boss.atkCd-dt);
  boss.specialCd=Math.max(0,boss.specialCd-dt);
  const p=b.player;
  const dist=unitDist(boss,p);
  if(dist>boss.range){
    moveUnit(boss,p.x,p.y,boss.speed,dt,b);
    boss.walk=1;
  }else{
    boss.walk=0;
    boss.dir=p.x>boss.x?'right':p.x<boss.x?'left':(p.y>boss.y?'down':'up');
    if(boss.atkCd<=0){
      boss.atkCd=1.45;
      damagePlayerB(b,9,false);
      addSlashEffect(b,p.x,p.y-14,boss.dir);
      addBattleShake(b,.2,4);
    }
  }
  if(boss.specialCd<=0&&dist<110){
    boss.specialCd=4.4;
    addRing(b,boss.x,boss.y-4,130,'#d4533c',.75);
    addBattleShake(b,.5,8);
    Sfx.sfx('special');
    addEffectText(b,'','',.1);
    for(const a of b.allies){
      if(!a.dead&&unitDist(boss,a)<95)damageUnit(b,a,10,boss,false);
    }
    if(dist<110)damagePlayerB(b,14,true);
  }
  for(const a of b.allies){
    if(a.dead)continue;
    if(unitDist(boss,a)<=boss.range&&boss.atkCd<=0){
      // boss sweep occasionally catches nearby troops
      if(Math.random()<.4){
        boss.atkCd=.8;
        damageUnit(b,a,7,boss,false);
      }
    }
  }
}

function updateProjectiles(b,dt){
  for(const pr of b.projectiles){
    if(pr.dead)continue;
    pr.x+=pr.vx*dt;pr.y+=pr.vy*dt;pr.life-=dt;
    if(pr.x<0||pr.x>640||pr.y<50||pr.y>360||pr.life<=0){pr.dead=true;continue;}
    if(pr.team==='enemy'){
      for(const a of b.allies){
        if(!a.dead&&Math.hypot(pr.x-a.x,pr.y-(a.y-8))<8){
          damageUnit(b,a,pr.dmg,pr,false);pr.dead=true;break;
        }
      }
      const p=b.player;
      if(!pr.dead&&Math.hypot(pr.x-p.x,pr.y-(p.y-10))<9){
        damagePlayerB(b,pr.dmg,false);
        pr.dead=true;
      }
    }else{
      for(const e of b.enemies){
        if(e.dead)continue;
        if(Math.hypot(pr.x-e.x,pr.y-(e.y-8))<(e.boss?14:8)){
          damageUnit(b,e,pr.dmg,pr,false);pr.dead=true;break;
        }
      }
      if(!pr.dead){
        for(const bn of b.banners){
          if(bn.dead)continue;
          if(Math.hypot(pr.x-bn.x,pr.y-(bn.y-20))<20){
            damageUnit(b,bn,pr.dmg,pr,false);pr.dead=true;break;
          }
        }
      }
    }
  }
  b.projectiles=b.projectiles.filter(p=>!p.dead);
}

function applyBurn(b,dt){
  const targets=[...b.enemies,...b.banners];
  for(const t of targets){
    if(t.dead||!t.burn)continue;
    t.burn-=dt;
    t.burnTick-=dt;
    if(t.burnTick<=0){
      t.burnTick=.55;
      damageUnit(b,t,4.5,null,false);
      spawnBattleParticles(b,t.x+(Math.random()*12-6),t.y-18,'#e88337',2,12,.45,-15);
    }
  }
}

function updateSpawns(b,dt){
  if(b.phase==='banners'){
    b.spawnTimer-=dt;
    const alive=b.enemies.filter(e=>!e.dead&&!e.boss).length;
    if(alive<b.maxEnemies&&b.spawnTimer<=0){
      spawnEnemy(b);
      b.spawnTimer=2.25+Math.random()*1.47;
    }
  }else if(b.phase==='bossWait'){
    b.bossTimer-=dt;
    if(b.bossTimer<=0)spawnBoss(b);
  }else if(b.phase==='boss'){
    b.spawnTimer-=dt;
    const alive=b.enemies.filter(e=>!e.dead&&!e.boss).length;
    if(alive<5&&b.spawnTimer<=0){
      spawnEnemy(b);
      b.spawnTimer=5.5;
    }
  }
  b.reinforceTimer-=dt;
  const aliveAllies=b.allies.filter(a=>!a.dead).length;
  if(aliveAllies<5&&b.reinforceTimer<=0){
    spawnAlly(b,'spear',320+(Math.random()*140-70),336);
    b.reinforceTimer=8.5;
    addFloater(b,320,334,'援军抵达','#b9d88a',8);
  }
}

function updateBattle(dt){
  const b=S.battle;
  if(!b)return;
  b.time+=dt;
  advanceBattleFx(b,dt);
  if(b.ending||S.mode!=='battle')return;
  if(b.ready>0){b.ready-=dt;updateBattleHUD();return;}
  updatePlayerBattle(b,dt);
  updateAllies(b,dt);
  updateEnemies(b,dt);
  updateBoss(b,dt);
  updateProjectiles(b,dt);
  applyBurn(b,dt);
  updateSpawns(b,dt);
  b.enemies=b.enemies.filter(e=>!e.dead);
  b.allies=b.allies.filter(a=>!a.dead);
  updateBattleHUD();
}

function updateBattleVisuals(dt){
  const b=S.battle;
  if(!b)return;
  b.time+=dt;
  advanceBattleFx(b,dt);
}

function advanceBattleFx(b,dt){
  b.flash=Math.max(0,b.flash-dt*3.5);
  b.sfxTimer=Math.max(0,b.sfxTimer-dt);
  if(b.shakeTime>0)b.shakeTime-=dt;
  for(const e of b.effects){e.life-=dt;if(e.type==='ring')e.r+=e.maxR*dt/Math.max(.1,e.max);}
  b.effects=b.effects.filter(e=>e.life>0);
  for(const f of b.floaters){f.life-=dt;f.y-=16*dt;}
  b.floaters=b.floaters.filter(f=>f.life>0);
  for(const p of b.particles){
    p.life-=dt;p.vy+=p.gravity*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
  }
  b.particles=b.particles.filter(p=>p.life>0);
  for(const c of b.corpses)c.life-=dt;
  b.corpses=b.corpses.filter(c=>c.life>0);
  for(const bn of b.banners){
    if(bn.dead)continue;
    bn.hurt=Math.max(0,bn.hurt-dt);
    if(bn.burn>0&&Math.random()<dt*7){
      spawnBattleParticles(b,bn.x+(Math.random()*24-12),bn.y-20-Math.random()*30,'#e68a3a',1,12,.6,-16);
    }
  }
}

/* =========================================================
   绝技
   ========================================================= */
function castBattleSpecial(){
  const b=S.battle;
  if(!b||b.ending||S.mode!=='battle'||b.ready>0)return;
  const p=b.player;
  if(p.specialCd>0)return;
  p.specialCd=p.specialMax;
  p.invuln=.55;
  const power=b.mods.specialPower||1;
  if(b.config.special==='fire'){
    Sfx.sfx('fire');
    addBattleShake(b,.6,9);
    b.flash=.35;
    addRing(b,p.x,p.y-6,190,'#f7a449',.9);
    addEffectText(b,'火 攻','FIRE ATTACK',1.3,156);
    const targets=[...b.enemies,...b.banners].filter(t=>!t.dead&&Math.hypot(t.x-p.x,(t.y-p.y)*.85)<190);
    for(const t of targets){
      damageUnit(b,t,46*power,null,true);
      if(!t.dead){t.burn=3.4;t.burnTick=.21;}
      spawnBattleParticles(b,t.x,t.y-20,'#f0a143',14,55,.9,5);
      addRing(b,t.x,t.y-12,45,'#e97b2f',.6);
    }
    for(let i=0;i<3;i++){
      const a=Math.random()*Math.PI*2;
      const fx=p.x+Math.cos(a)*(80+i*46),fy=p.y+Math.sin(a)*(50+i*28);
      addRing(b,fx,fy,38+i*14,'#df7b32',.7);
    }
  }else{
    Sfx.sfx('special');
    addBattleShake(b,.6,10);
    b.flash=.3;
    addRing(b,p.x,p.y-6,150,'#ecc16a',.8);
    addEffectText(b,'战 吼','BATTLE CRY',1.2,156);
    for(const e of b.enemies){
      if(!e.dead&&Math.hypot(e.x-p.x,(e.y-p.y)*.85)<155){
        damageUnit(b,e,36*power,null,true);
        if(!e.dead)e.stun=1.4;
      }
    }
    for(const bn of b.banners){
      if(!bn.dead&&Math.hypot(bn.x-p.x,(bn.y-p.y)*.8)<125)damageUnit(b,bn,24*power,null,true);
    }
    for(const a of b.allies){
      if(!a.dead&&!a.dead)a.stun=0;
    }
  }
}

/* =========================================================
   战斗流程
   ========================================================= */
async function battleRound(config){
  if(!UI.fade.classList.contains('on'))await fadeOut(300);
  S.titleVisible=false;
  UI.titleScreen.classList.add('hidden');
  UI.deployScreen.classList.add('hidden');
  UI.chapterCard.classList.add('hidden');
  UI.cinematic.classList.add('hidden');
  S.mode='cutscene';
  setHudVisible(false);setObjective('');
  S.battle=createBattle(config);
  UI.defeatScreen.classList.add('hidden');
  UI.battleBanner.classList.add('hidden');
  UI.battleHud.classList.remove('hidden');
  S.mode='battle';
  Sfx.setMusic('battle');
  updateBattleHUD();
  await fadeIn(430);
  if(!S.battle)return 'lose';
  S.battle.ready=.35;
  return new Promise(resolve=>{
    if(!S.battle)return resolve('lose');
    S.battle.resolve=resolve;
  });
}

async function playBattle(config){
  while(true){
    const result=await battleRound(config);
    if(result==='win'){
      clearBattleUI();
      return true;
    }
    const choice=await defeatChoice();
    if(choice==='retry'){
      UI.defeatScreen.classList.add('hidden');
      S.defeat=null;
      S.battle=null;
      continue;
    }
    location.reload();
    return false;
  }
}

function clearBattleUI(){
  UI.battleHud.classList.add('hidden');
  UI.battleBanner.classList.add('hidden');
  UI.defeatScreen.classList.add('hidden');
  S.battle=null;
  S.mode='cutscene';
  Sfx.setMusic('explore');
  syncTouch();
}

function defeatChoice(){
  return new Promise(resolve=>{
    S.mode='defeat';
    S.defeat={resolve};
    setHudVisible(false);
    UI.battleHud.classList.add('hidden');
    UI.defeatScreen.classList.remove('hidden');
    syncTouch();
  });
}

function retryBattle(){
  if(S.mode!=='defeat'||!S.defeat)return;
  const resolve=S.defeat.resolve;
  S.defeat=null;
  UI.defeatScreen.classList.add('hidden');
  Sfx.sfx('confirm');
  resolve('retry');
}

async function endBattle(win){
  const b=S.battle;
  if(!b||b.ending)return;
  b.ending=true;
  b.result=win?'win':'lose';
  if(win){
    S.mode='battleEnd';
    Sfx.sfx('victory');
    Sfx.setMusic('explore');
    UI.battleBanner.classList.remove('hidden');
    addBattleShake(b,.7,7);
    await wait(1900);
    UI.battleBanner.classList.add('hidden');
    if(b.resolve)b.resolve('win');
  }else{
    b.player.hp=0;
    S.mode='defeat';
    Sfx.sfx('defeat');
    Sfx.setMusic(null);
    setHudVisible(false);
    UI.battleHud.classList.add('hidden');
    syncTouch();
    await wait(360);
    if(b.resolve)b.resolve('lose');
  }
}

/* =========================================================
   HUD
   ========================================================= */
function updateBattleHUD(){
  const b=S.battle;
  if(!b)return;
  const p=b.player;
  const hpPct=clamp(p.hp/p.maxHp,0,1);
  UI.hpFill.style.width=`${hpPct*100}%`;
  UI.hpText.textContent=`${Math.max(0,Math.ceil(p.hp))} / ${p.maxHp}`;
  const alive=b.allies.filter(a=>!a.dead).length;
  UI.troopText.textContent=`部曲 ${alive}`;
  UI.specialName.textContent=b.config.specialName||'绝技';
  const ready=clamp(1-p.specialCd/p.specialMax,0,1);
  UI.specialFill.style.width=`${ready*100}%`;
  if(p.specialCd<=0){
    UI.specialState.textContent='就绪';
    UI.specialState.classList.remove('waiting');
  }else{
    UI.specialState.textContent=`${Math.ceil(p.specialCd)} 秒`;
    UI.specialState.classList.add('waiting');
  }
  UI.bannerPips.innerHTML=b.banners.map(bn=>
    `<i class="${bn.dead?'dead':'on'}"></i>`
  ).join('');
  if(b.phase==='banners'){
    UI.battleObjective.textContent=`摧毁敌军三面帅旗 · ${b.bannerTotal-b.bannersLeft} / ${b.bannerTotal}`;
  }else if(b.phase==='bossWait'){
    UI.battleObjective.textContent='敌将将至，准备迎战';
  }else if(b.phase==='boss'){
    UI.battleObjective.textContent=`击败 ${b.config.boss?b.config.boss.name:'敌将'}`;
  }
}

/* =========================================================
   战斗绘制
   ========================================================= */
function drawSmallBoat(c,x,y,s,team,t){
  const ally=team==='ally';
  c.save();c.translate(x,y);c.scale(s,s);
  Art.SHADOW(c,0,3,14,3,.3);
  // wake
  c.globalAlpha=.22;
  Art.R(c,-22,2,7,1,'#b6ddd2');Art.R(c,16,3,8,1,'#b6ddd2');
  Art.R(c,-18,-1,4,1,'#8fc1b6');Art.R(c,14,-1,5,1,'#8fc1b6');
  c.globalAlpha=1;
  // hull
  c.fillStyle=ally?'#4a2a18':'#2c2026';
  c.beginPath();c.moveTo(-15,0);c.lineTo(-11,-5);c.lineTo(12,-5);c.lineTo(16,0);c.lineTo(11,5);c.lineTo(-11,5);c.closePath();c.fill();
  Art.R(c,-12,-5,24,2,ally?'#9a6234':'#584048');
  Art.R(c,-13,1,27,2,ally?'#7b4928':'#47323b');
  Art.R(c,-10,3,20,1,'#1c1410');
  // mast & sail
  Art.R(c,-1,-22,2,18,'#6a4a2b');
  Art.R(c,-7,-21,14,1,ally?'#d0a05b':'#8c7048');
  const sway=Math.sin(t*3+x*.05)*1;
  c.fillStyle=ally?'#bc4533':'#52345e';
  c.beginPath();c.moveTo(2,-21);c.lineTo(11+sway,-17);c.lineTo(10+sway,-6);c.lineTo(2,-4);c.closePath();c.fill();
  Art.R(c,2,-12,9,1,ally?'#e3b36b':'#9b7d50');
  // little lantern
  Art.R(c,9,-3,3,4,'#721f18');
  Art.R(c,10,-2,1,2,'#f0b45c');
  c.restore();
}

function drawHpBar(c,x,y,w,ratio,col='#c6422e'){
  ratio=clamp(ratio,0,1);
  Art.R(c,x-1,y-1,w+2,5,'rgba(0,0,0,.65)');
  Art.R(c,x,y,w,3,'#2a1710');
  Art.R(c,x,y,w*ratio,3,col);
  Art.R(c,x,y,w*ratio,1,'rgba(255,220,160,.4)');
}

function renderBattle(time){
  const b=S.battle;
  if(!b)return;
  ctx.save();
  if(b.shakeTime>0){
    const f=b.shakeTime/Math.max(.01,b.shakeDur);
    ctx.translate((Math.random()*2-1)*b.shakeMag*f,(Math.random()*2-1)*b.shakeMag*f);
  }
  Art.battleGround(ctx,b.time,b.config.kind,b.flash);

  // ambient battle scenery
  if(b.config.kind==='land'){
    Art.drawTent(ctx,66,168,84,58,b.time,{color:'#4c4131',dark:'#30291e',light:'#62553f',flag:'#7a241b'});
    Art.drawTent(ctx,574,168,84,58,b.time,{color:'#4c4131',dark:'#30291e',light:'#62553f',flag:'#7a241b'});
    Art.drawTorch(ctx,36,180,b.time);
    Art.drawTorch(ctx,604,180,b.time);
    for(let i=0;i<3;i++){
      const x=80+i*230,y=160+Math.sin(b.time*.7+i)*4;
      Art.R(ctx,x,y,3,1,'#5d543a');
    }
  }else{
    // distant burning wrecks
    ctx.save();ctx.globalAlpha=.32;
    Art.drawWarship(ctx,64,208,.72,'enemy',b.time,true,false);
    Art.drawWarship(ctx,586,192,.6,'enemy',b.time,true,false);
    ctx.restore();
    drawSmallBoat(ctx,68,332,.95,'ally',b.time);
    drawSmallBoat(ctx,572,336,.95,'ally',b.time);
    for(let i=0;i<6;i++){
      const x=(i*127+40+Math.sin(b.time*.4+i)*8)%640,y=84+hash2(i,5)*20;
      ctx.save();ctx.globalAlpha=.2;Art.R(ctx,x,y,4,1,'#d86b39');ctx.restore();
    }
    for(let i=0;i<26;i++){
      const life=((b.time*20+i*37)%320)/320;
      const x=(i*97+Math.sin(b.time*.5+i)*30)%640;
      const y=340-life*250;
      ctx.save();ctx.globalAlpha=Math.max(0,(1-life)*.45);Art.R(ctx,x,y,life>.6?2:1,life>.6?2:1,i%3?'#e58a3f':'#f4bd69');ctx.restore();
    }
  }

  // banners / warships
  for(const bn of b.banners){
    if(b.config.kind==='water'){
      if(bn.dead){
        ctx.save();ctx.globalAlpha=.45;
        Art.drawWarship(ctx,bn.x,bn.y+12,1.15,'enemy',b.time,true,false);
        ctx.restore();
      }else{
        Art.drawWarship(ctx,bn.x,bn.y,1.2,'enemy',b.time,!!bn.burn,false);
        drawBannerHpBar(ctx,bn,'water');
        drawBannerMarker(ctx,bn,b.time);
      }
    }else{
      if(bn.dead){
        ctx.save();ctx.globalAlpha=.4;
        Art.drawWarBannerLarge(ctx,bn.x,bn.y+4,b.time,'enemy',bn.emblem);
        ctx.restore();
      }else{
        Art.drawWarBannerLarge(ctx,bn.x,bn.y,b.time,'enemy',bn.emblem);
        drawBannerHpBar(ctx,bn,'land');
        drawBannerMarker(ctx,bn,b.time);
      }
    }
  }

  // corpses
  for(const c of b.corpses){
    const a=clamp(c.life/c.max,0,1);
    ctx.save();ctx.globalAlpha=a*.55;
    Art.R(ctx,c.x-7,c.y-2,14,3,'#3c1813');
    Art.R(ctx,c.x-4,c.y-7,8,5,c.team==='ally'?'#56352a':'#2c3338');
    ctx.restore();
  }

  // sort living units
  const items=[];
  for(const u of b.allies)if(!u.dead)items.push(u);
  for(const u of b.enemies)if(!u.dead)items.push(u);
  items.sort((a,b)=>a.y-b.y);
  for(const u of items){
    if(u.boss){drawBoss(ctx,b,u,time);continue;}
    if(b.config.kind==='water'){
      drawSmallBoat(ctx,u.x,u.y+1,.48,u.team,time);
      Art.drawMiniSoldier(ctx,u.x,u.y-2,u.team,u.type,u.walk,time);
    }else{
      Art.drawMiniSoldier(ctx,u.x,u.y,u.team,u.type,u.walk,time);
    }
    if(u.hurt>0)Art.R(ctx,u.x-5,u.y-16,10,1,'rgba(255,120,80,.4)');
    if(u.hp<u.maxHp)drawHpBar(ctx,u.x-7,u.y-22,14,u.hp/u.maxHp,u.team==='ally'?'#5f9a5a':'#b54332');
    if(u.burn>0){
      ctx.save();ctx.globalAlpha=.7;
      Art.R(ctx,u.x-3,u.y-28+Math.sin(b.time*9)*2,2,5,'#e68a3a');
      Art.R(ctx,u.x+2,u.y-31+Math.cos(b.time*8)*2,2,6,'#f2b653');
      ctx.restore();
    }
  }

  // player
  const p=b.player;
  if(b.config.kind==='water')drawSmallBoat(ctx,p.x,p.y+2,.9,'ally',b.time);
  ctx.save();
  ctx.globalAlpha=.7;
  ctx.strokeStyle='#d9a84e';ctx.lineWidth=1;
  ctx.beginPath();ctx.ellipse(p.x,p.y+1,b.config.kind==='water'?16:14,b.config.kind==='water'?7:5,0,0,Math.PI*2);ctx.stroke();
  ctx.globalAlpha=.55+.2*Math.sin(b.time*4);
  Art.CIRC_EDGE(ctx,p.x,p.y-12,20,'#e7c274');
  ctx.restore();
  ctx.save();
  if(p.hurt>0)ctx.globalAlpha=.65;
  Art.drawHuman(ctx,p.x,p.y-2,S.outfit,p.dir,p.walk,b.time);
  ctx.restore();
  Art.AText(ctx,'朱元璋',p.x,p.y-35,7,'#efce8b','center');
  if(p.attackAnim>0){
    const a=p.attackAnim/.18;
    ctx.save();ctx.globalAlpha=a;ctx.strokeStyle='#f5d38b';ctx.lineWidth=2;
    ctx.beginPath();
    const ox=p.dir==='left'?-1:p.dir==='right'?1:0;
    const oy=p.dir==='up'?-1:p.dir==='down'?1:0;
    ctx.arc(p.x+ox*8,p.y-14+oy*5,17,-1.2+(ox<0?Math.PI:0),1.2+(ox<0?Math.PI:0));
    ctx.stroke();ctx.restore();
  }
  if(p.invuln>0){
    ctx.save();ctx.globalAlpha=.22;Art.CIRC(ctx,p.x,p.y-12,18,'#f6d27f');ctx.restore();
  }
  if(p.specialCd<=0&&!b.ending){
    ctx.save();ctx.globalAlpha=.5+.3*Math.sin(b.time*5);
    Art.CIRC_EDGE(ctx,p.x,p.y-12,19,'#f0c46d');ctx.restore();
  }

  // projectiles
  for(const pr of b.projectiles){
    ctx.save();ctx.strokeStyle=pr.team==='ally'?'#e7d39c':'#c98a6b';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(pr.x,pr.y);ctx.lineTo(pr.x-pr.vx*.045,pr.y-pr.vy*.045);ctx.stroke();
    ctx.restore();
  }

  // effects
  for(const e of b.effects){
    const a=clamp(e.life/e.max,0,1);
    if(e.type==='ring'){
      ctx.save();ctx.globalAlpha=a*.85;ctx.strokeStyle=e.color;ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,Math.PI*2);ctx.stroke();ctx.restore();
    }else if(e.type==='slash'){
      ctx.save();ctx.globalAlpha=a;ctx.strokeStyle=e.color;ctx.lineWidth=2;
      const dir=e.dir;
      const sx=dir==='left'?-1:dir==='right'?1:0;
      const sy=dir==='up'?-1:dir==='down'?1:0;
      ctx.beginPath();ctx.arc(e.x+sx*5,e.y+sy*3,14,-1.1+(sx<0?Math.PI:0),1.1+(sx<0?Math.PI:0));ctx.stroke();ctx.restore();
    }else if(e.type==='spark'){
      ctx.save();ctx.globalAlpha=a;Art.DOT(ctx,e.x,e.y,e.color);Art.DOT(ctx,e.x+2,e.y-1,e.color);ctx.restore();
    }else if(e.type==='text'){
      ctx.save();ctx.globalAlpha=clamp(e.life/.4,0,1);
      Art.AText(ctx,e.text,320,e.y,28,'#f1d08b','center');
      if(e.sub)Art.AText(ctx,e.sub,320,e.y+24,10,'#c59c5e','center');
      ctx.restore();
    }
  }

  // particles
  for(const p2 of b.particles){
    const a=clamp(p2.life/p2.max,0,1);
    ctx.save();ctx.globalAlpha=a;Art.R(ctx,p2.x,p2.y,p2.size,p2.size,p2.color);ctx.restore();
  }

  // floaters
  for(const f of b.floaters){
    ctx.save();ctx.globalAlpha=clamp(f.life/.25,0,1);
    Art.AText(ctx,f.text,f.x,f.y,f.size,f.color,'center');
    ctx.restore();
  }

  // control hint
  if(b.time<7&&!b.ending){
    ctx.save();ctx.globalAlpha=clamp((7-b.time)/2,0,1)*.8;
    const hint=S.touch?'方向键移动 · A 释放绝技':'方向键移动 · 空格释放绝技';
    Art.AText(ctx,hint,320,348,9,'#d9c29a','center');
    ctx.restore();
  }
  ctx.restore();
}

function drawBoss(c,b,boss,t){
  if(b.config.kind==='water')drawSmallBoat(c,boss.x,boss.y+4,1.45,'enemy',t);
  const aura=.12+.06*Math.sin(t*4);
  c.save();c.globalAlpha=aura*2.2;Art.CIRC(c,boss.x,boss.y-18,40,'#b33d2d');c.restore();
  c.save();
  if(boss.hurt>0)c.globalAlpha=.7;
  c.translate(boss.x,boss.y);
  c.scale(1.32,1.32);
  Art.drawHuman(c,0,0,boss.style,boss.dir,boss.walk,t);
  c.restore();
  c.save();c.globalAlpha=.65;Art.R(c,boss.x-24,boss.y-1,48,2,'rgba(0,0,0,.45)');c.restore();
  Art.AText(c,boss.name,boss.x,boss.y+19,9,'#f0cc92','center');
  drawHpBar(c,boss.x-56,boss.y+27,112,boss.hp/boss.maxHp,'#c03d2c');
  if(boss.specialCd<1&&boss.specialCd>0){
    c.save();c.globalAlpha=.65;Art.AText(c,'蓄势',boss.x,boss.y-44,8,'#e1a05d','center');c.restore();
  }
}

function drawBannerHpBar(c,bn,kind){
  const water=kind==='water';
  const y=water?bn.y+13:bn.y-18;
  const w=water?54:50;
  drawHpBar(c,bn.x-w/2,y,w,bn.hp/bn.maxHp,'#c1412d');
}

function drawBannerMarker(c,bn,t){
  const y=bn.y-83+Math.sin(t*3+bn.x)*2;
  c.save();
  c.globalAlpha=.55+.25*Math.sin(t*4+bn.x);
  c.fillStyle='#e4bc6f';
  c.beginPath();c.moveTo(bn.x,y);c.lineTo(bn.x-5,y-7);c.lineTo(bn.x+5,y-7);c.closePath();c.fill();
  c.restore();
}
