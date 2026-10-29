/* =========================================================
   朱元璋的一生 · 像素美术库
   所有画面均由 Canvas 与色块现场绘制，无外部素材。
   ========================================================= */
'use strict';

const PAL = {
  ink:'#0a0806', ink2:'#17120d', ink3:'#251b12',
  gold:'#d4a64e', gold2:'#f0d28a', gold3:'#8a6732',
  red:'#9f2c22', red2:'#d04b34', red3:'#651811',
  paper:'#f0e2c1', paper2:'#cbb68d',
  skin:'#d4a173', skin2:'#b77e56', skin3:'#8f5e41',
  grass:'#5e623c', grass2:'#737849', grass3:'#474b2e',
  earth:'#6d5f3d', earth2:'#8b7950', earth3:'#51462e',
  stone:'#5a5b52', stone2:'#73746a', stone3:'#3f403a',
  water:'#173d46', water2:'#225a60', water3:'#0e2a33',
  night:'#171e24', night2:'#243039'
};

function R(c,x,y,w,h,col){
  c.fillStyle=col;
  c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));
}
function O(c,x,y,w,h,col){
  c.strokeStyle=col;c.lineWidth=1;
  c.strokeRect(Math.round(x)+.5,Math.round(y)+.5,Math.round(w)-1,Math.round(h)-1);
}
function DOT(c,x,y,col){R(c,x,y,1,1,col);}
function CIRC(c,cx,cy,r,col){
  cx=Math.round(cx);cy=Math.round(cy);
  for(let y=-r;y<=r;y++){
    const w=Math.floor(Math.sqrt(Math.max(0,r*r-y*y)));
    c.fillStyle=col;
    c.fillRect(cx-w,cy+y,w*2+1,1);
  }
}
function CIRC_EDGE(c,cx,cy,r,col){
  cx=Math.round(cx);cy=Math.round(cy);
  for(let y=-r;y<=r;y++){
    const w=Math.floor(Math.sqrt(Math.max(0,r*r-y*y)));
    c.fillStyle=col;
    c.fillRect(cx-w,cy+y,2,1);c.fillRect(cx+w-1,cy+y,2,1);
  }
}
function DITHER(c,x,y,w,h,col,step=4,offset=0){
  c.fillStyle=col;
  for(let yy=0;yy<h;yy+=step){
    for(let xx=((yy/step|0)+offset)%2?0:step/2;xx<w;xx+=step){
      c.fillRect(Math.round(x+xx),Math.round(y+yy),1,1);
    }
  }
}
function hash2(x,y){
  let n=(x*374761393+y*668265263)|0;
  n=(n^(n>>13))*1274126177|0;
  return ((n^(n>>16))>>>0)/4294967295;
}
function SHADOW(c,x,y,rx,ry,alpha=.28){
  c.save();c.globalAlpha=alpha;c.fillStyle='#000';
  for(let i=-ry;i<=ry;i++){
    const w=Math.floor(rx*Math.sqrt(Math.max(0,1-(i*i)/(ry*ry))));
    c.fillRect(Math.round(x-w),Math.round(y+i),Math.max(1,w*2),1);
  }
  c.restore();
}
function GLOW(c,x,y,r,col,alpha=.22){
  const g=c.createRadialGradient(x,y,1,x,y,r);
  g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');
  c.save();c.globalAlpha=alpha;c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);c.restore();
}
function AText(c,txt,x,y,size,col,align='left',weight='bold'){
  c.save();
  c.font=`${weight} ${size}px "Microsoft YaHei UI","Microsoft YaHei","SimSun",sans-serif`;
  c.textAlign=align;c.textBaseline='middle';
  c.fillStyle='rgba(0,0,0,.7)';c.fillText(txt,x+1,y+2);
  c.fillStyle=col;c.fillText(txt,x,y);
  c.restore();
}
function ATextPixel(c,txt,x,y,size,col,align='left'){
  AText(c,txt,x,y,size,col,align,'bold');
}

