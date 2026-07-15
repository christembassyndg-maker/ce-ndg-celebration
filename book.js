
const tributes = window.TRIBUTES || [];
const wife = tributes.find(t => t.category === 'royal');
const wifeFeature = document.getElementById('wifeFeature');
const grid = document.getElementById('tributeGrid');
const originals = document.getElementById('originalGrid');

function wifeCard(t){
  wifeFeature.innerHTML = `
    <article class="royal-card">
      <img src="${t.image}" alt="${t.name}">
      <div class="royal-copy">
        <p class="eyebrow">${t.role}</p>
        <h2>${t.name}</h2>
        <p>${t.message}</p>
        <p class="signature">“Long life, my love.”</p>
      </div>
    </article>`;
}

function card(t){
  return `
    <article class="tribute-card" data-category="${t.category}">
      <img src="${t.image}" alt="${t.name}">
      <div class="tribute-content">
        <p class="role">${t.role}</p>
        <h3>${t.name}</h3>
        <p>${t.message.length > 210 ? t.message.slice(0,210) + '…' : t.message}</p>
        <button class="read-more" data-name="${encodeURIComponent(t.name)}">Read Full Tribute →</button>
      </div>
    </article>`;
}

function render(filter='all'){
  const visible = tributes.filter(t => t.category !== 'royal' && (filter === 'all' || t.category === filter));
  grid.innerHTML = visible.map(card).join('');
  document.querySelectorAll('.read-more').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = decodeURIComponent(btn.dataset.name);
      openModal(tributes.find(t => t.name === name));
    });
  });
}

function renderOriginals(){
  originals.innerHTML = tributes.map(t => `<img src="${t.image}" alt="${t.name}" data-name="${encodeURIComponent(t.name)}">`).join('');
  originals.querySelectorAll('img').forEach(img => img.addEventListener('click', () => {
    const t = tributes.find(x => x.name === decodeURIComponent(img.dataset.name));
    openModal(t);
  }));
}

const modal = document.getElementById('modal');
function openModal(t){
  document.getElementById('modalImage').src = t.image;
  document.getElementById('modalName').textContent = t.name;
  document.getElementById('modalRole').textContent = t.role;
  document.getElementById('modalMessage').textContent = t.message;
  modal.classList.add('show');
  modal.setAttribute('aria-hidden','false');
}
document.getElementById('closeModal').onclick = () => {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden','true');
};
modal.addEventListener('click', e => { if(e.target === modal) document.getElementById('closeModal').click(); });

const openBookLink = document.getElementById('openBook');
openBookLink.addEventListener('click', () => {
  document.getElementById('book').classList.add('opening');
  document.querySelectorAll('.hidden').forEach(el => el.classList.add('visible'));
  // Do not prevent the link's normal href="#wife" navigation.
});

document.querySelectorAll('.filter').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  render(btn.dataset.filter);
}));

wifeCard(wife);
render();
renderOriginals();

const observer = new IntersectionObserver(entries => entries.forEach(e => {
  if(e.isIntersecting) e.target.classList.add('visible');
}), {threshold:.1});
document.querySelectorAll('.hidden').forEach(el => observer.observe(el));
