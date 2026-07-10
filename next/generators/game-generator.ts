/**
 * Real game generator for RorkParity.
 * Returns a complete, self-contained single-file HTML5 document (inline <canvas>
 * + <script>, NO external CDN, NO React) that runs inside an <iframe srcDoc>.
 *
 * Keyword routing (case-insensitive):
 *   brawler | fight  -> arena brawler (WASD/arrows move, space attack, spawn, HP, score)
 *   shooter         -> top-down shooter
 *   3d              -> pseudo-3d rotating cube (canvas 2D)
 *   idle | rpg      -> clicker with gold + auto-increment
 *   default         -> generic canvas mini-game
 */

const ACCENT = '#f97316'; // orange hsl(24.6 95% 53.1%)

function doc(title: string, controls: string, script: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>RorkParity — ${title}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{background:#0a0a0a;color:#fff;font-family:ui-sans-serif,system-ui,-apple-system,"SF Pro",Segoe UI,Roboto,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:12px}
  h1{font-size:18px;font-weight:600;letter-spacing:-0.02em}
  h1 span{color:${ACCENT}}
  p{font-size:12px;color:#a3a3a3}
  canvas{background:#000;border:1px solid rgba(255,255,255,.08);border-radius:16px;width:min(92vw,800px);height:auto;max-height:78vh;image-rendering:pixelated}
</style>
</head>
<body>
  <h1>Rork<span>Parity</span> — ${title}</h1>
  <p>${controls}</p>
  <canvas id="g" width="800" height="600"></canvas>
  <script>${script}<\/script>
</body>
</html>`;
}

function brawlerScript(): string {
  return `(function(){
  var c=document.getElementById('g');var x=c.getContext('2d');var W=c.width,H=c.height;
  var p={x:W/2,y:H/2,r:16,hp:100,score:0,cd:0};var es=[];var k={};
  function spawn(){es.push({x:Math.random()<0.5?0:W,y:Math.random()*H,r:14,hp:3,sp:1+Math.random()*1.6});}
  addEventListener('keydown',function(e){k[e.key.toLowerCase()]=true;if(e.key===' '){e.preventDefault();hit();}});
  addEventListener('keyup',function(e){k[e.key.toLowerCase()]=false;});
  function hit(){if(p.cd>0)return;p.cd=18;for(var i=es.length-1;i>=0;i--){var en=es[i];if(Math.hypot(en.x-p.x,en.y-p.y)<64){en.hp--;if(en.hp<=0){es.splice(i,1);p.score+=10;}}}}
  function loop(){
    if(typeof requestAnimationFrame!=='function')return;
    requestAnimationFrame(loop);
    x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);
    var s=3.4;
    if(k['w']||k['arrowup'])p.y-=s;if(k['s']||k['arrowdown'])p.y+=s;
    if(k['a']||k['arrowleft'])p.x-=s;if(k['d']||k['arrowright'])p.x+=s;
    p.x=Math.max(p.r,Math.min(W-p.r,p.x));p.y=Math.max(p.r,Math.min(H-p.r,p.y));
    if(p.cd>0)p.cd--;
    if(Math.random()<0.022)spawn();
    for(var i=es.length-1;i>=0;i--){var en=es[i];var dx=p.x-en.x,dy=p.y-en.y,d=Math.hypot(dx,dy)||1;en.x+=dx/d*en.sp;en.y+=dy/d*en.sp;if(d<p.r+en.r){p.hp-=0.35;es.splice(i,1);}}
    if(p.cd>0){x.strokeStyle='${ACCENT}';x.lineWidth=4;x.beginPath();x.arc(p.x,p.y,46,0,7);x.stroke();}
    x.fillStyle='${ACCENT}';x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill();
    x.fillStyle='#ef4444';for(var e of es){x.beginPath();x.arc(e.x,e.y,e.r,0,7);x.fill();}
    x.fillStyle='#fff';x.font='16px ui-monospace,monospace';x.fillText('HP '+(Math.max(0,p.hp|0))+'   Score '+p.score,W-170,26);
    if(p.hp<=0){x.fillStyle='rgba(0,0,0,.7)';x.fillRect(0,0,W,H);x.fillStyle='#fff';x.font='40px ui-monospace,monospace';x.fillText('GAME OVER',W/2-110,H/2);}
  }
  if(typeof requestAnimationFrame==='function')loop();else loop();
})();`;
}

function shooterScript(): string {
  return `(function(){
  var c=document.getElementById('g');var x=c.getContext('2d');var W=c.width,H=c.height;
  var p={x:W/2,y:H-60,r:14,cd:0,score:0,hp:100};var bs=[];var es=[];var k={};
  addEventListener('keydown',function(e){k[e.key.toLowerCase()]=true;});
  addEventListener('keyup',function(e){k[e.key.toLowerCase()]=false;});
  addEventListener('mousedown',function(){fire();});
  function fire(){if(p.cd>0)return;p.cd=10;bs.push({x:p.x,y:p.y-16,v:7});}
  function spawn(){es.push({x:Math.random()*W,y:-20,r:14,hp:2,sp:1+Math.random()*1.4});}
  function loop(){
    if(typeof requestAnimationFrame!=='function')return;
    requestAnimationFrame(loop);
    x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);
    var s=4;
    if(k['a']||k['arrowleft'])p.x-=s;if(k['d']||k['arrowright'])p.x+=s;
    p.x=Math.max(p.r,Math.min(W-p.r,p.x));
    if(p.cd>0)p.cd--;if(k[' '])fire();
    if(Math.random()<0.03)spawn();
    for(var i=bs.length-1;i>=0;i--){var b=bs[i];b.y-=b.v;if(b.y<0){bs.splice(i,1);continue;}
      for(var j=es.length-1;j>=0;j--){var en=es[j];if(Math.hypot(en.x-b.x,en.y-b.y)<en.r+b.r/2){en.hp--;bs.splice(i,1);if(en.hp<=0){es.splice(j,1);p.score+=10;}break;}}}
    for(var i=es.length-1;i>=0;i--){var en=es[i];en.y+=en.sp;if(en.y>H+20){es.splice(i,1);continue;}if(Math.hypot(en.x-p.x,en.y-p.y)<en.r+p.r){p.hp-=0.5;es.splice(i,1);}}
    x.fillStyle='${ACCENT}';for(var b of bs){x.fillRect(b.x-3,b.y-8,6,16);}
    x.fillStyle='#ef4444';for(var en of es){x.beginPath();x.arc(en.x,en.y,en.r,0,7);x.fill();}
    x.fillStyle='${ACCENT}';x.beginPath();x.moveTo(p.x,p.y-16);x.lineTo(p.x-14,p.y+12);x.lineTo(p.x+14,p.y+12);x.closePath();x.fill();
    x.fillStyle='#fff';x.font='16px ui-monospace,monospace';x.fillText('HP '+(Math.max(0,p.hp|0))+'   Score '+p.score,W-170,26);
    if(p.hp<=0){x.fillStyle='rgba(0,0,0,.7)';x.fillRect(0,0,W,H);x.fillStyle='#fff';x.font='40px ui-monospace,monospace';x.fillText('GAME OVER',W/2-110,H/2);}
  }
  if(typeof requestAnimationFrame==='function')loop();else loop();
})();`;
}

function cubeScript(): string {
  return `(function(){
  var c=document.getElementById('g');var x=c.getContext('2d');var W=c.width,H=c.height;
  var pts=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
  var edges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  var ax=0.01,ay=0.013,t=0;
  function loop(){
    if(typeof requestAnimationFrame!=='function')return;
    requestAnimationFrame(loop);t+=0.02;
    x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);
    var ca=Math.cos(t*0.7),sa=Math.sin(t*0.7),cb=Math.cos(t),sb=Math.sin(t);
    var pr=pts.map(function(p){var X=p[0],Y=p[1],Z=p[2];
      var x1=X*ca-Z*sa,y1=Y,z1=X*sa+Z*ca;
      var x2=x1*cb-z1*sb,y2=y1,x3=x1*sb+z1*cb;
      return[x2,y2,z3];});
    var cx=W/2,cy=H/2,sc=120;
    x.strokeStyle='${ACCENT}';x.lineWidth=3;
    for(var e of edges){var a=pr[e[0]],b=pr[e[1]];x.beginPath();x.moveTo(cx+a[0]*sc,a[1]*sc+cy);x.lineTo(cx+b[0]*sc,b[1]*sc+cy);x.stroke();}
    x.fillStyle='#fff';x.font='16px ui-monospace,monospace';x.fillText('rotate: '+(t).toFixed(1)+' rad',16,26);
  }
  if(typeof requestAnimationFrame==='function')loop();else loop();
})();`;
}

function clickerScript(): string {
  return `(function(){
  var c=document.getElementById('g');var x=c.getContext('2d');var W=c.width,H=c.height;
  var gold=0,gps=0,click=1,lvl=1,cost=15,t=0,parts=[];
  c.addEventListener('click',function(e){var r=c.getBoundingClientRect();var mx=(e.clientX-r.left)/r.width*W;var my=(e.clientY-r.top)/r.height*H;
    if(mx>W/2-90&&mx<W/2+90&&my>H/2-40&&my<H/2+40){gold+=click;for(var i=0;i<6;i++)parts.push({x:W/2,y:H/2,vx:(Math.random()-.5)*4,vy:-2-Math.random()*3,life:40});}
    if(gold>=cost&&my>120&&my<170){gold-=cost;gps+=1;lvl++;cost=Math.floor(cost*1.6);}
  });
  function loop(){
    if(typeof requestAnimationFrame!=='function')return;
    requestAnimationFrame(loop);t++;if(t%60===0)gold+=gps;
    x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);
    x.fillStyle='#fff';x.font='28px ui-monospace,monospace';x.fillText('Gold: '+Math.floor(gold),24,46);
    x.font='16px ui-monospace,monospace';x.fillText('Gold/sec: '+gps+'   Lvl '+lvl,24,74);
    x.fillStyle='${ACCENT}';x.beginPath();x.arc(W/2,H/2,40,0,7);x.fill();
    x.fillStyle='#000';x.font='bold 22px ui-monospace,monospace';x.textAlign='center';x.fillText('TAP',W/2,H/2+8);x.textAlign='left';
    x.fillStyle=gold>=cost?'${ACCENT}':'#555';x.fillRect(W/2-110,120,220,50);
    x.fillStyle='#000';x.font='bold 16px ui-monospace,monospace';x.textAlign='center';x.fillText('Upgrade ('+cost+'g) +1/s',W/2,151);x.textAlign='left';
    for(var i=parts.length-1;i>=0;i--){var p=parts[i];p.x+=p.vx;p.y+=p.vy;p.vy+=0.15;p.life--;x.fillStyle='rgba(249,115,22,'+(p.life/40)+')';x.font='14px ui-monospace,monospace';x.fillText('+'+click,p.x,p.y);if(p.life<=0)parts.splice(i,1);}
  }
  if(typeof requestAnimationFrame==='function')loop();else loop();
})();`;
}

function defaultScript(): string {
  return `(function(){
  var c=document.getElementById('g');var x=c.getContext('2d');var W=c.width,H=c.height;
  var p={x:W/2,y:H/2,r:12,score:0};var coins=[];var k={};var t=0;
  addEventListener('keydown',function(e){k[e.key.toLowerCase()]=true;});
  addEventListener('keyup',function(e){k[e.key.toLowerCase()]=false;});
  function spawn(){coins.push({x:Math.random()*W,y:Math.random()*H,r:10,life:240});}
  function loop(){
    if(typeof requestAnimationFrame!=='function')return;
    requestAnimationFrame(loop);t++;
    x.fillStyle='#0a0a0a';x.fillRect(0,0,W,H);
    var s=3.6;
    if(k['w']||k['arrowup'])p.y-=s;if(k['s']||k['arrowdown'])p.y+=s;
    if(k['a']||k['arrowleft'])p.x-=s;if(k['d']||k['arrowright'])p.x+=s;
    p.x=Math.max(p.r,Math.min(W-p.r,p.x));p.y=Math.max(p.r,Math.min(H-p.r,p.y));
    if(t%40===0)spawn();
    for(var i=coins.length-1;i>=0;i--){var co=coins[i];co.life--;if(co.life<=0){coins.splice(i,1);continue;}
      if(Math.hypot(co.x-p.x,co.y-p.y)<co.r+p.r){coins.splice(i,1);p.score+=1;}}
    x.fillStyle='${ACCENT}';for(var co of coins){x.beginPath();x.arc(co.x,co.y,co.r,0,7);x.fill();}
    x.fillStyle='#fff';x.beginPath();x.arc(p.x,p.y,p.r,0,7);x.fill();
    x.fillStyle='#fff';x.font='16px ui-monospace,monospace';x.fillText('Score '+p.score,W-120,26);
  }
  if(typeof requestAnimationFrame==='function')loop();else loop();
})();`;
}

export function generateGame(prompt: string): string {
  const p = (prompt || '').toLowerCase();
  if (/\b(brawler|fight|fighting|arena)\b/.test(p)) {
    return doc('Arena Brawler', 'Move: WASD / Arrows · Attack: Space', brawlerScript());
  }
  if (/\bshoot(er|ing)?\b/.test(p)) {
    return doc('Top-Down Shooter', 'Move: A/D · Fire: Space or Click', shooterScript());
  }
  if (/\b3d\b|\bcube\b|\brotat/.test(p)) {
    return doc('3D Cube', 'Auto-rotating pseudo-3D cube (canvas 2D)', cubeScript());
  }
  if (/\b(idle|rpg|clicker|tycoon)\b/.test(p)) {
    return doc('Gold Clicker', 'Click the orb to earn gold · Upgrade for passive income', clickerScript());
  }
  return doc('Mini Game', 'Move: WASD / Arrows · Collect the orange orbs', defaultScript());
}
