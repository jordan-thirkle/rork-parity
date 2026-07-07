// ============ LOCAL GENERATOR ============
// Minimal static-first game generator for workspace v1
// Uses known prompt keywords and returns a single HTML file.

const LocalGenerator = {
  generate(kind, prompt) {
    const map = {
      brawler: () => this.brawler(prompt),
      '3d': () => this.world3D(prompt),
      shooter: () => this.shooter(prompt),
      idle: () => this.idleRPG(prompt)
    };
    const fn = map[kind];
    return fn ? fn() : this.brawler(prompt);
  },

  brawler() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RorkParity Brawler</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#0a0a0a;color:#fff;font-family:sans-serif;overflow:hidden}
  #game{display:block;margin:0 auto;background:#111}
  .hud{position:fixed;left:12px;top:12px;font-family:monospace;background:rgba(0,0,0,.6);padding:8px 10px;border-radius:8px;z-index:10}
</style>
</head>
<body>
<div id="game"></div>
<div class="hud">HP <b id="hp">10</b> · XP <b id="xp">0</b> · LVL <b id="lvl">1</b></div>
<script src="https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js"><\/script>
<script>
(function(){
  const W=window.innerWidth, H=window.innerHeight;
  const sceneConfig={
    create(){
      this.player=this.add.rectangle(W/2,H-80,28,28,0x5d9eff).setDepth(1);
      this.enemies=[]; this.xp=0; this.level=1; this.hp=10;
      for(let i=0;i<4;i++){
        const x=Phaser.Math.Between(60,W-60), y=Phaser.Math.Between(80,H-120);
        this.enemies.push(this.add.rectangle(x,y,24,24,0x993333).setDepth(1));
      }
      this.keys=this.input.keyboard.addKeys({W:'W',A:'A',S:'S',D:'D',SPACE:'SPACE'});
      this.attackTimer=0; this.attackCooldown=400;
    },
    update(time,delta){
      const speed=180, dx=((this.keys.A.isDown?1:0)-(this.keys.D.isDown?1:0)), dy=((this.keys.W.isDown?1:0)-(this.keys.S.isDown?1:0));
      let mx=dx, my=dy;
      if(mx!==0 && my!==0){mx*=0.707; my*=0.707}
      this.player.x=Phaser.Math.Clamp(this.player.x+mx*speed*(delta/1000),20,W-20);
      this.player.y=Phaser.Math.Clamp(this.player.y+my*speed*(delta/1000),50,H-50);
      this.attackTimer-=delta;
      if(this.keys.SPACE.isDown && this.attackTimer<=0){
        this.attackTimer=this.attackCooldown;
        this.enemies.forEach(e=>{if(!e.active)return;const d=Phaser.Math.Distance.Between(this.player.x,this.player.y,e.x,e.y);if(d<40){e.hp-=this.level;if(e.hp<=0){e.destroy();this.xp+=10;document.getElementById('xp').textContent=this.xp;}}});
      }
      document.getElementById('hp').textContent=this.hp;
      document.getElementById('lvl').textContent=this.level;
    }
  };
  new Phaser.Game({type:Phaser.AUTO,width:W,height:H,parent:'game',scene:[sceneConfig],backgroundColor:'#111'});
})();
<\/script>
</body>
</html>`;
  },

  world3D() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RorkParity 3D World</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#000;color:#fff;font-family:sans-serif;overflow:hidden}
  canvas{display:block}
  #ui{position:fixed;left:12px;top:12px;background:rgba(0,0,0,.6);padding:8px 10px;border-radius:8px;font-family:monospace;z-index:10}
</style>
</head>
<body>
<div id="ui">Click to start · WASD move · Mouse look</div>
<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"}}<\/script>
<script type="module">
import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
const scene=new THREE.Scene();scene.background=new THREE.Color(0x0a0a1a);
const camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,0.1,500);camera.position.set(0,2,8);
const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setSize(innerWidth,innerHeight);document.body.prepend(renderer.domElement);
const controls=new PointerLockControls(camera,renderer.domElement);
document.addEventListener('click',()=>controls.lock());
const light=new THREE.DirectionalLight(0xffeedd,1.8);light.position.set(20,30,10);scene.add(light);
scene.add(new THREE.AmbientLight(0x444466,0.5));
const ground=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.MeshStandardMaterial({color:0x2a2a3a}));
ground.rotation.x=-Math.PI/2;scene.add(ground);
const box=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:0x5d9eff}));box.position.set(0,0.5,-3);scene.add(box);
const keys={w:false,a:false,s:false,d:false};
window.addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true});
window.addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false});
const clock=new THREE.Clock();
function animate(){
  requestAnimationFrame(animate);
  const dt=clock.getDelta(), s=6;
  if(controls.isLocked){
    const fwd=new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion);fwd.y=0;fwd.normalize();
    const right=new THREE.Vector3(1,0,0).applyQuaternion(camera.quaternion);right.y=0;right.normalize();
    if(keys.w)camera.position.addScaledVector(fwd,s*dt);
    if(keys.s)camera.position.addScaledVector(fwd,-s*dt);
    if(keys.a)camera.position.addScaledVector(right,-s*dt);
    if(keys.d)camera.position.addScaledVector(right,s*dt);
    camera.position.y=2;
  }
  renderer.render(scene,camera);
}
animate();
<\/script>
</body>
</html>`;
  },

  shooter() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RorkParity Shooter</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#05050a;color:#fff;font-family:sans-serif;overflow:hidden}
  #wrap{position:relative;width:100vw;height:100vh}
  #ship{position:absolute;left:50%;bottom:40px;width:32px;height:32px;background:#5d9eff;transform:translateX(-50%);border-radius:4px}
  .b{position:absolute;width:6px;height:14px;background:#ffcc00;left:50%;bottom:80px}
  .enemy{position:absolute;width:28px;height:28px;background:#ff4466;border-radius:4px}
  #hud{position:fixed;left:12px;top:12px;font-family:monospace;background:rgba(0,0,0,.6);padding:8px 10px;border-radius:8px;z-index:10}
</style>
</head>
<body>
<div id="wrap">
  <div id="ship"></div>
  <div id="bullets"></div>
</div>
<div id="hud">Score <b id="score">0</b></div>
<script>
(function(){
  const wrap=document.getElementById('wrap'), ship=document.getElementById('ship'), bullets=document.getElementById('bullets'), scoreEl=document.getElementById('score');
  let shipX=innerWidth/2, score=0, lastSpawn=0;
  document.addEventListener('mousemove',e=>{shipX=e.clientX;ship.style.left=(shipX-16)+'px'});
  document.addEventListener('mousedown',()=>{const b=document.createElement('div');b.className='b';b.style.left=(shipX-3)+'px';bullets.appendChild(b);setTimeout(()=>b.remove(),900)});
  function tick(now){
    requestAnimationFrame(tick);
    if(now-lastSpawn>700){
      lastSpawn=now;
      const e=document.createElement('div');e.className='enemy';e.style.left=Math.random()*(innerWidth-28)+'px';e.style.top='-28px';wrap.appendChild(e);
      const id=setInterval(()=>{const y=(parseFloat(e.style.top||'0')+2);e.style.top=y+'px';if(y>innerHeight){e.remove();clearInterval(id);scoreEl.textContent=++score}},16);
    }
  }
  requestAnimationFrame(tick);
})();
<\/script>
</body>
</html>`;
  },

  idleRPG() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RorkParity Idle RPG</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#0b0d14;color:#fff;font-family:sans-serif;display:flex;justify-content:center;padding-top:80px}
  .card{width:min(420px,92vw);background:#11141f;border:1px solid #22273a;border-radius:14px;padding:22px}
  .row{display:flex;justify-content:space-between;margin:10px 0;font-family:monospace}
  button{padding:10px 14px;background:#5d9eff;color:#fff;border:0;border-radius:8px;margin-top:8px}
</style>
</head>
<body>
<div class="card">
  <h2>Idle RPG</h2>
  <div class="row"><span>HP</span><b id="hp">100</b></div>
  <div class="row"><span>XP</span><b id="xp">0</b></div>
  <div class="row"><span>LVL</span><b id="lvl">1</b></div>
  <div class="row"><span>Gold</span><b id="gold">0</b></div>
  <button id="go">Quest</button>
</div>
<script>
(function(){
  let hp=100,xp=0,lvl=1,gold=0;
  const $=id=>document.getElementById(id);
  function render(){$.hp.textContent=hp;$.xp.textContent=xp;$.lvl.textContent=lvl;$.gold.textContent=gold}
  $.go.onclick=()=>{
    const roll=Math.random();
    if(roll<0.3){hp=Math.max(0,hp-10);alert('Took damage.')}
    else{xp+=12;gold+=5;if(xp>=lvl*40){lvl++;xp=0;alert('Level up!')}}
    render();
  };
  render();
})();
<\/script>
</body>
</html>`;
  }
};