/* =========================================================
   人物
   ========================================================= */
const HUMANS = {
  boy:{skin:PAL.skin,hair:'#181210',robe:'#715136',robe2:'#523922',trim:'#3a2817',leg:'#4d3724',hat:'bun',ragged:true},
  friend:{skin:'#cb9668',hair:'#1a1310',robe:'#806242',robe2:'#5d452d',trim:'#a17c4c',leg:'#4a3523',hat:'redband',ragged:true},
  monk:{skin:PAL.skin,hair:'#2b2520',robe:'#6d6b60',robe2:'#515047',trim:'#898676',leg:'#4a493f',hat:'bald',beads:true},
  oldMonk:{skin:'#c49366',hair:'#d0c9b9',robe:'#777468',robe2:'#5a574e',trim:'#a19c8b',leg:'#4e4c45',hat:'bald',beard:'long',beads:true},
  farmer:{skin:'#bd8d62',hair:'#cfc7b4',robe:'#7a6547',robe2:'#5d4a32',trim:'#40301f',leg:'#4f3d28',hat:'straw',beard:'long'},
  woman:{skin:'#e0ad7e',hair:'#1a1412',robe:'#a5453c',robe2:'#7b2c26',trim:'#d0a255',leg:'#63231f',hat:'womanBun',female:true},
  general:{skin:PAL.skin,hair:'#17110e',robe:'#8b2b20',robe2:'#5a1812',trim:'#d0a04a',leg:'#39241d',hat:'turban',armor:true,cape:'#7d1e18',beard:'short',weapon:'sword'},
  emperor:{skin:'#c99769',hair:'#17110e',robe:'#c49a3a',robe2:'#8a6422',trim:'#f0d68b',leg:'#5d441c',hat:'crown',armor:false,cape:'#9d2a20',beard:'long'},
  guo:{skin:'#bd855a',hair:'#1b1310',robe:'#783025',robe2:'#4c1d17',trim:'#c69a49',leg:'#3d2920',hat:'turbanFeather',armor:true,cape:'#6f1d16',beard:'short',weapon:'sword'},
  xu:{skin:'#c08a5d',hair:'#17110e',robe:'#4e5d63',robe2:'#333f45',trim:'#b9a168',leg:'#2b3337',hat:'helmet',armor:true,beard:'short',weapon:'spear'},
  tang:{skin:'#c49063',hair:'#17110e',robe:'#7d3426',robe2:'#532018',trim:'#c9a35b',leg:'#3d2920',hat:'turban',armor:true,beard:'short',weapon:'spear'},
  liu:{skin:'#c99a6e',hair:'#1b1510',robe:'#4a5764',robe2:'#313b45',trim:'#9c8758',leg:'#2e363e',hat:'gauze',beard:'goatee'},
  li:{skin:'#c5976a',hair:'#26201a',robe:'#5e4b68',robe2:'#413049',trim:'#b49a61',leg:'#392c40',hat:'official',beard:'goatee'},
  chen:{skin:'#b9835a',hair:'#15100d',robe:'#3d2c4b',robe2:'#261b31',trim:'#b68b45',leg:'#2a1f34',hat:'darkHelmet',armor:true,cape:'#3e1f48',beard:'long',weapon:'sword'},
  messenger:{skin:'#c69468',hair:'#1a1310',robe:'#64513a',robe2:'#473726',trim:'#8c744e',leg:'#3d2d1f',hat:'hood',weapon:'none'},
  redSoldier:{skin:'#c08a5d',hair:'#17110e',robe:'#7e3729',robe2:'#562119',trim:'#b78b48',leg:'#3b2a20',hat:'redband',armor:true,weapon:'spear'},
  yuanSoldier:{skin:'#b98258',hair:'#15100d',robe:'#3e4a55',robe2:'#29323a',trim:'#7a858c',leg:'#242b31',hat:'ironHelmet',armor:true,weapon:'spear'},
  official:{skin:'#c49a6f',hair:'#1b1510',robe:'#4d5e58',robe2:'#34413c',trim:'#a58f5d',leg:'#303a35',hat:'official',beard:'goatee'}
};

