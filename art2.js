function drawTree(c,x,y,s,t,kind='green'){
  s=s||1;
  x=Math.round(x);y=Math.round(y);
  SHADOW(c,x,y,11*s,4*s);
  R(c,x-3*s,y-20*s,6*s,20*s,'#4a3320');
  R(c,x-2*s,y-18*s,2*s,17*s,'#63482d');
  R(c,x-7*s,y-7*s,5*s,2*s,'#4a3320');
  R(c,x+2*s,y-10*s,5*s,2*s,'#4a3320');
  const sway=Math.round(Math.sin(t*1.5+x*.03)*2*s);
  const cols=kind==='ginkgo'?['#6d6533','#918a42','#b1a656']:['#2f3b26','#3c4d2f','#51643b'];
  CIRC(c,x+sway,y-35*s,13*s,cols[0]);
  CIRC(c,x-9*s+sway,y-30*s,10*s,cols[0]);
  CIRC(c,x+9*s+sway,y-31*s,10*s,cols[1]);
  CIRC(c,x-4*s+sway,y-42*s,9*s,cols[1]);
  CIRC(c,x+5*s+sway,y-40*s,8*s,cols[2]);
  DITHER(c,x-16*s+sway,y-44*s,32*s,25*s,cols[2],4);
  R(c,x-3*s+sway,y-42*s,6*s,2*s,'rgba(255,255,220,.12)');
  if(kind==='ginkgo'){
    for(let i=0;i<5;i++){const px=x+(hash2(i,3)*30-15)*s;const py=y-10*s+hash2(i,5)*18*s;R(c,px,py,2,1,'#c5b45b');}
  }
}
function drawHut(c,x,y,w,h,t,opt={}){
  x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);
  const wall=opt.wall||'#9b7d4d', wall2=opt.wall2||'#6f5635', roof=opt.roof||'#4a3826', roof2=opt.roof2||'#6a5232';
  SHADOW(c,x,y-2,w*.55,7);
  R(c,x-w/2,y-h*.62,w,h*.62,wall2);
  R(c,x-w/2+3,y-h*.62,w-6,h*.62-2,wall);
  R(c,x-w/2,y-h*.62,4,h*.62,roof2);
  R(c,x+w/2-4,y-h*.62,4,h*.62,roof2);
  R(c,x-w/2+7,y-h*.5,2,h*.5,wall2);
  R(c,x+w/2-9,y-h*.5,2,h*.5,wall2);
  // roof
  c.fillStyle=roof;
  c.beginPath();
  c.moveTo(x-w/2-14,y-h*.6);
  c.lineTo(x-w/2+5,y-h*.92);
  c.lineTo(x+w/2-5,y-h*.92);
  c.lineTo(x+w/2+14,y-h*.6);
  c.closePath();c.fill();
  R(c,x-w/2-14,y-h*.63,w+28,5,roof2);
  R(c,x-w/2+2,y-h*.94,w-4,4,'#2e2419');
  for(let i=0;i<8;i++){
    const rx=x-w/2-9+i*(w+18)/8;
    R(c,rx,y-h*.88,2,h*.24,i%2?'#59452d':'#3e2f20');
  }
  DITHER(c,x-w/2-12,y-h*.68,w+24,8,'#7a5c34',4);
  // door
  R(c,x-9,y-30,18,30,'#281b11');
  R(c,x-7,y-28,14,28,'#3d2919');
  R(c,x-7,y-28,14,2,'#6b4b2c');
  R(c,x+4,y-16,2,2,'#a68145');
  // window
  R(c,x-24,y-42,13,11,'#2b2117');
  R(c,x-22,y-40,9,7,opt.light||'#d2a45f');
  R(c,x-22,y-36,9,1,'#5b4228');R(c,x-18,y-40,1,7,'#5b4228');
  R(c,x+15,y-44,12,10,'#2b2117');
  R(c,x+17,y-42,8,6,opt.light2||'#7e5a37');
  // straw/thatch edge
  for(let i=0;i<12;i++){
    R(c,x-w/2-10+i*(w+20)/12,y-h*.6,1,4,'#2f2418');
  }
  if(opt.lantern){
    R(c,x+11,y-32,2,6,'#2d2115');
    R(c,x+8,y-29,8,9,'#a23122');
    R(c,x+10,y-27,4,5,'#f0bd68');
    GLOW(c,x+12,y-25,22,'#e8a451',.13);
  }
  if(opt.chimney){
    R(c,x+w/2-20,y-h*.95,7,15,'#57422c');
    const sy=(t*8)%18;
    c.save();c.globalAlpha=.18;
    CIRC(c,x+w/2-17,y-h*1.02-sy,3+sy*.2,'#cfd0c5');
    CIRC(c,x+w/2-13,y-h*1.04-sy*.8,2+sy*.15,'#cfd0c5');
    c.restore();
  }
}
function drawFence(c,x,y,w,vertical=false){
  if(vertical){
    for(let i=0;i<w;i+=9){R(c,x,y+i,3,9,'#5b432b');R(c,x+1,y+i,1,9,'#7c5e3b');}
    R(c,x-1,y,4,w,'#4b3521');R(c,x+3,y,1,w,'#6d5030');
  }else{
    for(let i=0;i<w;i+=9){R(c,x+i,y-8,3,10,'#5b432b');R(c,x+i,y-9,3,3,'#7c5e3b');}
    R(c,x-1,y-6,w+2,3,'#4b3521');R(c,x,y-2,w,2,'#6d5030');
  }
}
function drawWell(c,x,y,t){
  SHADOW(c,x,y,16,5);
  CIRC(c,x,y-9,15,'#3e3e35');
  CIRC(c,x,y-11,13,'#626047');
  CIRC(c,x,y-11,10,'#262923');
  R(c,x-14,y-22,2,15,'#5b3f26');R(c,x+12,y-22,2,15,'#5b3f26');
  R(c,x-15,y-24,30,3,'#73532f');
  R(c,x-15,y-25,30,1,'#906a3d');
  R(c,x-1,y-23,1,9,'#8f7a52');
  R(c,x-4,y-16,8,5,'#6b4a2b');
  R(c,x-3,y-15,6,3,'#3f2b18');
  c.save();c.globalAlpha=.35;CIRC(c,x,y-11,8,'#1d2b2a');c.restore();
}
function drawOx(c,x,y,t){
  SHADOW(c,x,y,17,4);
  R(c,x-15,y-13,28,10,'#5a4b3c');
  R(c,x-13,y-16,24,5,'#6e5d4a');
  R(c,x+9,y-17,8,8,'#5a4b3c');
  R(c,x+15,y-15,4,5,'#6e5d4a');
  R(c,x+16,y-16,1,1,'#1b1511');
  R(c,x+18,y-11,1,3,'#3f3329');
  R(c,x+10,y-20,2,4,'#29221b');R(c,x+16,y-20,2,4,'#29221b');
  R(c,x+12,y-22,5,2,'#b7a98c');
  R(c,x-14,y-9,3,9,'#4e4033');R(c,x-8,y-9,3,9,'#4e4033');R(c,x+5,y-9,3,9,'#4e4033');R(c,x+11,y-9,3,9,'#4e4033');
  const sw=Math.sin(t*2)*2;
  R(c,x-17,y-13+sw,3,1,'#3f3329');R(c,x-19,y-11+sw,2,3,'#3f3329');
  R(c,x-3,y-18,7,3,'#46392d');
}
function drawHerb(c,x,y,t,glow=true){
  const sway=Math.round(Math.sin(t*3+x)*1);
  if(glow)GLOW(c,x,y-8,23,'#b7d47a',.1);
  R(c,x-4,y-4,2,4,'#3f5a2e');R(c,x+1,y-5,2,5,'#3f5a2e');
  R(c,x-5+sway,y-8,3,5,'#71964b');
  R(c,x+2+sway,y-9,3,6,'#85a957');
  R(c,x-1+sway,y-12,3,7,'#9cbf60');
  R(c,x-4+sway,y-9,1,3,'#c2da7c');
  R(c,x+3+sway,y-10,1,3,'#c2da7c');
  if(glow){
    const a=.45+.35*Math.sin(t*4+x);
    c.save();c.globalAlpha=a;DOT(c,x-7,y-14,'#eff8c5');DOT(c,x+6,y-6,'#eff8c5');c.restore();
  }
}
function drawGrave(c,x,y,t){
  SHADOW(c,x,y,13,4);
  c.fillStyle='#6a6555';
  c.beginPath();c.moveTo(x-9,y);c.lineTo(x-8,y-12);c.quadraticCurveTo(x,y-20,x+8,y-12);c.lineTo(x+9,y);c.closePath();c.fill();
  c.fillStyle='#86816e';
  c.beginPath();c.moveTo(x-7,y-1);c.lineTo(x-6,y-11);c.quadraticCurveTo(x,y-17,x+6,y-11);c.lineTo(x+7,y-1);c.closePath();c.fill();
  R(c,x-4,y-11,8,1,'#4e4a3e');
  R(c,x-3,y-8,6,1,'#4e4a3e');
  R(c,x-1,y-14,2,9,'#4e4a3e');
  R(c,x-7,y-2,14,2,'#5a5547');
  if(t%7<1){c.save();c.globalAlpha=.16;DOT(c,x+3,y-20,'#d8d4c2');c.restore();}
}
function drawField(c,x,y,w,h,t){
  R(c,x,y,w,h,'#73683f');
  R(c,x,y,w,2,'#5a512f');
  for(let yy=0;yy<h;yy+=8){
    R(c,x,y+yy,w,1,'#5b512f');
    for(let xx=4;xx<w;xx+=7){
      const sw=Math.sin(t*1.6+xx*.4+yy)*1;
      R(c,x+xx,y+yy-4,1,5,'#9a8b50');
      R(c,x+xx+sw,y+yy-6,1,3,'#b3a15e');
    }
  }
  DITHER(c,x,y,w,h,'#8b7b49',8);
}
function drawBasket(c,x,y){
  SHADOW(c,x,y,7,2);
  R(c,x-6,y-8,12,8,'#7b5a33');R(c,x-6,y-8,12,2,'#a37b46');
  for(let i=0;i<4;i++)R(c,x-5+i*3,y-6,1,6,'#4f3a21');
  R(c,x-7,y-10,14,2,'#8e6939');
}
function drawRock(c,x,y,s=1){
  SHADOW(c,x,y,7*s,2*s);
  c.fillStyle='#66675b';
  c.beginPath();c.moveTo(x-8*s,y);c.lineTo(x-7*s,y-7*s);c.lineTo(x-2*s,y-10*s);c.lineTo(x+5*s,y-9*s);c.lineTo(x+9*s,y-3*s);c.lineTo(x+6*s,y);c.closePath();c.fill();
  R(c,x-5*s,y-8*s,4*s,2*s,'#85867a');R(c,x+2*s,y-6*s,3*s,2*s,'#4e5047');
}
function drawBanner(c,x,y,h,t,color='#9f2c22',emblem=''){
  SHADOW(c,x,y,7,2);
  R(c,x-1,y-h,3,h,'#4f3b23');
  R(c,x-3,y-h-3,7,3,'#b6914e');
  const sw=Math.sin(t*3+x*.1)*2;
  c.fillStyle=color;
  c.beginPath();c.moveTo(x+2,y-h+4);c.lineTo(x+25+sw,y-h+7);c.lineTo(x+22+sw,y-h+22);c.lineTo(x+24+sw,y-h+31);c.lineTo(x+2,y-h+27);c.closePath();c.fill();
  R(c,x+2,y-h+4,3,23,color);
  R(c,x+8+sw,y-h+9,13,2,'rgba(0,0,0,.18)');
  if(emblem)AText(c,emblem,x+14+sw,y-h+17,10,'#e8cd96','center');
  R(c,x-4,y-2,9,3,'#3d382b');
}
function drawTorch(c,x,y,t){
  R(c,x,y-26,2,26,'#4b3521');
  R(c,x-2,y-29,6,4,'#5e4226');
  const f=Math.sin(t*8+x)*1;
  GLOW(c,x+1,y-34,34,'#e58f3b',.18);
  R(c,x-2,y-37+f,6,7,'#b6401f');
  R(c,x-1,y-41-f,4,6,'#e79a38');
  R(c,x,y-43,2,4,'#ffe08a');
}
function drawTent(c,x,y,w,h,t,opt={}){
  x=Math.round(x);y=Math.round(y);w=Math.round(w);h=Math.round(h);
  SHADOW(c,x,y,w*.54,5);
  const col=opt.color||'#7b6b4b', dark=opt.dark||'#4d422d', light=opt.light||'#92805a';
  c.fillStyle=dark;
  c.beginPath();c.moveTo(x-w/2,y);c.lineTo(x-w/3,y-h);c.lineTo(x+w/3,y-h);c.lineTo(x+w/2,y);c.closePath();c.fill();
  c.fillStyle=col;
  c.beginPath();c.moveTo(x-w/2+4,y-2);c.lineTo(x-w/3+3,y-h+2);c.lineTo(x+w/3-3,y-h+2);c.lineTo(x+w/2-4,y-2);c.closePath();c.fill();
  R(c,x-2,y-h-2,4,4,light);
  R(c,x-1,y-h-9,2,8,'#4b3521');
  const sw=Math.sin(t*2.4+x)*1;
  c.fillStyle=opt.flag||'#9f2c22';
  c.beginPath();c.moveTo(x+1,y-h-9);c.lineTo(x+11+sw,y-h-7);c.lineTo(x+9+sw,y-h-1);c.lineTo(x+1,y-h-2);c.closePath();c.fill();
  R(c,x-w/7,y-h*.62,2,h*.62,'#3a3020');
  R(c,x+w/7,y-h*.62,2,h*.62,'#3a3020');
  R(c,x-9,y-24,18,24,'#2a2116');
  c.fillStyle='#1b1510';
  c.beginPath();c.moveTo(x-9,y);c.lineTo(x-7,y-21);c.quadraticCurveTo(x,y-28,x+7,y-21);c.lineTo(x+9,y);c.closePath();c.fill();
  for(let i=0;i<6;i++)R(c,x-w/2+9+i*(w-18)/6,y-h*.8,1,h*.3,'rgba(0,0,0,.14)');
}
function drawCampfire(c,x,y,t){
  GLOW(c,x,y-12,58,'#e58a39',.2);
  R(c,x-9,y-4,18,4,'#3c3024');
  for(let i=0;i<4;i++){R(c,x-9+i*5,y-5,4,3,'#5c4933');R(c,x-7+i*4,y-7,2,4,'#766044');}
  const f=Math.sin(t*9+x)*1.5;
  R(c,x-7,y-16+f,5,11,'#a8331b');
  R(c,x-2,y-21-f,4,16,'#d9662f');
  R(c,x+3,y-14+f,4,9,'#b23a1e');
  R(c,x-2,y-17-f,2,8,'#f2b34d');
  R(c,x+4,y-10,1,4,'#ffdc83');
  for(let i=0;i<3;i++){
    const life=(t*16+i*7)%26;
    c.save();c.globalAlpha=Math.max(0,.7-life/26);DOT(c,x+Math.sin(t*3+i)*7,y-20-life,'#e9a24c');c.restore();
  }
}
function drawWeaponRack(c,x,y,t){
  SHADOW(c,x,y,18,3);
  R(c,x-17,y-20,2,20,'#503a23');R(c,x+15,y-20,2,20,'#503a23');
  R(c,x-18,y-15,36,2,'#6e502e');
  for(let i=0;i<4;i++){
    const sx=x-12+i*8;
    R(c,sx,y-30,1,20,'#8a6a42');
    R(c,sx-2,y-33,5,4,'#aeb2ad');
    R(c,sx-2,y-29,5,2,'#745027');
  }
  R(c,x-19,y-4,38,3,'#3e2d1d');
}
function drawCrate(c,x,y,s=1){
  SHADOW(c,x,y,10*s,3*s);
  R(c,x-9*s,y-15*s,18*s,15*s,'#6e4e2d');
  R(c,x-9*s,y-15*s,18*s,2*s,'#93703f');
  R(c,x-9*s,y-8*s,18*s,2*s,'#52391f');
  R(c,x-2*s,y-15*s,2*s,15*s,'#52391f');
  O(c,x-9*s,y-15*s,18*s,15*s,'#3c2a19');
}
function drawSack(c,x,y,s=1){
  SHADOW(c,x,y,7*s,2*s);
  c.fillStyle='#8b774c';
  c.beginPath();c.moveTo(x-6*s,y);c.lineTo(x-8*s,y-10*s);c.lineTo(x-4*s,y-14*s);c.lineTo(x+5*s,y-13*s);c.lineTo(x+8*s,y-4*s);c.lineTo(x+6*s,y);c.closePath();c.fill();
  R(c,x-4*s,y-15*s,8*s,3*s,'#6f5d3a');
  R(c,x-3*s,y-10*s,6*s,2*s,'#a58e5c');
}

