function drawTitleScene(c,t){
  const W=640,H=360;
  const sky=c.createLinearGradient(0,0,0,H);
  sky.addColorStop(0,'#1b0e0c');
  sky.addColorStop(.26,'#3d1a14');
  sky.addColorStop(.5,'#7b2f1e');
  sky.addColorStop(.68,'#bc5728');
  sky.addColorStop(.79,'#d98b3c');
  sky.addColorStop(.84,'#6d3b26');
  sky.addColorStop(1,'#15100b');
  c.fillStyle=sky;c.fillRect(0,0,W,H);
  // banding
  for(let y=0;y<300;y+=5){
    if(hash2(0,y)>.72){c.fillStyle='rgba(255,170,90,.018)';c.fillRect(0,y,W,1);}
  }
  // sun
  const sx=435,sy=224;
  GLOW(c,sx,sy,130,'#f2a446',.2);
  CIRC(c,sx,sy,55,'#c54b2c');
  CIRC(c,sx,sy,48,'#d96134');
  CIRC(c,sx,sy,39,'#e88744');
  // cloud bands over sun
  c.save();c.globalAlpha=.22;R(c,300,sy-18,300,4,'#3a1b14');R(c,330,sy+3,230,3,'#4b2117');R(c,360,sy+22,170,3,'#542719');c.restore();
  // birds
  for(let i=0;i<5;i++){
    const bx=500+i*15+Math.sin(t*.4+i)*8,by=120+i*8;
    R(c,bx,by,3,1,'rgba(25,12,10,.75)');R(c,bx+5,by,3,1,'rgba(25,12,10,.75)');
  }
  // far mountains
  c.fillStyle='#4a241c';
  c.beginPath();c.moveTo(0,250);
  c.lineTo(70,218);c.lineTo(120,240);c.lineTo(190,206);c.lineTo(255,242);c.lineTo(330,214);c.lineTo(410,246);c.lineTo(500,210);c.lineTo(590,242);c.lineTo(640,226);
  c.lineTo(640,300);c.lineTo(0,300);c.closePath();c.fill();
  c.fillStyle='#311813';
  c.beginPath();c.moveTo(0,275);
  c.lineTo(90,248);c.lineTo(160,270);c.lineTo(240,242);c.lineTo(320,274);c.lineTo(420,250);c.lineTo(520,278);c.lineTo(640,252);
  c.lineTo(640,315);c.lineTo(0,315);c.closePath();c.fill();
  // mist
  c.save();c.globalAlpha=.08;R(c,0,258,640,22,'#f0b276');c.restore();
  // foreground hill
  c.fillStyle='#100b08';
  c.beginPath();c.moveTo(0,302);
  c.bezierCurveTo(100,286,160,306,230,298);c.bezierCurveTo(330,286,410,316,500,300);c.bezierCurveTo(570,290,610,302,640,296);
  c.lineTo(640,360);c.lineTo(0,360);c.closePath();c.fill();
  // village silhouette left
  c.fillStyle='#0a0706';
  c.beginPath();c.moveTo(30,316);c.lineTo(52,292);c.lineTo(75,316);c.closePath();c.fill();
  R(c,42,314,22,13,'#0a0706');
  R(c,48,322,7,9,'#080605');
  R(c,67,302,2,16,'#0a0706');
  // boy + ox silhouette left
  drawOxSilhouette(c,102,322,t);
  drawBoySilhouette(c,152,322,t);
  // emperor silhouette right
  drawEmperorSilhouette(c,552,328,t);
  // red banner right
  R(c,585,212,3,110,'#0b0706');
  const sw=Math.sin(t*1.3)*5;
  c.fillStyle='#3d120f';
  c.beginPath();c.moveTo(587,216);c.lineTo(628+sw,224);c.lineTo(622+sw,252);c.lineTo(587,246);c.closePath();c.fill();
  c.fillStyle='#5a1a14';
  AText(c,'朱',605+sw*.5,235,17,'#7e3021','center');
  // embers
  for(let i=0;i<40;i++){
    const life=((t*10+i*33)%300)/300;
    const ex=(i*97+Math.sin(t*.4+i)*30)%640;
    const ey=350-life*330;
    c.save();c.globalAlpha=Math.max(0,(1-life)*.7);R(c,ex,ey,life>.5?1:2,life>.5?1:2,i%3?'#d97b39':'#f3bd68');c.restore();
  }
  // grain
  for(let i=0;i<80;i++){
    const gx=hash2(i,3)*640,gy=hash2(i,9)*360;
    c.save();c.globalAlpha=.05;DOT(c,gx,gy,'#fff2d0');c.restore();
  }
}
function drawOxSilhouette(c,x,y,t){
  c.fillStyle='#090605';
  R(c,x-24,y-15,36,12,'#090605');
  R(c,x-20,y-19,26,6,'#090605');
  R(c,x+9,y-24,11,11,'#090605');
  R(c,x+18,y-21,4,7,'#090605');
  R(c,x+10,y-27,3,5,'#090605');R(c,x+18,y-27,3,5,'#090605');
  R(c,x-21,y-9,4,10,'#090605');R(c,x-13,y-9,4,10,'#090605');R(c,x-4,y-9,4,10,'#090605');R(c,x+5,y-9,4,10,'#090605');
  const sw=Math.sin(t*1.5)*2;
  R(c,x-27,y-16+sw,4,2,'#090605');
  c.fillStyle='#1a0e08';
  R(c,x-4,y-30,2,13,'#1a0e08');
}
function drawBoySilhouette(c,x,y,t){
  c.fillStyle='#070504';
  R(c,x-4,y-20,9,9,'#070504');
  R(c,x-3,y-28,7,8,'#070504');
  R(c,x-5,y-11,11,11,'#070504');
  R(c,x-6,y-7,4,8,'#070504');R(c,x+3,y-7,4,8,'#070504');
  R(c,x-4,y-2,3,2,'#070504');R(c,x+1,y-2,3,2,'#070504');
  R(c,x+5,y-24,2,25,'#1a0e08');
  const sw=Math.sin(t*1.2+1)*1.5;
  R(c,x-1,y-31+sw,2,4,'#070504');
}
function drawEmperorSilhouette(c,x,y,t){
  const sway=Math.sin(t*1.1)*2;
  c.fillStyle='#080504';
  c.beginPath();
  c.moveTo(x-20,y-2);c.lineTo(x-26+sway,y-55);c.lineTo(x-16,y-92);c.lineTo(x+16,y-92);c.lineTo(x+28+sway,y-52);c.lineTo(x+20,y-2);c.closePath();c.fill();
  // cape
  c.fillStyle='#0c0706';
  c.beginPath();c.moveTo(x-18,y-88);c.lineTo(x-42+sway,y-48);c.lineTo(x-30+sway,y-8);c.lineTo(x-8,y-30);c.closePath();c.fill();
  // head
  R(c,x-8,y-108,16,18,'#080504');
  // crown
  R(c,x-19,y-118,38,5,'#0b0705');
  R(c,x-15,y-114,30,3,'#0b0705');
  R(c,x-8,y-122,16,4,'#0b0705');
  R(c,x-1,y-128,2,6,'#160b07');
  // sword
  R(c,x+24,y-80,3,72,'#17100b');
  R(c,x+21,y-82,9,3,'#2b1a0f');
  R(c,x+22,y-84,7,2,'#382312');
  // beard
  R(c,x-5,y-96,10,8,'#080504');R(c,x-2,y-89,4,7,'#080504');
  // belt
  R(c,x-20,y-48,40,3,'#100a06');
  // rim light
  c.save();c.globalAlpha=.35;
  R(c,x-17,y-91,3,38,'#b75a2d');R(c,x+15,y-91,2,36,'#b75a2d');
  R(c,x-7,y-107,2,14,'#a64e28');
  c.restore();
}