function humanHat(c,x,y,st,t){
  const hat=st.hat, hair=st.hair;
  if(hat==='bun'){
    R(c,x-4,y-24,9,4,hair);
    R(c,x-2,y-27,5,4,hair);
    R(c,x-1,y-27,2,1,'#3a2b20');
    R(c,x-5,y-22,2,4,hair);
  }else if(hat==='bald'){
    R(c,x-4,y-24,9,4,st.skin);
    R(c,x-3,y-25,7,2,st.skin);
    DOT(c,x-1,y-23,'#8f6246');DOT(c,x+1,y-22,'#8f6246');DOT(c,x+3,y-23,'#8f6246');
  }else if(hat==='straw'){
    R(c,x-8,y-23,17,3,'#ad9359');
    R(c,x-6,y-25,13,3,'#c3a86a');
    R(c,x-4,y-27,9,2,'#d2b878');
    R(c,x-8,y-21,17,1,'#79653e');
  }else if(hat==='womanBun'){
    R(c,x-4,y-24,9,5,hair);
    R(c,x-3,y-29,7,6,hair);
    R(c,x+2,y-30,3,3,hair);
    R(c,x-2,y-31,2,2,'#d8b15b');
    R(c,x-6,y-22,2,2,hair);R(c,x+4,y-22,2,2,hair);
  }else if(hat==='turban'){
    R(c,x-5,y-24,11,5,'#9f2c22');
    R(c,x-4,y-26,9,3,'#b5382b');
    R(c,x-5,y-22,11,2,'#6f1a13');
    R(c,x-5,y-26,2,3,'#771a13');
    R(c,x+3,y-27,3,3,'#d9b15f');
  }else if(hat==='turbanFeather'){
    R(c,x-5,y-24,11,5,'#9f2c22');
    R(c,x-4,y-26,9,3,'#bd4030');
    R(c,x-5,y-22,11,2,'#6f1a13');
    R(c,x+3,y-31,1,6,'#d1a851');
    R(c,x+2,y-33,3,3,'#9e2b22');
  }else if(hat==='helmet'){
    R(c,x-5,y-24,11,4,'#4a4f4b');
    R(c,x-4,y-27,9,4,'#59605b');
    R(c,x-6,y-24,13,2,'#b99b57');
    R(c,x-4,y-28,1,5,'#8c9189');
    R(c,x+3,y-28,1,5,'#8c9189');
    R(c,x-1,y-32,2,4,'#a32d22');
  }else if(hat==='ironHelmet'){
    R(c,x-5,y-23,11,3,'#2a3137');
    R(c,x-4,y-26,9,4,'#3b444b');
    R(c,x-6,y-23,13,2,'#596066');
    R(c,x-1,y-29,2,3,'#7a2a22');
  }else if(hat==='gauze'){
    R(c,x-4,y-24,9,4,hair);
    R(c,x-4,y-27,9,4,'#1c2023');
    R(c,x-9,y-26,22,2,'#282d31');
    R(c,x-1,y-26,3,2,'#8b7343');
  }else if(hat==='official'){
    R(c,x-4,y-24,9,4,hair);
    R(c,x-4,y-28,9,5,'#24272b');
    R(c,x-8,y-26,17,2,'#33383e');
    R(c,x-1,y-29,3,2,'#ad8e4f');
  }else if(hat==='darkHelmet'){
    R(c,x-5,y-24,11,3,'#241a30');
    R(c,x-4,y-28,9,5,'#362545');
    R(c,x-6,y-24,13,2,'#9b7438');
    R(c,x-1,y-23,2,3,'#d4a64e');
    R(c,x-2,y-31,4,3,'#5a2d63');
  }else if(hat==='hood'){
    R(c,x-5,y-24,11,5,'#5a4833');
    R(c,x-6,y-22,3,5,'#6b573d');
    R(c,x+4,y-22,3,5,'#6b573d');
  }else if(hat==='redband'){
    R(c,x-4,y-23,9,4,hair);
    R(c,x-5,y-22,11,2,'#b53a2b');
    R(c,x+4,y-23,2,4,'#8e261c');
  }
  if(st.beard==='short'){R(c,x-3,y-16,7,2,st.hair);R(c,x-2,y-14,5,1,st.hair);}
  if(st.beard==='long'){R(c,x-4,y-16,9,4,st.hair);R(c,x-3,y-12,7,5,st.hair);R(c,x-1,y-8,3,2,st.hair);R(c,x-4,y-13,1,3,st.hair);R(c,x+4,y-13,1,3,st.hair);}
  if(st.beard==='goatee'){R(c,x-3,y-16,7,1,st.hair);R(c,x-1,y-14,3,4,st.hair);}
}