/* =========================================================
   建筑 / 场景
   ========================================================= */
function groundVillage(c,t){
  R(c,0,0,640,360,'#5d5838');
  for(let y=0;y<360;y+=4){
    for(let x=0;x<640;x+=4){
      const h=hash2(x>>2,y>>2);
      if(h>.7)R(c,x,y,2,2,'#696341');
      else if(h<.2)R(c,x,y,1,2,'#514c31');
    }
  }
  // path
  c.fillStyle='#8b774c';
  c.beginPath();
  c.moveTo(286,360);c.lineTo(278,312);c.lineTo(286,266);c.lineTo(292,222);c.lineTo(276,190);c.lineTo(300,168);
  c.lineTo(340,168);c.lineTo(362,198);c.lineTo(386,226);c.lineTo(418,244);c.lineTo(446,266);c.lineTo(452,360);
  c.closePath();c.fill();
  R(c,282,340,166,20,'#8b774c');
  c.fillStyle='#76633f';
  for(let y=180;y<360;y+=8){R(c,290+Math.sin(y*.08)*3,y,100,1,'rgba(70,55,32,.4)');}
  DITHER(c,300,190,140,165,'#a08a5b',5);
  for(let i=0;i<60;i++){
    const x=hash2(i,7)*640,y=hash2(i,11)*360;
    if(x>270&&x<460&&y>180)continue;
    const g=hash2(i,13)>.5?'#777b4c':'#4a4f30';
    R(c,x,y,1,3,g);R(c,x+2,y+1,1,2,g);
  }
  // dry field
  drawField(c,444,160,158,122,t);
  // moss/stone patches
  for(let i=0;i<14;i++){
    const x=30+hash2(i,21)*560,y=70+hash2(i,23)*270;
    c.save();c.globalAlpha=.15;CIRC(c,x,y,4+hash2(i,2)*7,'#8d8a58');c.restore();
  }
  // fallen leaves
  for(let i=0;i<18;i++){
    const x=hash2(i,31)*640,y=80+hash2(i,37)*270;
    R(c,x,y,2,1,i%2?'#7d6538':'#947a42');
  }
}
function groundTemple(c,t){
  R(c,0,0,640,360,'#454941');
  for(let y=0;y<360;y+=16){
    for(let x=0;x<640;x+=16){
      const h=hash2(x>>4,y>>4);
      R(c,x,y,16,16,h>.66?'#565b51':h>.33?'#4d524a':'#484c45');
      R(c,x,y,16,1,'#3a3e38');
      R(c,x,y,1,16,'#3a3e38');
      if(h>.8)R(c,x+3,y+4,2,2,'#666a5e');
    }
  }
  // moss
  for(let i=0;i<28;i++){
    const x=hash2(i,5)*640,y=90+hash2(i,9)*260;
    c.save();c.globalAlpha=.2;DITHER(c,x,y,18,7,'#72805a',3);c.restore();
  }
  // central worn path
  c.save();c.globalAlpha=.18;R(c,270,120,100,240,'#8b8a75');c.restore();
  DITHER(c,250,110,140,250,'#757566',6);
  // fallen ginkgo leaves
  for(let i=0;i<30;i++){
    const x=440+hash2(i,17)*150,y=180+hash2(i,19)*160;
    R(c,x,y,2,1,i%3?'#b8a64e':'#d0bb62');
  }
}
function drawTempleHall(c,x,y,t){
  // x center, y base of steps
  SHADOW(c,x,y,126,8,.15);
  // steps
  for(let i=0;i<4;i++)R(c,x-100-i*9,y-4-i*4,200+i*18,4,i%2?'#6f7064':'#7e7f71');
  // platform
  R(c,x-112,y-24,224,8,'#64655a');
  // red pillars
  for(const px of [x-88,x-30,x+30,x+88]){
    R(c,px-6,y-124,12,100,'#632b22');
    R(c,px-5,y-123,7,98,'#7e392c');
    R(c,px-3,y-123,2,98,'#9a4a36');
    R(c,px-9,y-28,18,6,'#4c4a40');
  }
  // wall
  R(c,x-94,y-122,188,92,'#3d3025');
  R(c,x-90,y-118,180,84,'#4a3a2c');
  // doors
  R(c,x-26,y-104,52,70,'#211611');
  R(c,x-23,y-101,22,67,'#342118');
  R(c,x+1,y-101,22,67,'#342118');
  R(c,x-1,y-104,2,70,'#5b3a24');
  for(let i=0;i<4;i++){R(c,x-20+i*7,y-95,1,15,'#7d572f');R(c,x+3+i*7,y-95,1,15,'#7d572f');}
  // beams
  R(c,x-98,y-128,196,8,'#6b3b25');
  R(c,x-100,y-132,200,4,'#8a5031');
  R(c,x-96,y-116,192,3,'#2e2017');
  // roof
  c.fillStyle='#2b2c27';
  c.beginPath();
  c.moveTo(x-140,y-130);c.lineTo(x-110,y-170);c.lineTo(x+110,y-170);c.lineTo(x+140,y-130);c.closePath();c.fill();
  R(c,x-146,y-134,292,7,'#1e201d');
  R(c,x-116,y-174,232,8,'#363832');
  R(c,x-142,y-133,292,3,'#4e5047');
  for(let i=0;i<12;i++)R(c,x-133+i*22,y-162,3,27,i%2?'#1f211e':'#31332e');
  // ridge ornaments
  R(c,x-118,y-180,6,8,'#4b4d44');R(c,x+112,y-180,6,8,'#4b4d44');
  R(c,x-116,y-184,2,5,'#6a6c60');R(c,x+114,y-184,2,5,'#6a6c60');
  // plaque
  R(c,x-28,y-119,56,15,'#20140e');
  R(c,x-26,y-117,52,11,'#2e1d14');
  AText(c,'皇觉寺',x,y-111,8,'#d7b66e','center');
  // lanterns
  for(const px of [x-63,x+63]){
    R(c,px,y-112,2,9,'#2e2116');
    R(c,px-5,y-106,12,12,'#8f2a1e');
    R(c,px-3,y-104,8,8,'#d9a85a');
    GLOW(c,px,y-100,28,'#df9b4e',.14);
  }
}
function drawBell(c,x,y,t,swing=0){
  // bell tower base
  SHADOW(c,x,y,29,6);
  R(c,x-25,y-12,50,10,'#5b5c50');
  R(c,x-23,y-13,46,4,'#717264');
  R(c,x-22,y-62,4,50,'#513b26');R(c,x+18,y-62,4,50,'#513b26');
  R(c,x-27,y-66,54,5,'#6b4c2e');
  R(c,x-30,y-70,60,4,'#3d2c1d');
  // bell
  const sw=Math.sin(swing)*4;
  R(c,x-1+sw*.5,y-64,2,9,'#6d532f');
  c.fillStyle='#7a6a42';
  c.beginPath();c.moveTo(x-11+sw,y-54);c.lineTo(x-7+sw,y-42);c.lineTo(x+7+sw,y-42);c.lineTo(x+11+sw,y-54);c.closePath();c.fill();
  R(c,x-12+sw,y-55,24,4,'#938355');
  R(c,x-8+sw,y-41,16,3,'#a2915e');
  R(c,x-2+sw,y-40,4,6,'#5c4b2c');
  R(c,x-5+sw,y-50,2,7,'#9d8b58');
  GLOW(c,x,y-47,36,'#d8b86d',.08);
}
function drawIncense(c,x,y,t){
  SHADOW(c,x,y,18,4);
  R(c,x-14,y-4,28,4,'#4f4b3f');
  R(c,x-10,y-12,20,9,'#6d6551');
  R(c,x-12,y-13,24,3,'#83785f');
  R(c,x-7,y-19,14,7,'#5a5444');
  R(c,x-5,y-21,10,2,'#8b805f');
  for(let i=0;i<3;i++){
    const sx=x-5+i*5;
    R(c,sx,y-25,1,6,'#7e5a38');
    DOT(c,sx,y-26,'#d47637');
    const rise=(t*10+i*9)%30;
    c.save();c.globalAlpha=Math.max(0,.25-rise/150);
    CIRC(c,sx+Math.sin(t+i)*3,y-28-rise,2+rise*.08,'#d4d2c1');
    c.restore();
  }
  GLOW(c,x,y-8,42,'#e6a757',.09);
}
function drawStoneLantern(c,x,y,t,lit=true){
  SHADOW(c,x,y,11,3);
  R(c,x-7,y-4,14,4,'#5c5c50');
  R(c,x-3,y-22,6,18,'#6b6b5d');
  R(c,x-10,y-26,20,4,'#777767');
  R(c,x-7,y-36,14,10,'#5d5d50');
  R(c,x-5,y-34,10,6,lit?'#d7a45b':'#383a34');
  R(c,x-11,y-38,22,3,'#6a6a5b');
  if(lit)GLOW(c,x,y-31,24,'#e4ad5b',.12);
}
function drawCypress(c,x,y,s,t){
  SHADOW(c,x,y,8*s,3*s);
  R(c,x-2*s,y-20*s,4*s,20*s,'#44301f');
  const sway=Math.sin(t*1.1+x)*1;
  c.fillStyle='#27352a';
  c.beginPath();
  c.moveTo(x+sway,y-76*s);c.lineTo(x+13*s+sway,y-42*s);c.lineTo(x+9*s+sway,y-44*s);c.lineTo(x+16*s+sway,y-24*s);
  c.lineTo(x+6*s+sway,y-28*s);c.lineTo(x+9*s+sway,y-14*s);c.lineTo(x-9*s+sway,y-14*s);c.lineTo(x-6*s+sway,y-28*s);
  c.lineTo(x-16*s+sway,y-24*s);c.lineTo(x-9*s+sway,y-44*s);c.lineTo(x-13*s+sway,y-42*s);c.closePath();c.fill();
  c.fillStyle='#344433';
  c.beginPath();c.moveTo(x+sway,y-76*s);c.lineTo(x+7*s+sway,y-45*s);c.lineTo(x+2*s+sway,y-20*s);c.lineTo(x-2*s+sway,y-20*s);c.lineTo(x-7*s+sway,y-45*s);c.closePath();c.fill();
  DITHER(c,x-12*s,y-60*s,24*s,36*s,'#465940',4);
}