/* =========================================================
   头像
   ========================================================= */
const PORTRAIT_DEFS = {
  boy:{bg:'#3b2a1a',halo:'#6b4427',skin:'#d1a071',skin2:'#ad7852',hair:'#1a1310',robe:'#785637',robe2:'#4e3721',trim:'#a98752',hat:'bun',beard:'none',eye:'#24150f'},
  friend:{bg:'#362b1d',halo:'#684b2e',skin:'#cc9869',skin2:'#a7724c',hair:'#1a1310',robe:'#806242',robe2:'#5a422b',trim:'#a47f4d',hat:'redband',beard:'none',eye:'#24170f'},
  monk:{bg:'#29322c',halo:'#53604d',skin:'#cf9d6e',skin2:'#a97652',hair:'#2a2520',robe:'#666b61',robe2:'#464a43',trim:'#929487',hat:'bald',beard:'none',eye:'#221812'},
  oldMonk:{bg:'#2e322d',halo:'#5a5c4e',skin:'#c39367',skin2:'#9f6e4c',hair:'#d0c9b9',robe:'#77766a',robe2:'#54534a',trim:'#a19e8f',hat:'bald',beard:'long',eye:'#231d17'},
  farmer:{bg:'#382e1f',halo:'#655033',skin:'#c08e62',skin2:'#94653f',hair:'#d0c7b2',robe:'#786347',robe2:'#56452f',trim:'#9f855b',hat:'straw',beard:'long',eye:'#2b1e13'},
  woman:{bg:'#3b1c1b',halo:'#6d3430',skin:'#e0ae80',skin2:'#bb845d',hair:'#191210',robe:'#a44037',robe2:'#742822',trim:'#d0a255',hat:'womanBun',beard:'none',eye:'#261510',female:true},
  general:{bg:'#35140f',halo:'#762c21',skin:'#cd986b',skin2:'#a46f4d',hair:'#17110d',robe:'#88291e',robe2:'#54160f',trim:'#d2a44c',hat:'turban',beard:'short',armor:true,eye:'#1d100b'},
  redSoldier:{bg:'#321d15',halo:'#6b3123',skin:'#cc976a',skin2:'#a36f4b',hair:'#17110d',robe:'#7f3528',robe2:'#53211a',trim:'#b98d4e',hat:'redband',beard:'none',armor:true,eye:'#1e120b'},
  emperor:{bg:'#3a2410',halo:'#86632c',skin:'#ca986a',skin2:'#a16f4a',hair:'#17110d',robe:'#c69a38',robe2:'#876226',trim:'#f0d58a',hat:'crown',beard:'long',armor:false,eye:'#1e120a'},
  guo:{bg:'#331712',halo:'#6a2b21',skin:'#bc855a',skin2:'#94603f',hair:'#1a120f',robe:'#773024',robe2:'#4b1d16',trim:'#c89c4b',hat:'turbanFeather',beard:'short',armor:true,eye:'#20120b'},
  xu:{bg:'#1e272b',halo:'#40545b',skin:'#bf885c',skin2:'#976341',hair:'#17110d',robe:'#4c5a60',robe2:'#303a3f',trim:'#b49e66',hat:'helmet',beard:'short',armor:true,eye:'#1a1712'},
  tang:{bg:'#341b14',halo:'#692f22',skin:'#c28d60',skin2:'#9a6743',hair:'#17110d',robe:'#7b3326',robe2:'#512017',trim:'#c8a45a',hat:'turban',beard:'short',armor:true,eye:'#20130c'},
  liu:{bg:'#202a32',halo:'#405361',skin:'#c8996d',skin2:'#a06d49',hair:'#1b1510',robe:'#485561',robe2:'#303942',trim:'#9c8758',hat:'gauze',beard:'goatee',eye:'#191712'},
  li:{bg:'#2b2333',halo:'#554060',skin:'#c4966a',skin2:'#9d6d47',hair:'#26201a',robe:'#5c4966',robe2:'#3e2e47',trim:'#b39a62',hat:'official',beard:'goatee',eye:'#211711'},
  chen:{bg:'#24172d',halo:'#4c315a',skin:'#b9835a',skin2:'#915f3e',hair:'#15100d',robe:'#3b2a49',robe2:'#251a30',trim:'#b68b45',hat:'darkHelmet',beard:'long',armor:true,eye:'#1a0f12'},
  messenger:{bg:'#2c2720',halo:'#554936',skin:'#c59368',skin2:'#9c6a45',hair:'#1a1310',robe:'#635039',robe2:'#463626',trim:'#8e754e',hat:'hood',beard:'none',eye:'#251a11'},
  narrator:{bg:'#20160f',halo:'#5d3a21',narrator:true}
};

