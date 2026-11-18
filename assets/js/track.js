(function(){
  if(typeof gtag!=='function'||!window.__ga)return;
  var path=location.pathname;
  function send(name,params){params.transport_type='beacon';try{gtag('event',name,params)}catch(e){}}
  function net(host){
    host=host.replace(/^www\./,'');
    var m={'linkedin.com':'linkedin','github.com':'github','gitlab.com':'gitlab','twitter.com':'twitter','x.com':'twitter'};
    return m[host]||null;
  }
  var LM='[id],main,header,footer,nav,section';
  function loc(a){
    var el=a.closest(LM);
    while(el&&!el.id&&el.parentElement)el=el.parentElement.closest(LM);
    return el?(el.id||el.tagName.toLowerCase()):'body';
  }
  document.addEventListener('click',function(e){
    var t=e.target;if(!t||!t.closest)return;
    if(t.closest('#door')){send('door_open',{page_path:path});return}
    var a=t.closest('a[href]');if(!a)return;
    var href=a.getAttribute('href')||'';
    if(/^mailto:/i.test(href)){send('contact_email',{page_path:path,link_location:loc(a)});return}
    if(!a.hostname||a.hostname===location.hostname)return;
    var n=net(a.hostname);
    if(n){send('social_click',{network:n,page_path:path,link_url:a.href});return}
    if(path==='/projects/')send('project_link',{link_url:a.href});
  });
  // door: its keyboard path calls the handler directly (no click event), so mirror it here
  document.addEventListener('keydown',function(e){
    if((e.key==='Enter'||e.key===' ')&&e.target&&e.target.id==='door')send('door_open',{page_path:path});
  });
  // read_complete: the end of the article body reaches the viewport on a post or drop page
  var m=path.match(/^\/(posts|drops)\/[^\/]+\/$/);
  var body=m&&document.querySelector('.prose');
  if(body&&'IntersectionObserver' in window){
    var s=document.createElement('div');s.setAttribute('aria-hidden','true');s.style.cssText='height:1px;margin:0;padding:0';
    body.parentNode.insertBefore(s,body.nextSibling);
    var io=new IntersectionObserver(function(es){
      for(var i=0;i<es.length;i++)if(es[i].isIntersecting){
        io.disconnect();
        send('read_complete',{content_type:m[1]==='posts'?'post':'drop',page_path:path});
        break;
      }
    });
    // wait 10s first: short drops show their end on load, which would count every bounce as a read
    setTimeout(function(){io.observe(s)},10000);
  }
})();
