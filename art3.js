function groundCamp(c,t){
  R(c,0,0,640,360,'#1c261f');
  for(let y=0;y<360;y+=4){
    for(let x=0;x<640;x+=4){
      const h=hash2(x>>2,y>>2);
      if(h>.72)R(c,x,y,2,2,'#243126');
      else if(h<.16)R(c,x,y,1,2,'#151d18');
    }
  }
  // mud paths
  c.save();c.globalAlpha=.45;c.fillStyle='#3c3a2a';
  c.beginPath();c.moveTo(260,360);c.lineTo(280,260);c.lineTo(300,200);c.lineTo(340,200);c.lineTo(360,270);c.lineTo(390,360);c.closePath();c.fill();
  c.fillStyle='#443f2c';
  c.beginPath();c.moveTo(320,280);c.lineTo(420,250);c.lineTo(470,262);c.lineTo(450,320);c.lineTo(340,330);c.closePath();c.fill();
  c.restore();
  for(let i=0;i<20;i++){const x=hash2(i,4)*640,y=100+hash2(i,8)*250;R(c,x,y,2,1,'#4d4b37');R(c,x+1,y+2,1,1,'#343728');}
  // distant tree line
  c.fillStyle='#101914';
  c.beginPath();c.moveTo(0,90);
  for(let x=0;x<=640;x+=20)c.lineTo(x,76+Math.sin(x*.035)*8+hash2(x,2)*7);
  c.lineTo(640,0);c.lineTo(0,0);c.closePath();c.fill();
  for(let i=0;i<24;i++){
    const x=i*28+hash2(i,4)*10,y=62+hash2(i,6)*24;
    c.fillStyle=i%2?'#14201a':'#18261e';
    c.beginPath();c.moveTo(x,y+20);c.lineTo(x+9,y-8);c.lineTo(x+18,y+20);c.closePath();c.fill();
  }
}
function groundWarRoom(c,t){
  R(c,0,0,640,360,'#241a12');
  // wooden floor
  for(let y=100;y<360;y+=12){
    for(let x=0;x<640;x+=64){
      const h=hash2(x>>6,y>>3);
      R(c,x,y,64,12,h>.5?'#3d2b1d':'#37261a');
      R(c,x,y,64,1,'#261910');
      R(c,x,y,1,12,'#2a1c12');
      if(h>.7)R(c,x+12+hash2(x,y)*36,y+4,10,1,'#4b3523');
    }
  }
  // back wall
  R(c,0,0,640,100,'#2d241c');
  R(c,0,58,640,42,'#3a2d22');
  for(let x=0;x<640;x+=8)R(c,x,58,1,42,'#2e241b');
  R(c,0,54,640,4,'#4a3828');
  R(c,0,97,640,3,'#19130e');
  // window with moonlight
  R(c,420,16,100,44,'#171812');
  R(c,426,20,88,36,'#2d3a3c');
  for(let i=0;i<5;i++){R(c,432+i*17,20,1,36,'#1c241f');R(c,426,25+i*7,88,1,'#1c241f');}
  R(c,475,20,1,36,'#4b4d3b');
  c.save();c.globalAlpha=.1;R(c,430,56,80,40,'#9fb7a1');c.restore();
  // wall map
  R(c,70,14,160,62,'#6b5c3c');
  R(c,74,18,152,54,'#8b7d55');
  R(c,80,24,140,42,'#9c8d62');
  c.strokeStyle='#6f623f';c.lineWidth=1;
  c.beginPath();c.moveTo(88,50);c.bezierCurveTo(120,30,150,52,206,34);c.stroke();
  R(c,142,38,2,2,'#9e2b22');R(c,182,47,2,2,'#9e2b22');R(c,112,42,2,2,'#3f5c43');
  // shelves / scrolls
  R(c,540,20,72,70,'#2a2018');
  for(let i=0;i<3;i++)R(c,544+i*22,24,16,58,'#5b4a31');
  for(let i=0;i<4;i++)R(c,548+i*17,30,9,7,i%2?'#8f7f5a':'#6e5d3d');
}
function drawWarTable(c,x,y,t){
  SHADOW(c,x,y,72,12);
  R(c,x-74,y-8,148,8,'#4a321e');
  R(c,x-70,y-34,140,28,'#5e3f25');
  R(c,x-74,y-38,148,6,'#78522e');
  R(c,x-74,y-38,148,2,'#9c6b3a');
  for(const lx of [x-62,x+58]){
    R(c,lx,y-10,8,10,'#3d2918');
  }
  // map cloth
  R(c,x-54,y-33,108,23,'#b7a173');
  R(c,x-51,y-31,102,19,'#cbb583');
  R(c,x-46,y-28,94,13,'#d7c28f');
  c.strokeStyle='#8a7449';c.lineWidth=1;
  c.beginPath();c.moveTo(x-44,y-20);c.bezierCurveTo(x-20,y-32,x-4,y-15,x+20,y-25);c.bezierCurveTo(x+36,y-30,x+39,y-17,x+46,y-19);c.stroke();
  R(c,x-28,y-24,2,2,'#a33728');R(c,x+10,y-17,2,2,'#a33728');R(c,x+31,y-23,2,2,'#445f43');
  // tokens
  for(let i=0;i<5;i++){
    const tx=x-44+i*18,ty=y-21+(i%2)*5;
    R(c,tx,ty,4,3,i%2?'#9e2b22':'#314d40');
    R(c,tx,ty,4,1,i%2?'#c75a3e':'#50705c');
  }
  // candles
  for(const cx of [x-75,x+71]){
    R(c,cx-2,y-48,4,12,'#c9b07d');
    R(c,cx-1,y-50,2,3,'#e9d4a2');
    R(c,cx-1,y-55,2,5,'#e9a543');
    GLOW(c,cx,y-54,26,'#e6a648',.13);
  }
  // scrolls
  R(c,x-92,y-31,12,7,'#d7c79d');R(c,x-92,y-31,12,1,'#8f7548');
}
function drawScreen(c,x,y,w,h,t){
  R(c,x,y,w,h,'#2b2018');
  R(c,x+4,y+4,w-8,h-8,'#b4a37a');
  R(c,x+8,y+8,w-16,h-16,'#c7b68b');
  for(let i=0;i<4;i++){
    c.strokeStyle='rgba(72,58,37,.55)';c.lineWidth=2;
    c.beginPath();
    c.moveTo(x+18+i*10,y+16);c.lineTo(x+10+i*12,y+h-18);
    c.stroke();
  }
  R(c,x+w/2-1,y+6,2,h-12,'#4a3824');
}
function drawArmorStand(c,x,y,t){
  SHADOW(c,x,y,12,3);
  R(c,x-10,y-4,20,4,'#44301e');
  R(c,x-1,y-38,2,34,'#5b4228');
  R(c,x-13,y-38,26,2,'#5b4228');
  R(c,x-15,y-34,4,15,'#6b4b2c');R(c,x+11,y-34,4,15,'#6b4b2c');
  R(c,x-12,y-32,24,15,'#59605b');
  R(c,x-10,y-30,20,10,'#6e766e');
  R(c,x-8,y-28,4,4,'#b39857');R(c,x+4,y-28,4,4,'#b39857');
  R(c,x-11,y-19,22,8,'#3f4742');
  R(c,x-8,y-39,16,7,'#4a514b');
  R(c,x-6,y-42,12,4,'#707971');
}
function drawThrone(c,x,y,t){
  SHADOW(c,x,y,73,12);
  // dais
  for(let i=0;i<3;i++){
    const w=120+i*20;
    R(c,x-w/2,y-i*7-2,w,7,i%2?'#7a5b36':'#8f6d40');
    R(c,x-w/2,y-i*7-2,w,1,'#b08a53');
  }
  R(c,x-58,y-32,116,10,'#4b3420');
  R(c,x-54,y-34,108,3,'#6c4c2a');
  // screen behind
  R(c,x-56,y-102,112,70,'#58251e');
  R(c,x-52,y-98,104,62,'#7d3428');
  for(let i=0;i<6;i++)R(c,x-48+i*17,y-94,1,54,'#9a4b36');
  R(c,x-58,y-106,116,6,'#b38b4b');
  // throne chair
  R(c,x-36,y-78,72,48,'#3a2718');
  R(c,x-32,y-76,64,42,'#6d4b29');
  R(c,x-28,y-72,56,34,'#8b6135');
  R(c,x-24,y-68,48,26,'#a77a46');
  R(c,x-18,y-62,36,18,'#bb8c54');
  if(t%3<2)R(c,x-14,y-58,28,2,'#d4ab68');
  // arms
  R(c,x-44,y-68,12,28,'#4a301b');R(c,x-42,y-70,10,5,'#8d6438');
  R(c,x+32,y-68,12,28,'#4a301b');R(c,x+32,y-70,10,5,'#8d6438');
  // gold details
  R(c,x-38,y-82,8,4,'#cfaa5d');R(c,x+30,y-82,8,4,'#cfaa5d');
  AText(c,'洪',x,y-58,15,'#5b2b19','center');
  AText(c,'武',x,y-43,15,'#5b2b19','center');
  GLOW(c,x,y-56,80,'#d6a04b',.06);
}
function drawPillar(c,x,y,h,t){
  SHADOW(c,x,y,16,4);
  R(c,x-14,y-8,28,8,'#5d5546');
  R(c,x-11,y-h,22,h,'#6e241d');
  R(c,x-8,y-h,14,h,'#8e3024');
  R(c,x-6,y-h,3,h,'#a8422e');
  R(c,x-12,y-h-7,24,8,'#3e1c16');
  R(c,x-14,y-h-12,28,6,'#b2914d');
  R(c,x-10,y-30,20,5,'#a98040');
  for(let i=0;i<4;i++)R(c,x-7+i*5,y-h+8,2,h-42,'rgba(40,10,8,.18)');
  // gold dragon swirl
  c.strokeStyle='#c6a04e';c.lineWidth=1;
  c.beginPath();c.moveTo(x-3,y-80);c.bezierCurveTo(x+10,y-90,x-10,y-100,x+3,y-110);c.stroke();
}
function groundThrone(c,t){
  R(c,0,0,640,360,'#2a2119');
  // marble floor
  for(let y=80;y<360;y+=20){
    const off=((y-80)/20)%2?16:0;
    for(let x=-16;x<640;x+=32){
      const h=hash2((x+off)>>5,y>>4);
      R(c,x+off,y,32,20,h>.6?'#4a4b42':h>.3?'#414239':'#393a33');
      R(c,x+off,y,32,1,'#30312b');R(c,x+off,y,1,20,'#30312b');
    }
  }
  // red carpet
  R(c,266,72,108,288,'#5e1c17');
  R(c,272,72,96,288,'#7f261d');
  R(c,278,78,84,282,'#8e2c21');
  for(let y=86;y<352;y+=26){
    R(c,280,y,80,1,'#6d1f18');
    R(c,296,y+8,48,1,'#b48343');
  }
  // dais floor
  R(c,200,62,240,26,'#5d5849');
  R(c,210,56,220,8,'#706a57');
  // walls/pillars
  for(const px of [86,190,450,554])drawPillar(c,px,86,180,t);
  // back wall
  R(c,0,0,640,62,'#241b16');
  R(c,0,50,640,12,'#3a2a1e');
  R(c,0,49,640,2,'#6b4b2b');
  // doors behind throne
  R(c,270,4,100,52,'#1b1410');
  R(c,274,8,92,46,'#4a2c1c');
  for(let i=0;i<6;i++)R(c,276+i*15,8,1,46,'#2d1c12');
  // incense
  for(const px of [228,412]){
    R(c,px-5,48,10,4,'#b39353');
    R(c,px-2,44,4,5,'#826331');
    const rise=(t*8+px)%20;
    c.save();c.globalAlpha=.16;CIRC(c,px+Math.sin(t+px)*3,40-rise,3+rise*.12,'#d6ccb0');c.restore();
  }
}