function drawPortrait(canvas,styleId){
  const c=canvas.getContext('2d');
  c.clearRect(0,0,64,64);
  c.imageSmoothingEnabled=false;
  const d=PORTRAIT_DEFS[styleId]||PORTRAIT_DEFS.boy;
  // background
  R(c,0,0,64,64,d.bg);
  for(let y=0;y<64;y+=4)R(c,0,y,64,1,'rgba(0,0,0,.09)');
  for(let x=0;x<64;x+=6)R(c,x,0,1,64,'rgba(255,220,160,.018)');
  if(d.narrator){drawNarratorPortrait(c);return;}
  // halo
  c.save();c.globalAlpha=.28;CIRC(c,32,29,22,d.halo);c.restore();
  c.save();c.globalAlpha=.12;CIRC(c,32,29,18,'#f0cf87');c.restore();
  // patterned corners
  for(let i=0;i<5;i++){
    R(c,2,2+i*3,6,1,'rgba(212,166,78,.20)');R(c,56,59-i*3,6,1,'rgba(212,166,78,.20)');
  }
  // shoulders
  R(c,7,47,50,17,d.robe2);
  R(c,10,48,44,16,d.robe);
  R(c,15,50,34,14,d.robe2);
  R(c,4,52,10,12,d.robe2);R(c,50,52,10,12,d.robe2);
  // collar
  R(c,25,45,14,12,d.trim);
  R(c,28,47,8,10,d.skin2);
  R(c,27,48,10,4,d.trim);
  if(d.armor){
    R(c,9,50,11,12,d.trim);
    R(c,44,50,11,12,d.trim);
    R(c,22,54,20,3,d.trim);
    R(c,28,57,8,3,d.robe2);
    R(c,30,50,4,4,d.trim);
    R(c,12,53,5,2,'#302b25');R(c,47,53,5,2,'#302b25');
  }else{
    R(c,18,55,4,3,d.trim);R(c,42,55,4,3,d.trim);
  }
  // neck
  R(c,26,38,12,9,d.skin2);
  R(c,28,38,8,7,d.skin);
  // ears
  R(c,17,24,4,10,d.skin2);R(c,43,24,4,10,d.skin2);
  R(c,18,25,2,6,d.skin);R(c,44,25,2,6,d.skin);
  // face base
  R(c,19,12,26,29,d.skin2);
  R(c,21,13,22,27,d.skin);
  R(c,23,14,17,5,'#e0b184');
  R(c,21,33,22,5,d.skin2);
  // hair base
  if(d.hat!=='bald'){
    R(c,18,10,28,9,d.hair);
    R(c,17,14,4,10,d.hair);
    R(c,43,14,4,10,d.hair);
    R(c,23,10,18,3,d.hair);
  }else{
    R(c,19,11,26,5,d.skin);
    R(c,21,10,22,3,d.skin);
  }
  // face shading
  R(c,21,28,3,7,'rgba(120,70,45,.18)');
  R(c,41,28,3,7,'rgba(120,70,45,.12)');
  // brows
  if(d.female){
    R(c,24,23,7,1,'#3a2118');R(c,34,23,7,1,'#3a2118');
  }else{
    R(c,23,22,7,2,d.hair);R(c,35,22,7,2,d.hair);
    R(c,22,21,3,1,d.hair);R(c,40,21,3,1,d.hair);
  }
  // eyes
  if(d.hat==='crown'){
    R(c,24,25,5,2,'#1d1009');R(c,35,25,5,2,'#1d1009');
    R(c,25,25,2,1,'#e6c285');R(c,36,25,2,1,'#e6c285');
  }else{
    R(c,24,25,4,2,d.eye);R(c,36,25,4,2,d.eye);
    R(c,25,25,1,1,'#f0d9ad');R(c,37,25,1,1,'#f0d9ad');
  }
  // nose
  R(c,31,26,2,5,d.skin2);
  R(c,30,30,4,2,d.skin2);
  // mouth
  R(c,28,35,8,1,'#7d4438');
  if(d.female){R(c,30,36,4,1,'#b96562');}
  // beard
  if(d.beard==='short'){
    R(c,22,33,4,6,d.hair);R(c,38,33,4,6,d.hair);
    R(c,25,36,14,4,d.hair);R(c,28,39,8,2,d.hair);
    R(c,29,35,6,1,d.skin2);
  }else if(d.beard==='long'){
    R(c,21,33,4,10,d.hair);R(c,39,33,4,10,d.hair);
    R(c,23,37,18,8,d.hair);
    R(c,26,42,12,7,d.hair);
    R(c,29,47,6,5,d.hair);
    R(c,28,35,8,2,d.skin2);
    R(c,30,37,4,1,'#5b3023');
  }else if(d.beard==='goatee'){
    R(c,23,34,3,5,d.hair);R(c,38,34,3,5,d.hair);
    R(c,28,37,8,2,d.hair);
    R(c,30,39,4,7,d.hair);
    R(c,31,40,2,4,d.hair);
  }
  // headgear
  if(d.hat==='bun'){
    R(c,18,9,28,5,d.hair);
    R(c,25,3,14,8,d.hair);
    R(c,28,2,8,3,'#2c2119');
    R(c,30,0,4,4,d.hair);
  }else if(d.hat==='bald'){
    R(c,19,9,26,4,d.skin);
    R(c,21,7,22,4,d.skin);
    R(c,23,6,18,3,d.skin);
    R(c,21,10,3,2,d.skin2);
    DOT(c,25,11,'#9b6b4d');DOT(c,31,10,'#9b6c4d');DOT(c,37,11,'#9b6b4d');
    if(d.beard==='long'){R(c,18,16,3,12,d.hair);R(c,43,16,3,12,d.hair);R(c,20,20,2,9,d.hair);R(c,42,20,2,9,d.hair);}
  }else if(d.hat==='straw'){
    R(c,8,7,48,5,'#bda36b');
    R(c,12,4,40,5,'#d0b67a');
    R(c,20,1,24,6,'#c0a66d');
    R(c,8,12,48,2,'#7c6742');
    R(c,20,4,24,2,'#e0c98c');
  }else if(d.hat==='womanBun'){
    R(c,18,8,28,6,d.hair);
    R(c,24,1,16,9,d.hair);
    R(c,28,-1,10,4,d.hair);
    R(c,34,1,3,3,'#d8b15b');
    R(c,15,17,3,7,d.hair);R(c,46,17,3,7,d.hair);
    R(c,16,17,2,3,'#c9a45e');
  }else if(d.hat==='turban'||d.hat==='turbanFeather'){
    R(c,17,8,30,7,'#94281f');
    R(c,19,5,26,5,'#b2382a');
    R(c,17,13,30,3,'#671711');
    R(c,17,8,4,8,'#721a13');
    R(c,43,9,4,6,'#c04731');
    R(c,24,4,16,2,'#cf6749');
    R(c,31,12,10,2,'#d8b15e');
    R(c,35,9,5,4,'#d8b15e');
    if(d.hat==='turbanFeather'){
      R(c,44,0,2,10,'#d0a751');
      R(c,43,-4,4,5,'#a52e22');
      R(c,44,-7,2,4,'#c04a31');
    }
  }else if(d.hat==='helmet'){
    R(c,16,8,32,5,'#3e433f');
    R(c,18,4,28,6,'#4f5651');
    R(c,15,12,34,3,'#b19656');
    R(c,19,1,4,8,'#858a7d');R(c,41,1,4,8,'#858a7d');
    R(c,30,0,4,9,'#9e2b22');
    R(c,30,9,4,5,'#c04a35');
    R(c,23,11,18,2,'#796a44');
  }else if(d.hat==='crown'){
    // mianguan
    R(c,8,2,48,5,'#181410');
    R(c,10,7,44,3,'#2b241a');
    R(c,12,0,40,3,'#c9a558');
    R(c,22,8,20,3,'#15110d');
    for(let i=0;i<7;i++){
      R(c,11+i*7,1,1,12,'#d4b466');
      R(c,11+i*7,13,2,2,'#d4b466');
    }
    R(c,30,11,4,3,'#9e2b22');
    R(c,17,12,4,4,'#d4a64e');R(c,43,12,4,4,'#d4a64e');
    R(c,18,8,28,3,'#201a12');
  }else if(d.hat==='gauze'){
    R(c,18,8,28,6,d.hair);
    R(c,18,3,28,7,'#1b2024');
    R(c,20,1,24,4,'#2a3035');
    R(c,4,8,16,2,'#20262a');R(c,44,8,16,2,'#20262a');
    R(c,30,5,4,3,'#a88b53');
    R(c,22,12,20,2,'#151a1d');
  }else if(d.hat==='official'){
    R(c,18,8,28,6,d.hair);
    R(c,19,3,26,8,'#22272b');
    R(c,9,8,18,2,'#2f363b');R(c,37,8,18,2,'#2f363b');
    R(c,30,6,4,4,'#ad8e4f');
    R(c,22,12,20,2,'#1a1d20');
  }else if(d.hat==='darkHelmet'){
    R(c,16,8,32,6,'#251a30');
    R(c,18,3,28,7,'#352442');
    R(c,15,13,34,2,'#9c7338');
    R(c,29,0,6,9,'#4e2c5e');
    R(c,31,9,3,5,'#d4a64e');
    R(c,27,12,10,1,'#cba85c');
    R(c,18,15,6,4,'#5a3b67');R(c,40,15,6,4,'#5a3b67');
  }else if(d.hat==='hood'){
    R(c,16,7,32,8,'#5a4833');
    R(c,18,3,28,5,'#6b573d');
    R(c,14,14,4,10,'#604c36');R(c,46,14,4,10,'#604c36');
    R(c,20,13,24,2,'#453625');
  }else if(d.hat==='redband'){
    R(c,17,8,30,6,d.hair);
    R(c,16,9,32,3,'#b53a2b');
    R(c,16,9,5,6,'#8d251c');
    R(c,44,10,5,4,'#d1563d');
    R(c,23,12,18,2,'#7c1f18');
    R(c,31,7,2,3,'#e0b56a');
  }
  // rim light
  c.save();c.globalAlpha=.25;
  R(c,20,15,2,17,'#f4c986');R(c,43,18,1,14,'#f4c986');
  c.restore();
  // grain
  for(let i=0;i<18;i++){
    const gx=hash2(i,31)*64,gy=hash2(i,37)*64;
    c.save();c.globalAlpha=.06;DOT(c,gx,gy,'#fff1cf');c.restore();
  }
  // frame shadow
  R(c,0,0,64,1,'rgba(0,0,0,.45)');R(c,0,63,64,1,'rgba(0,0,0,.45)');
}
function drawNarratorPortrait(c){
  R(c,8,8,48,48,'#24170f');
  R(c,10,10,44,44,'#302014');
  // red sun
  c.save();c.globalAlpha=.7;CIRC(c,32,26,13,'#7e2a1e');c.restore();
  c.save();c.globalAlpha=.55;CIRC(c,32,26,9,'#a73a25');c.restore();
  // mountains
  c.fillStyle='#15100b';
  c.beginPath();c.moveTo(10,44);c.lineTo(20,32);c.lineTo(28,42);c.lineTo(38,29);c.lineTo(48,41);c.lineTo(56,35);c.lineTo(56,56);c.lineTo(10,56);c.closePath();c.fill();
  // scroll
  R(c,15,39,34,14,'#bca878');
  R(c,17,41,30,10,'#d6c291');
  R(c,15,37,34,3,'#8e784e');
  R(c,15,52,34,3,'#8e784e');
  for(let i=0;i<3;i++)R(c,21,43+i*3,20,1,'rgba(83,62,36,.55)');
  // ink brush
  R(c,47,13,2,22,'#3b2a1a');
  R(c,46,11,4,4,'#a9966f');
  R(c,47,35,2,5,'#1b1510');
  c.save();c.globalAlpha=.2;R(c,8,8,48,1,'#e4c37a');R(c,8,55,48,1,'#e4c37a');c.restore();
}

const Art = {
  R,O,DOT,CIRC,CIRC_EDGE,DITHER,SHADOW,GLOW,AText,
  drawHuman,drawMiniSoldier,drawTree,drawHut,drawFence,drawWell,drawOx,drawHerb,drawGrave,drawField,
  drawBasket,drawRock,drawBanner,drawTorch,drawTent,drawCampfire,drawWeaponRack,drawCrate,drawSack,
  groundVillage,groundTemple,drawTempleHall,drawBell,drawIncense,drawStoneLantern,drawCypress,
  groundCamp,groundWarRoom,drawWarTable,drawScreen,drawArmorStand,groundThrone,drawThrone,drawPillar,
  battleGround,drawWarship,drawWarBannerLarge,drawTitleScene,drawPortrait
};