function drawHuman(c,x,y,styleId,dir='down',walk=0,t=0,alpha=1){
  const st=HUMANS[styleId]||HUMANS.boy;
  x=Math.round(x);y=Math.round(y);
  c.save();c.globalAlpha=alpha;
  SHADOW(c,x,y,8,3);
  if(dir==='left'){c.translate(x*2,0);c.scale(-1,1);}
  const bob=(walk===1?0:walk===2?1:0);
  const yy=y-bob;
  if(st.cape){
    const sw=Math.round(Math.sin(t*4.2+x*.05)*2);
    R(c,x-8+sw,yy-16,5,12,st.cape);
    R(c,x-9+sw,yy-7,7,4,st.cape);
    R(c,x-7+sw,yy-16,2,10,'rgba(0,0,0,.18)');
  }
  const legA=walk===1?2:0, legB=walk===2?2:0;
  R(c,x-5,yy-5,4,5,st.leg);
  R(c,x+1,yy-5-legB,4,5+legB,st.leg);
  R(c,x-6+legA,yy-2,5,2,'#241b13');
  R(c,x+1,yy-2,5,2,'#241b13');
  if(st.weapon==='spear'){
    R(c,x+7,yy-25,1,24,'#5b4328');
    R(c,x+6,yy-28,3,4,'#aeb3b2');
    R(c,x+5,yy-26,1,2,'#8b9091');
  }
  R(c,x-6,yy-16,12,12,st.robe2);
  R(c,x-5,yy-16,10,11,st.robe);
  R(c,x-5,yy-7,10,2,st.robe2);
  if(st.armor){
    R(c,x-6,yy-16,3,7,st.trim);
    R(c,x+3,yy-16,3,7,st.trim);
    R(c,x-5,yy-13,10,1,st.trim);
    R(c,x-4,yy-10,8,1,'rgba(0,0,0,.35)');
    R(c,x-3,yy-15,6,3,'#34302b');
    R(c,x-1,yy-15,2,3,st.trim);
  }else{
    R(c,x-5,yy-14,10,2,st.trim);
    R(c,x-1,yy-16,2,7,st.trim);
    if(st.ragged){R(c,x-6,yy-7,2,2,st.robe2);R(c,x+4,yy-6,2,3,st.robe2);}
  }
  R(c,x-7,yy-15,2,8,st.robe2);
  R(c,x+5,yy-15,2,8,st.robe2);
  R(c,x-7,yy-8,2,2,st.skin);
  R(c,x+5,yy-8,2,2,st.skin);
  R(c,x-4,yy-23,9,9,'#1b1410');
  R(c,x-3,yy-22,7,7,st.skin);
  R(c,x-4,yy-22,1,3,st.skin2);R(c,x+3,yy-22,1,3,st.skin2);
  if(st.female){
    R(c,x-4,yy-23,9,3,st.hair);
    R(c,x-5,yy-21,2,4,st.hair);
    R(c,x+3,yy-21,2,4,st.hair);
  }
  if(dir!=='up'){
    R(c,x-2,yy-20,1,1,'#2a1a12');
    R(c,x+2,yy-20,1,1,'#2a1a12');
    if(st.female){R(c,x-1,yy-18,3,1,'#9e574e');}
    else{R(c,x-1,yy-18,3,1,'#6e4531');}
  }else{
    R(c,x-4,yy-23,9,6,st.hair);
  }
  humanHatAfter(c,x,yy,st,t);
  if(st.weapon==='sword'){
    R(c,x-8,yy-21,2,14,'#3b2a18');
    R(c,x-8,yy-23,2,4,'#c2b287');
    R(c,x-9,yy-19,4,1,'#c9a05a');
  }
  c.restore();
}
function humanHatAfter(c,x,y,yy0,st,t){ /* headgear is drawn in front of hair */ humanHat(c,x,yy0,st,t); }

