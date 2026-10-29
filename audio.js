/* =========================================================
   朱元璋的一生 · 程序化音频
   WebAudio 合成，无外部音频素材
   ========================================================= */
'use strict';

const Sfx = (() => {
  const NOTES = {
    D2:73.42,F2:87.31,G2:98.00,A2:110.00,C3:130.81,
    D3:146.83,F3:174.61,G3:196.00,A3:220.00,C4:261.63,
    D4:293.66,F4:349.23,G4:392.00,A4:440.00,C5:523.25,
    D5:587.33,F5:698.46,G5:783.99,A5:880.00
  };
  const api = {
    ctx:null,master:null,muted:false,musicMode:null,
    timer:null,step:0,nextTime:0,noiseBuf:null,ready:false
  };

  try{ api.muted = localStorage.getItem('zhu_muted')==='1'; }catch(e){}

  api.init = function(){
    if(api.ctx)return;
    const AC=window.AudioContext||window.webkitAudioContext;
    if(!AC)return;
    api.ctx=new AC();
    api.master=api.ctx.createGain();
    api.master.gain.value=api.muted?0:0.22;
    api.master.connect(api.ctx.destination);
    api.ready=true;
  };

  api.unlock = function(){
    api.init();
    if(!api.ctx)return;
    if(api.ctx.state==='suspended')api.ctx.resume();
    if(!api.timer)api._startLoop();
  };

  api.toggleMute = function(){
    api.muted=!api.muted;
    try{localStorage.setItem('zhu_muted',api.muted?'1':'0');}catch(e){}
    if(api.master){
      api.master.gain.cancelScheduledValues(api.ctx.currentTime);
      api.master.gain.setTargetAtTime(api.muted?0:0.22,api.ctx.currentTime,0.05);
    }
    return api.muted;
  };

  api.setMusic = function(mode){
    if(api.musicMode===mode)return;
    api.musicMode=mode;
    api.step=0;
    if(api.ctx)api.nextTime=api.ctx.currentTime+0.08;
  };

  api.now = function(){ return api.ctx ? api.ctx.currentTime : 0; };

  api._loop = function(){
    if(!api.ctx)return;
    if(api.muted||!api.musicMode){api.nextTime=api.ctx.currentTime+0.1;return;}
    if(api.nextTime<api.ctx.currentTime-0.8)api.nextTime=api.ctx.currentTime+0.05;
    while(api.nextTime<api.ctx.currentTime+0.28){
      api._schedule(api.step,api.nextTime);
      api.nextTime+=api._stepDur();
      api.step++;
    }
  };
  api._startLoop=function(){
    api.timer=setInterval(()=>api._loop(),55);
  };
  api._stepDur=function(){
    const bpm={title:54,explore:72,battle:112,throne:60,ending:54}[api.musicMode]||72;
    return 60/bpm/2;
  };

  api._schedule = function(step,time){
    const mode=api.musicMode;
    const s=step%16;
    if(mode==='explore'){
      const mel=['D4',null,'A3',null,'F4',null,'G4','A4','G4',null,'F4',null,'D4',null,'A3',null];
      if(mel[s])api.pluck(NOTES[mel[s]],time,.9,.035,'triangle');
      if(s===0||s===8)api.pluck(NOTES.D2,time,2.2,.025,'sine');
      if(s===6||s===14)api.pluck(NOTES.G3,time,1.1,.018,'triangle');
      if(step%64===32)api.bell(NOTES.D5,time,.6);
    }else if(mode==='battle'){
      if([0,4,8,12].includes(s))api.drum(time,1.0);
      if([2,6,10,14].includes(s))api.drum(time,.42);
      if([1,5,9,13].includes(s))api.hat(time);
      const bass=['D2',null,null,'D2','F2',null,'D2',null,'D2',null,'C3','D2','F2',null,'A2',null];
      if(bass[s])api.bass(NOTES[bass[s]],time,.24);
      if(s===0&&step%32===0)api.horn(NOTES.D3,time,1.4);
      if(s===8&&step%32===16)api.horn(NOTES.F3,time,.8);
    }else if(mode==='title'){
      if(s===0)api.pluck(NOTES.D3,time,3.2,.025,'sine');
      if(s===0||s===8)api.bell(NOTES.A4,time,.28);
      if(s===4)api.bell(NOTES.F4,time,.2);
      if(s===12)api.bell(NOTES.G4,time,.22);
      if(step%32===16)api.pluck(NOTES.D2,time,4,.018,'sine');
    }else if(mode==='throne'||mode==='ending'){
      if(s===0||s===8){
        api.bass(NOTES.D2,time,1.0);
        api.pluck(NOTES.D4,time,1.6,.028,'triangle');
        api.pluck(NOTES.A3,time,1.4,.022,'sine');
      }
      if(s===4||s===12)api.pluck(NOTES.F4,time,1.2,.02,'triangle');
      if(step%48===0)api.bell(NOTES.D5,time,.45);
      if(s===14)api.drum(time,.35);
    }
  };

  api._gain = function(time,g){
    const gain=api.ctx.createGain();
    gain.gain.setValueAtTime(0.0001,time);
    gain.connect(api.master);
    return gain;
  };

  api.pluck = function(freq,time,dur=1,gain=.04,type='triangle'){
    if(!api.ctx||api.muted)return;
    const t=time||api.ctx.currentTime;
    const o=api.ctx.createOscillator(),g=api.ctx.createGain(),f=api.ctx.createBiquadFilter();
    o.type=type;o.frequency.setValueAtTime(freq,t);
    o.frequency.exponentialRampToValueAtTime(freq*.997,t+dur);
    f.type='lowpass';f.frequency.setValueAtTime(1800,t);f.frequency.exponentialRampToValueAtTime(500,t+dur);
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(gain,t+.012);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(f);f.connect(g);g.connect(api.master);
    o.start(t);o.stop(t+dur+.05);
  };
  api.bass = function(freq,time,dur=.6,gain=.055){
    if(!api.ctx||api.muted)return;
    const t=time||api.ctx.currentTime;
    const o=api.ctx.createOscillator(),g=api.ctx.createGain();
    o.type='sine';o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(gain,t+.02);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g);g.connect(api.master);
    o.start(t);o.stop(t+dur+.05);
  };
  api.bell = function(freq,time,gain=.06){
    if(!api.ctx||api.muted)return;
    const t=time||api.ctx.currentTime;
    [1,2.01,3.02,4.1].forEach((m,i)=>{
      const o=api.ctx.createOscillator(),g=api.ctx.createGain();
      o.type=i===0?'sine':'triangle';o.frequency.value=freq*m;
      const base=gain/(1+i*1.7);
      g.gain.setValueAtTime(0.0001,t);
      g.gain.exponentialRampToValueAtTime(base,t+.006);
      g.gain.exponentialRampToValueAtTime(0.0001,t+1.4/(1+i*.4));
      o.connect(g);g.connect(api.master);
      o.start(t);o.stop(t+1.6);
    });
  };
  api.horn = function(freq,time,dur=1){
    if(!api.ctx||api.muted)return;
    const t=time||api.ctx.currentTime;
    const o=api.ctx.createOscillator(),g=api.ctx.createGain(),f=api.ctx.createBiquadFilter();
    o.type='sawtooth';o.frequency.setValueAtTime(freq*.97,t);
    o.frequency.linearRampToValueAtTime(freq,t+.18);
    o.frequency.linearRampToValueAtTime(freq*.99,t+dur);
    f.type='lowpass';f.frequency.value=520;
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(.035,t+.14);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(f);f.connect(g);g.connect(api.master);
    o.start(t);o.stop(t+dur+.05);
  };
  api.drum = function(time,power=1){
    if(!api.ctx||api.muted)return;
    const t=time||api.ctx.currentTime;
    const o=api.ctx.createOscillator(),g=api.ctx.createGain();
    o.type='sine';
    o.frequency.setValueAtTime(150*power+38,t);
    o.frequency.exponentialRampToValueAtTime(42,t+.16);
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(.13*power,t+.008);
    g.gain.exponentialRampToValueAtTime(0.0001,t+.24);
    o.connect(g);g.connect(api.master);
    o.start(t);o.stop(t+.3);
    api.noise(.12,900,.08*power,t);
  };
  api.hat = function(time){
    if(!api.ctx||api.muted)return;
    api.noise(.04,6000,.022,time||api.ctx.currentTime);
  };
  api.noiseBufGet = function(){
    if(api.noiseBuf)return api.noiseBuf;
    const len=Math.floor(api.ctx.sampleRate*1.2);
    const buf=api.ctx.createBuffer(1,len,api.ctx.sampleRate);
    const data=buf.getChannelData(0);
    for(let i=0;i<len;i++)data[i]=Math.random()*2-1;
    api.noiseBuf=buf;return buf;
  };
  api.noise = function(dur,freq,gain,time,type='lowpass'){
    if(!api.ctx||api.muted)return;
    const t=time||api.ctx.currentTime;
    const src=api.ctx.createBufferSource();src.buffer=api.noiseBufGet();
    const f=api.ctx.createBiquadFilter();f.type=type;f.frequency.value=freq;
    const g=api.ctx.createGain();
    g.gain.setValueAtTime(gain,t);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    src.connect(f);f.connect(g);g.connect(api.master);
    src.start(t);src.stop(t+dur+.02);
  };

  api.sfx = function(name){
    if(!api.ctx||api.muted)return;
    const t=api.ctx.currentTime;
    switch(name){
      case 'ui':
        api.pluck(520,t,.12,.03,'square');break;
      case 'confirm':
        api.pluck(440,t,.14,.035,'triangle');
        api.pluck(660,t+.08,.2,.032,'triangle');break;
      case 'talk':
        api.pluck(380,t,.08,.018,'triangle');break;
      case 'pickup':
        [523,659,784,1046].forEach((f,i)=>api.pluck(f,t+i*.07,.3,.03,'triangle'));break;
      case 'sweep':
        api.noise(.14,2600,.055,t,'highpass');break;
      case 'slash':
        api.noise(.12,3400,.07,t,'highpass');
        api.pluck(180,t,.1,.02,'sawtooth');break;
      case 'hit':
        api.noise(.1,700,.08,t);
        api.bass(90,t,.12,.06);break;
      case 'special':
        api.horn(NOTES.D3,t,.9);
        api.noise(.45,900,.11,t);
        api.drum(t+.08,1.2);break;
      case 'fire':
        api.noise(.8,520,.12,t);
        api.horn(NOTES.F3,t,.8);break;
      case 'explosion':
        api.noise(.6,320,.18,t);
        api.bass(55,t,.5,.1);break;
      case 'bell':
        api.bell(NOTES.A4,t,.11);
        api.bell(NOTES.D4,t+.35,.07);break;
      case 'victory':
        [392,523,659,784,1046].forEach((f,i)=>api.pluck(f,t+i*.13,.8,.045,'triangle'));
        api.drum(t,1.2);api.drum(t+.65,.9);break;
      case 'defeat':
        [392,330,262,196].forEach((f,i)=>api.pluck(f,t+i*.16,.9,.035,'sine'));break;
      case 'step':
        api.noise(.04,250,.012,t);break;
      case 'alert':
        api.pluck(330,t,.15,.035,'square');api.pluck(330,t+.18,.15,.035,'square');break;
      default:break;
    }
  };

  return api;
})();
