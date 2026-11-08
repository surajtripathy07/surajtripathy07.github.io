(function(){
  var mq=window.matchMedia('(prefers-reduced-motion: reduce)');
  var wide=window.matchMedia('(min-width: 900px) and (orientation: landscape)');
  var sheet=document.getElementById('sheet'),stage=document.getElementById('stage');
  var btn=document.getElementById('peekbtn');
  function $(s,r){return (r||document).querySelector(s)}
  function all(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
  function act(el,fn){el.addEventListener('click',fn);el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();fn(e)}})}
  function suffix(){return wide.matches?'-h':'-p'}
  function room(){return document.getElementById(wide.matches?'room-h':'room-p')}
  function fit(){
    var r=room().getBoundingClientRect(),vw=wide.matches?1440:390,vh=wide.matches?900:844;
    document.documentElement.style.setProperty('--s',Math.max(r.width/vw,r.height/vh).toFixed(4));
  }
  fit();addEventListener('resize',fit);
  if(wide.addEventListener)wide.addEventListener('change',function(){fit();setPeek(false)});

  // phone: tap the painting and the sheet slides down; tap again or scroll and it comes back
  function setPeek(on){
    document.body.classList.toggle('peek',on);
    btn.setAttribute('aria-pressed',on?'true':'false');
    btn.textContent=on?'Bring the page back':'Show the whole painting';
  }
  btn.addEventListener('click',function(e){e.stopPropagation();setPeek(!document.body.classList.contains('peek'))});
  stage.addEventListener('click',function(e){
    if(wide.matches||e.target.closest('.hot')||e.target.closest('#exit')||e.target.closest('#insp')||e.target===btn)return;
    setPeek(!document.body.classList.contains('peek'));
  });
  addEventListener('scroll',function(){if(document.body.classList.contains('peek')&&Math.abs(scrollY)>6)setPeek(false)},{passive:true});
  sheet.addEventListener('click',function(){if(document.body.classList.contains('peek'))setPeek(false)});

  // sheet <-> painting
  var behavior=function(){return mq.matches?'auto':'smooth'};
  function bring(el){
    if(wide.matches){
      var top=el.getBoundingClientRect().top-sheet.getBoundingClientRect().top+sheet.scrollTop-56;
      sheet.scrollTo({top:Math.max(0,top),behavior:behavior()});
    }else{
      setPeek(false);
      window.scrollTo({top:Math.max(0,el.getBoundingClientRect().top+scrollY-72),behavior:behavior()});
    }
  }
  function flash(el){el.classList.add('hl');clearTimeout(el._h);el._h=setTimeout(function(){el.classList.remove('hl')},2000)}
  function frameFor(k){return document.getElementById('art-'+k+suffix())}

  // frames: tap = animate + take me to the matching line
  var roads={};
  function wireRoad(g){
    var car=g.querySelector('.car'),lp=g.querySelector('.loop-path'),LEN=lp.getTotalLength(),lap=false,q=0;
    function put(d){var p=lp.getPointAtLength(d%LEN),n=lp.getPointAtLength((d+2)%LEN);car.style.transform='translate('+p.x.toFixed(1)+'px,'+p.y.toFixed(1)+'px) rotate('+(Math.atan2(n.y-p.y,n.x-p.x)*57.3).toFixed(1)+'deg)'}
    put(0);
    return function(){
      if(mq.matches){q=(q+1)%4;put(LEN*q/4);return}
      if(lap)return;lap=true;var t0=performance.now(),T=2600;
      (function f(now){var u=Math.min(1,(now-t0)/T);put(LEN*(u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2)*.999);if(u<1)requestAnimationFrame(f);else{put(0);lap=false}})(t0);
    };
  }
  all('.wallart').forEach(function(g){if(g.querySelector('.car'))roads[g.id]=wireRoad(g)});
  all('.wallart').forEach(function(g){
    var k=g.id.split('-')[1],line=document.getElementById('p-'+k);
    act(g,function(){
      if(roads[g.id])roads[g.id]();else g.classList.toggle('on');
      if(line){bring(line);flash(line)}
    });
  });
  // lines: hover or focus lifts the frame
  all('[data-frame]').forEach(function(li){
    function lift(on){var g=frameFor(li.getAttribute('data-frame'));if(g)g.classList.toggle('lift',on)}
    li.addEventListener('mouseenter',function(){lift(true)});li.addEventListener('mouseleave',function(){lift(false)});
    li.addEventListener('focusin',function(){lift(true)});li.addEventListener('focusout',function(){lift(false)});
  });
  // chess board points at the human line
  all('[id^="board-"]').forEach(function(b){
    act(b,function(){var t=$('[data-chess]');if(t){bring(t);flash(t)}});
  });
  // the man and his family: tap = look at you for a moment, and each of them reacts in their own way for about 1.5s
  all('.fig').forEach(function(f){
    var t=null,r=null;
    act(f,function(){
      f.classList.add('lookat');clearTimeout(t);t=setTimeout(function(){f.classList.remove('lookat')},3000);
      if(f.classList.contains('fpainter'))return;
      f.classList.add('react');clearTimeout(r);r=setTimeout(function(){f.classList.remove('react')},1500);
    });
  });
  // gentle pointer following (desktop with a mouse; never under reduced motion)
  var fine=window.matchMedia('(hover: hover) and (pointer: fine)');
  var fam=all('.wife,.kid,.baby'),lastPt=null,raf=0;
  function follow(){
    raf=0;if(!lastPt)return;
    fam.forEach(function(f){
      if(f.getBoundingClientRect().width===0)return;
      var h=f.querySelector('.fh');if(!h)return;
      var b=h.getBoundingClientRect(),cx=b.left+b.width/2,cy=b.top+b.height/2;
      var dx=Math.max(-1,Math.min(1,(lastPt.x-cx)/260)),dy=Math.max(-1,Math.min(1,(lastPt.y-cy)/260));
      var sg=f.classList.contains('lookat')?1:-1;
      f.style.setProperty('--gx',(sg*dx*1.7).toFixed(2));f.style.setProperty('--gy',(dy*1.3).toFixed(2));
      f.style.setProperty('--fx',(sg*dx*1.6).toFixed(2));f.style.setProperty('--fy',(dy*1.2).toFixed(2));
    });
  }
  function unfollow(){lastPt=null;fam.forEach(function(f){['--gx','--gy','--fx','--fy'].forEach(function(k){f.style.removeProperty(k)})})}
  document.addEventListener('pointermove',function(e){
    if(mq.matches||!fine.matches||e.pointerType==='touch')return;
    lastPt={x:e.clientX,y:e.clientY};if(!raf)raf=requestAnimationFrame(follow);
  },{passive:true});
  document.documentElement.addEventListener('mouseleave',unfollow);
  if(mq.addEventListener)mq.addEventListener('change',function(){if(mq.matches)unfollow()});

  // the canvas: turn it to see the self-portrait and the note beside it
  var insp=document.getElementById('insp'),rooms=all('.room');
  function cvEl(){return document.getElementById('canvas'+suffix())}
  function placeInsp(){
    var cv=cvEl(),hit=cv&&cv.querySelector('.hit');if(!hit)return;
    // sit above the canvas, never over the painter or the family
    var r=hit.getBoundingClientRect(),st=stage.getBoundingClientRect(),wd=wide.matches?300:Math.min(250,st.width-20);
    insp.style.width=wd+'px';insp.style.left=Math.max(10,Math.min(r.left-st.left,st.width-wd-10))+'px';
    insp.style.top=Math.max(6,r.top-st.top-insp.offsetHeight-10)+'px';
  }
  function setTurned(on){
    rooms.forEach(function(rm){rm.classList.add('tapped');rm.classList.toggle('turned',on)});
    all('.cvs').forEach(function(c){c.setAttribute('aria-pressed',on?'true':'false')});
    insp.hidden=!on;if(on)placeInsp();
  }
  all('.cvs').forEach(function(c){act(c,function(){setTurned(!insp.hidden?false:true);var h1=$('.id h1');if(!insp.hidden&&h1)flash(h1)})});
  addEventListener('resize',function(){if(!insp.hidden)placeInsp()});
  if(wide.addEventListener)wide.addEventListener('change',function(){setTurned(false)});

  // keyboard: five tones, made only from a tap or key press
  var AC=null;
  function ac(){var K=window.AudioContext||window.webkitAudioContext;if(!K)return null;if(!AC)AC=new K();if(AC.state==='suspended')AC.resume();return AC}
  function tone(f,dur,type,vol){
    var a=ac();if(!a)return;
    var o=a.createOscillator(),g=a.createGain(),t=a.currentTime;
    o.type=type||'sine';o.frequency.value=f;
    g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol||0.1,t+0.012);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+0.05);
  }
  all('.key').forEach(function(k){act(k,function(){tone(parseFloat(k.getAttribute('data-f')),1.1,'triangle',0.11);k.classList.add('down');setTimeout(function(){k.classList.remove('down')},mq.matches?160:180)})});

  // doorway (wide)
  var door=document.getElementById('door'),card=document.getElementById('exit');
  function toggleDoor(open){card.hidden=!open;if(door)door.setAttribute('aria-expanded',open?'true':'false')}
  if(door)act(door,function(e){toggleDoor(card.hidden);if(!card.hidden&&e&&e.type==='keydown')card.querySelector('a').focus()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){if(!insp.hidden){setTurned(false);var c0=cvEl();if(c0)c0.focus()}if(!card.hidden)toggleDoor(false);if(document.body.classList.contains('peek'))setPeek(false)}});

  // wide: the sheet is the only thing that scrolls, so send the wheel and page keys to it from anywhere
  addEventListener('wheel',function(e){if(wide.matches&&!sheet.contains(e.target))sheet.scrollTop+=e.deltaY},{passive:true});
  document.addEventListener('keydown',function(e){
    if(!wide.matches||document.activeElement!==document.body)return;
    var h=sheet.clientHeight,m={PageDown:h*.9,PageUp:-h*.9,' ':h*.9,ArrowDown:60,ArrowUp:-60};
    if(e.key in m){e.preventDefault();sheet.scrollBy({top:m[e.key],behavior:behavior()})}
    else if(e.key==='Home')sheet.scrollTo({top:0,behavior:behavior()});
    else if(e.key==='End')sheet.scrollTo({top:sheet.scrollHeight,behavior:behavior()});
  });

  window.__ready=true;
})();