function drawMiniSoldier(c,x,y,team,type,walk,t,alpha=1){
  x=Math.round(x);y=Math.round(y);
  const red=team==='ally';
  const armor=red?'#8c3327':'#33414b';
  const armor2=red?'#5a1e18':'#202b33';
  const skin='#c38d60';
  c.save();c.globalAlpha=alpha;
  SHADOW(c,x,y,6,2);
  const bob=walk?Math.round(Math.sin(t*12+x)*1):0;
  const yy=y-bob;
  const step=walk?Math.round(Math.sin(t*12+x)*2):0;
  // legs & feet
  R(c,x-3,yy-6,2,6,armor2);R(c,x+1,yy-6,2,6,armor2);
  R(c,x-4,yy-3,2,3,'#221912');R(c,x+2,yy-3,2,3,'#221912');
  // body
  R(c,x-4,yy-15,8,9,armor2);
  R(c,x-3,yy-15,6,8,armor);
  R(c,x-3,yy-9,6,1,red?'#b6945b':'#65747c');
  R(c,x-3,yy-13,6,1,'rgba(0,0,0,.25)');
  R(c,x-5,yy-14,2,6,armor2);R(c,x+3,yy-14,2,6,armor2);
  R(c,x-5,yy-8,2,2,skin);R(c,x+3,yy-8,2,2,skin);
  // head
  R(c,x-3,yy-20,6,6,skin);
  R(c,x-4,yy-21,8,3,red?'#b33b2b':'#3e4a53');
  R(c,x-4,yy-18,8,1,red?'#8d271f':'#252f37');
  R(c,x-2,yy-17,1,1,'#2a1a12');R(c,x+2,yy-17,1,1,'#2a1a12');
  if(type==='archer'){
    R(c,x+5,yy-19,1,15,'#6d4c2b');
    R(c,x+5,yy-19,5,1,'#6d4c2b');
    R(c,x+9,yy-20,1,5,'#b9ab86');
    R(c,x+4,yy-10,5,4,'#6b4a2b');
  }else{
    R(c,x+5,yy-26,1,24,'#5b4328');
    R(c,x+4,yy-28,3,5,'#9aa0a0');
    R(c,x-6,yy-12,3,6,'#5f3e25');
    R(c,x-7,yy-13,5,7,red?'#7b2a20':'#3b474f');
  }
  if(red){
    R(c,x-4,yy-21,8,1,'#d24a35');
    R(c,x-5,yy-19,2,3,'#9e2b22');
  }
  if(team==='enemy'){
    R(c,x-1,yy-22,2,2,'#18120f');
    R(c,x-4,yy-22,8,1,'#55616a');
  }
  c.restore();
}

/* =========================================================
   45° 俯视场景道具
   ========================================================= */