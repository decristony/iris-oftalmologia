(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Nav: transparente sobre a foto, sólida depois */
  const nav = document.getElementById('nav');
  const hero = document.querySelector('.hero');
  const tecPhoto = document.querySelector('.tec-photo');

  const onScroll = () => {
    const y = scrollY, h = hero.offsetHeight;
    nav.classList.toggle('scrolled', y > h - 90);
    if (!reduce) {
      hero.style.setProperty('--hp', Math.min(1, y / h).toFixed(3));
      const r = tecPhoto.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight + r.height)));
      tecPhoto.style.setProperty('--tp', p.toFixed(3));
    }
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll); onScroll();

  /* Simulador de miopia */
  const range = document.getElementById('blur');
  const chart = document.getElementById('chart');
  const grau = document.getElementById('grau');
  const upd = () => {
    const v = +range.value;
    chart.style.setProperty('--b', `${(v / 10) * 2.6}px`);
    range.style.setProperty('--v', `${(v / 30) * 100}%`);
    grau.textContent = v === 0 ? '0,0' : '-' + (v / 10).toFixed(1).replace('.', ',');
  };
  range.addEventListener('input', upd); upd();

  /* Lente: a foto desfoca e só o círculo do cursor fica nítido */
  if (fine && !reduce) document.querySelectorAll('.esp').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* Revelação com stagger */
  document.querySelectorAll('.esp, .med, .tec-list li, .sim-copy, .chart-card, .med-head, .esp-head, .cons-body > *').forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const sibs = [...e.target.parentElement.children];
    e.target.style.transitionDelay = `${Math.min(sibs.indexOf(e.target), 6) * 80}ms`;
    e.target.classList.add('in'); io.unobserve(e.target);
  }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* Formulário: apenas demonstração local, nada é enviado */
  const form = document.getElementById('form'), msg = document.getElementById('msg');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.nome.value.trim() || !form.tel.value.trim()) { msg.textContent = 'Informe nome e telefone, por favor.'; return; }
    msg.textContent = `Obrigado, ${form.nome.value.trim().split(' ')[0]}! Este site é demonstrativo: nada foi enviado.`;
    form.reset();
  });
})();