/* =========================================================
   战斗场景
   ========================================================= */
function battleGround(c,t,kind='land',flash=0){
  if(kind==='water'){
    const g=c.createLinearGradient(0,0,0,360);
    g.addColorStop(0,'#18333b');g.addColorStop(.5,'#235057');g.addColorStop(1,'#0e252d');
    c.fillStyle=g;c.fillRect(0,0,640,360);
    // distant fires / glow
    GLOW(c,90,70,140,'#d65a2b',.16);GLOW(c,550,90,150,'#cf5428',.14);
    GLOW(c,320,170,160,'#c14f28',.05);
    for(let i=0;i<10;i++){
      const y=55+i*20;
      R(c,0,y,640,1,'rgba(130,190,185,.05)');
    }
    for(let y=40;y<360;y+=9){
      for(let x=0;x<640;x+=28){
        const ph=Math.sin(t*1.4+x*.12+y*.05);
        if(ph>.2){
          const len=8+hash2(x,y)*20;
          R(c,x+Math.sin(t*.7+y)*10,y,len,1,ph>.65?'rgba(132,194,184,.22)':'rgba(80,143,143,.13)');
        }
      }
    }
    // foam near foreground
    for(let i=0;i<16;i++){
      const x=hash2(i,3)*640,y=280+hash2(i,9)*70;
      R(c,x,y,5+hash2(i,4)*9,1,'rgba(178,219,204,.22)');
    }
    DITHER(c,0,0,640,360,'#2e6262',22);
    // floating debris
    for(let i=0;i<5;i++){
      const x=40+hash2(i,12)*560,y=100+hash2(i,18)*210;
      R(c,x,y,12,3,'#3b2a1b');R(c,x+3,y-2,2,2,'#6d4a2c');R(c,x+9,y+2,5,1,'#24170f');
    }
  }else{
    R(c,0,0,640,360,'#2a2b20');
    for(let y=0;y<360;y+=4){
      for(let x=0;x<640;x+=4){
        const h=hash2(x>>2,y>>2);
        if(h>.72)R(c,x,y,2,2,'#353629');
        else if(h<.18)R(c,x,y,1,2,'#1f2119');
      }
    }
    // mud and path
    c.save();c.globalAlpha=.35;c.fillStyle='#4d402a';
    c.beginPath();c.moveTo(0,300);c.lineTo(120,280);c.lineTo(300,320);c.lineTo(480,270);c.lineTo(640,300);c.lineTo(640,360);c.lineTo(0,360);c.closePath();c.fill();
    c.restore();
    // camp palisade top
    for(let x=0;x<640;x+=16){
      R(c,x,74+Math.sin(x*.2)*3,9,28,'#3d2b1c');
      R(c,x+2,70+Math.sin(x*.2)*3,5,8,'#594027');
    }
    R(c,0,96,640,4,'#2c2016');
    // distant tents
    for(const tx of [70,540]){
      c.fillStyle='#3b3326';
      c.beginPath();c.moveTo(tx-42,110);c.lineTo(tx,60);c.lineTo(tx+42,110);c.closePath();c.fill();
      R(c,tx-1,58,2,20,'#292118');
    }
    // crates / corpses? subtle
    for(let i=0;i<10;i++){
      const x=hash2(i,4)*640,y=150+hash2(i,7)*190;
      R(c,x,y,3,1,'#4a4530');R(c,x+1,y+2,2,1,'#3e3a29');
    }
    // torches at sides
    for(const tx of [40,600]){
      R(c,tx,130,2,40,'#4d3723');
      R(c,tx-3,126,8,7,'#a5391f');
      GLOW(c,tx+1,128,48,'#e59240',.12);
    }
    DITHER(c,0,100,640,260,'#454733',14);
  }
  if(flash>0){c.save();c.globalAlpha=flash;c.fillStyle='#ffd9a0';c.fillRect(0,0,640,360);c.restore();}
}
function drawWarship(c,x,y,scale,team,t,burning=false,flagship=false){
  const s=scale||1;
  c.save();c.translate(x,y);c.scale(s,s);
  const ally=team==='ally';
  const hull=ally?'#6b3d22':'#3b2b31';
  const hull2=ally?'#9a6136':'#55404a';
  const sail=ally?'#b4402f':'#3f2b45';
  const trim=ally?'#d4a64e':'#98713b';
  SHADOW(c,0,5,34,8);
  c.fillStyle=hull;
  c.beginPath();c.moveTo(-34,0);c.lineTo(-24,-12);c.lineTo(25,-12);c.lineTo(34,0);c.lineTo(24,8);c.lineTo(-25,8);c.closePath();c.fill();
  R(c,-28,-10,54,3,hull2);
  R(c,-30,0,60,3,'#2a1a12');
  for(let i=0;i<5;i++)R(c,-24+i*11,-6,6,6,ally?'#7b4a2a':'#49353e');
  // oars
  for(let i=0;i<4;i++){
    const sw=Math.sin(t*2+i*.7)*2;
    R(c,-30+i*8,5,4,2+sw,'#7a5833');
    R(c,18-i*6,5,4,2-sw,'#7a5833');
  }
  // mast
  R(c,-1,-66,3,58,'#5b3f25');
  R(c,-8,-64,17,3,trim);
  // sail
  const bulge=Math.sin(t*2.2+x*.02)*3;
  c.fillStyle=sail;
  c.beginPath();c.moveTo(2,-62);c.lineTo(22+bulge,-56);c.lineTo(20+bulge,-28);c.lineTo(2,-22);c.closePath();c.fill();
  c.fillStyle='rgba(0,0,0,.16)';
  c.beginPath();c.moveTo(2,-62);c.lineTo(9,-58);c.lineTo(8,-25);c.lineTo(2,-22);c.closePath();c.fill();
  R(c,2,-31,20,2,trim);
  if(flagship){
    R(c,2,-81,2,18,'#4c3420');
    c.fillStyle=ally?'#d4a64e':'#8b2f44';
    c.beginPath();c.moveTo(3,-81);c.lineTo(28+bulge,-76);c.lineTo(24+bulge,-66);c.lineTo(3,-69);c.closePath();c.fill();
    AText(c,ally?'明':'陈',11,-74,9,'#ffe8b0','center');
  }
  // cabin
  R(c,-19,-29,27,17,hull2);
  R(c,-17,-31,23,4,trim);
  R(c,-15,-25,5,5,'#d8a459');
  R(c,-7,-25,5,5,'#d8a459');
  R(c,4,-9,3,5,'#9e2b22');
  if(burning){
    const f=Math.sin(t*9)*2;
    R(c,-17,-34+f,8,10,'#a6381e');
    R(c,-11,-40-f,6,16,'#da6a30');
    R(c,-5,-33+f,7,9,'#e99c39');
    GLOW(c,-8,-30,50,'#e2742f',.25);
    for(let i=0;i<4;i++){
      const life=(t*20+i*8)%30;
      c.save();c.globalAlpha=Math.max(0,.6-life/30);DOT(c,-12+i*5,-42-life,'#f0b35b');c.restore();
    }
  }
  c.restore();
}
function drawWarBannerLarge(c,x,y,t,team='enemy',emblem='陈',hp=1){
  SHADOW(c,x,y,17,4);
  R(c,x-2,y-78,4,78,'#4a3421');
  R(c,x-5,y-82,10,5,'#b39154');
  R(c,x-3,y-3,12,3,'#393429');
  const sw=Math.sin(t*2.5+x*.04)*3;
  c.fillStyle=team==='enemy'?'#6e1d2a':'#9f2c22';
  c.beginPath();c.moveTo(x+2,y-76);c.lineTo(x+35+sw,y-70);c.lineTo(x+36+sw,y-47);c.lineTo(x+32+sw,y-24);c.lineTo(x+2,y-29);c.closePath();c.fill();
  R(c,x+2,y-76,4,47,team==='enemy'?'#8b2b3a':'#b94331');
  R(c,x+10+sw,y-64,18,2,'rgba(0,0,0,.15)');
  AText(c,emblem,x+18+sw,y-50,18,'#f0d698','center');
  R(c,x-6,y-6,18,6,'#2f2b22');
  return {x:x+2,y:y-78,w:36,h:52};
}

/* =========================================================
   标题与背景
   ========================================================= */