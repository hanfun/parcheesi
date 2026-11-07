/** Bộ âm thanh không cần file WAV/MP3. Chỉ phát sau thao tác người dùng. */
const KEY='parcheesi-sound-enabled-v1';
let enabled=true;
try { enabled=localStorage.getItem(KEY)!=='false'; } catch {}
let context;
function getContext() {
 if(!enabled) return null;
 const Ctor=window.AudioContext||window.webkitAudioContext;
 if(!Ctor) return null;
 try {context ||= new Ctor();if(context.state==='suspended')context.resume().catch(()=>{});return context;}catch{return null;}
}
function tone(c,time,freq=500,duration=.12,type='sine',volume=.11) {
 const osc=c.createOscillator(),gain=c.createGain();
 osc.type=type;osc.frequency.setValueAtTime(freq,time);
 gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(volume,time+.012);
 gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 osc.connect(gain);gain.connect(c.destination);osc.start(time);osc.stop(time+duration+.02);
}
function clack(c,time,volume=.13) {
 const length=Math.ceil(c.sampleRate*.075);
 const buf=c.createBuffer(1,length,c.sampleRate),data=buf.getChannelData(0);
 for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/length,1.8);
 const src=c.createBufferSource();src.buffer=buf;
 const filter=c.createBiquadFilter();filter.type='bandpass';filter.frequency.value=850;filter.Q.value=.8;
 const gain=c.createGain();gain.gain.setValueAtTime(volume,time);
 gain.gain.exponentialRampToValueAtTime(.0001,time+.073);
 src.connect(filter);filter.connect(gain);gain.connect(c.destination);
 src.start(time);src.stop(time+.075);
}
export const gameAudio={
 isEnabled:()=>enabled,
 toggle() {
  enabled=!enabled;try{localStorage.setItem(KEY,String(enabled));}catch{}
  if(enabled)this.play('tap');
  return enabled;
 },
 play(kind='tap') {
  const c=getContext();if(!c)return;
  const t=c.currentTime+.01;
  if(kind==='roll') {
   [0,.08,.16,.24,.33,.43,.56,.7,.82].forEach((dt,i)=>clack(c,t+dt,.12-i*.006));
   tone(c,t+.85,520,.13,'triangle',.055);return;
  }
  if(kind==='move'){tone(c,t,410,.08,'sine',.06);return;}
  if(kind==='tap'){tone(c,t,660,.07,'sine',.05);return;}
  if(kind==='capture'){
   tone(c,t,630,.13,'sawtooth',.08);tone(c,t+.11,310,.18,'triangle',.10);return;
  }
  if(kind==='finish'){
   [520,660,790,1040].forEach((f,i)=>tone(c,t+i*.085,f,.2,'sine',.11));return;
  }
  if(kind==='win'){
   [392,523,659,784,1046].forEach((f,i)=>tone(c,t+i*.16,f,.3,'triangle',.12));
  }
 }
};
