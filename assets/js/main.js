/* Kimrey Consulting — main.js */

// Mobile nav
(function(){
  var t=document.getElementById('navToggle'),m=document.getElementById('navLinks');
  if(!t||!m)return;
  t.addEventListener('click',function(){var o=m.classList.toggle('open');t.setAttribute('aria-expanded',o?'true':'false');document.body.style.overflow=o?'hidden':'';});
  document.addEventListener('click',function(e){if(!t.contains(e.target)&&!m.contains(e.target)){m.classList.remove('open');t.setAttribute('aria-expanded','false');document.body.style.overflow='';}});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&m.classList.contains('open')){m.classList.remove('open');t.setAttribute('aria-expanded','false');t.focus();document.body.style.overflow='';}});
})();

// Smooth scroll (hash links only)
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var id=a.getAttribute('href').slice(1);if(!id)return;
      var tgt=document.getElementById(id);if(!tgt)return;
      e.preventDefault();
      var nh=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nh'))||70;
      window.scrollTo({top:tgt.getBoundingClientRect().top+window.scrollY-nh-8,behavior:'smooth'});
      var m=document.getElementById('navLinks');
      if(m&&m.classList.contains('open')){m.classList.remove('open');document.getElementById('navToggle').setAttribute('aria-expanded','false');document.body.style.overflow='';}
    });
  });
})();

// Scroll spy
(function(){
  var ids=['home','about','services','industries','process','resources','latest-insights','faq','contact'];
  var links=document.querySelectorAll('.nl a[href^="#"]');
  if(!links.length)return;
  function onScroll(){
    var nh=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nh'))||70;
    var sy=window.scrollY+nh+40,cur='home';
    ids.forEach(function(id){var el=document.getElementById(id);if(el&&el.offsetTop<=sy)cur=id;});
    links.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+cur);});
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
})();

// FAQ accordion
(function(){
  document.querySelectorAll('.ab2').forEach(function(btn){
    btn.addEventListener('click',function(){
      var exp=btn.getAttribute('aria-expanded')==='true';
      var panel=document.getElementById(btn.getAttribute('aria-controls'));
      var sec=btn.closest('section')||document;
      sec.querySelectorAll('.ab2').forEach(function(s){
        if(s!==btn){s.setAttribute('aria-expanded','false');var sp=document.getElementById(s.getAttribute('aria-controls'));if(sp){sp.setAttribute('aria-hidden','true');sp.style.display='none';}}
      });
      btn.setAttribute('aria-expanded',exp?'false':'true');
      if(panel){panel.setAttribute('aria-hidden',exp?'true':'false');panel.style.display=exp?'none':'block';}
    });
  });
})();

// Contact form
window.handleContactSubmit=function(e){
  e.preventDefault();
  var form=document.getElementById('contactForm'),btn=document.getElementById('submitBtn'),err=document.getElementById('formError');
  btn.disabled=true;btn.textContent='Sending…';if(err)err.style.display='none';
  fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(form)).toString()})
  .then(function(r){if(r.ok){document.getElementById('formWrap').style.display='none';document.getElementById('formSuccess').style.display='block';}else throw new Error();})
  .catch(function(){if(err)err.style.display='block';btn.disabled=false;btn.textContent='Send Message →';});
};

// Lead form
window.handleLeadSubmit=function(e){
  e.preventDefault();var form=e.target,btn=form.querySelector('button[type=submit]'),prev=btn?btn.textContent:'';
  if(btn){btn.disabled=true;btn.textContent='Sending…';}
  fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(form)).toString()})
  .then(function(r){if(r.ok){form.innerHTML='<p style="color:#6BAEE8;font-weight:600;text-align:center;">✓ You’re on the list!</p>';}else throw new Error();})
  .catch(function(){if(btn){btn.disabled=false;btn.textContent=prev;}});
};

// Posts loader
function renderCard(p){
  var cat=(p.category||'').toLowerCase().replace(/\s+/g,'-');
  return '<div class="ic" data-category="'+cat+'">'
    +'<span class="ic-cat">'+p.category+'</span>'
    +'<h3 class="ic-title"><a href="/blog/'+p.slug+'.html">'+p.title+'</a></h3>'
    +'<p class="ic-ex">'+p.excerpt+'</p>'
    +'<div class="ic-meta"><span>'+p.date+'</span><span>•</span><span>'+p.readTime+'</span></div>'
    +'<a href="/blog/'+p.slug+'.html" class="btn btn-b btn-sm" style="margin-top:.875rem;align-self:flex-start;">Read Article →</a>'
    +'</div>';
}
function loadPosts(){
  fetch('/posts.json').then(function(r){return r.json();}).then(function(posts){
    var lg=document.getElementById('latestInsightsGrid');
    if(lg){lg.innerHTML=posts.slice(0,3).map(renderCard).join('')||'<p class="loading-text">No articles yet.</p>';}
    var ig=document.getElementById('insightsGrid'),ce=document.getElementById('articleCount');
    if(ig){ig.innerHTML=posts.map(renderCard).join('')||'<p class="loading-text">No articles yet.</p>';if(ce)ce.textContent=posts.length+(posts.length===1?' article':' articles');}
  }).catch(function(){
    ['latestInsightsGrid','insightsGrid'].forEach(function(id){var el=document.getElementById(id);if(el)el.innerHTML='<p class="loading-text">Unable to load articles.</p>';});
  });
}
window.filterInsights=function(btn,cat){
  document.querySelectorAll('.filter-btn').forEach(function(b){b.classList.remove('active');});
  btn.classList.add('active');
  var cards=document.querySelectorAll('#insightsGrid .ic'),v=0;
  cards.forEach(function(c){var show=cat==='all'||c.dataset.category===cat;c.style.display=show?'flex':'none';if(show)v++;});
  var ce=document.getElementById('articleCount');if(ce)ce.textContent=v+(v===1?' article':' articles');
};
loadPosts();
