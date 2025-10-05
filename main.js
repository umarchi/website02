// ハンバーガーメニュー開閉
(function(){
  const btn  = document.querySelector('.nav-toggle');
  const menu = document.getElementById('primary-nav');
  if(!btn || !menu) return;

  btn.addEventListener('click', ()=>{
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    menu.classList.toggle('show', !open);
  });

  // Escキーで閉じる
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true'){
      btn.click();
    }
  });
})();

// 現在地ハイライト
(function(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navlinks a').forEach(a=>{
    const href = a.getAttribute('href');
    if (href === path || (path === 'index.html' && (href === './' || href === 'index.html'))) {
      a.classList.add('active');
      a.setAttribute('aria-current','page');
    }
  });
})();

// ===== Hero Slider (auto + arrows) =====
(function(){
  const slider = document.querySelector('.hero-slider');
  if(!slider) return;

  const imgs = Array.from(slider.querySelectorAll('.slides img'));
  const dotsWrap = slider.querySelector('.hero-dots');
  const prevBtn = slider.querySelector('.arrow.prev');
  const nextBtn = slider.querySelector('.arrow.next');

  // ドット生成
  imgs.forEach((_,i)=>{
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `${i+1}枚目`);
    b.addEventListener('click', ()=>go(i,true));
    dotsWrap.appendChild(b);
  });

  let i = 0, t = 0, raf;
  const DURATION = 2500;

  function render(){
    imgs.forEach((img,idx)=> img.classList.toggle('active', idx===i));
    dotsWrap.querySelectorAll('button').forEach((d,idx)=>{
      d.setAttribute('aria-current', String(idx===i));
    });
  }
  function next(){ i = (i+1)%imgs.length; render(); }
  function prev(){ i = (i-1+imgs.length)%imgs.length; render(); }
  function go(n,user=false){ i=n%imgs.length; render(); if(user) restart(); }

  function tick(ts){
    if(!t) t=ts;
    if(ts-t>=DURATION){ next(); t=ts; }
    raf=requestAnimationFrame(tick);
  }
  function restart(){
    cancelAnimationFrame(raf);
    t=0;
    raf=requestAnimationFrame(tick);
  }

  // 矢印操作
  prevBtn.addEventListener('click', ()=>{ prev(); restart(); });
  nextBtn.addEventListener('click', ()=>{ next(); restart(); });

  // 画面内のみ動作
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ restart(); }
      else{ cancelAnimationFrame(raf); }
    });
  },{threshold:0.2});
  io.observe(slider);

  render();
})();