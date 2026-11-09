/* Progressive catalog discovery only. No cart, tracking, network or shared globals. */
(() => {
  const root = document.querySelector('#venn-store');
  if (!root || root.dataset.vsBound === 'true') return;
  root.dataset.vsBound = 'true';
  const rail = root.querySelector('#vs-finish-list');
  const filters = root.querySelector('[data-vs-filters]');
  const controls = root.querySelector('[data-vs-rail-controls]');
  const note = root.querySelector('[data-vs-collection-note]');
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const notes = {
    edit: '',
    standard: 'Everyday upholstery, from soft faux velvets to textured weaves. A few favourites here; more in the builder.',
    solar: 'Earth, Moon, Sol, Jupiter and Mars. Start with Earth or Moon, then explore all five in the builder.',
    wool: 'Six solid Pendleton wool colours. Meet Marine; explore the collection in the builder.',
    jacquard: 'Pendleton patterns woven into the fabric. Meet Buffalo; see both available patterns in the builder.',
    sports: 'Seven printed sporting favourites. Start with Basketball; explore them all in the builder.'
  };
  function boundaries() {
    const max = rail.scrollWidth - rail.clientWidth;
    root.querySelector('[data-vs-step="-1"]').disabled = rail.scrollLeft < 3;
    root.querySelector('[data-vs-step="1"]').disabled = rail.scrollLeft >= max - 3;
    controls.hidden = max < 4;
    const progress = controls.querySelector('[data-vs-rail-progress]');
    const visible = [...rail.children].filter(item => !item.hidden);
    const first = visible.findIndex(item => item.getBoundingClientRect().right > rail.getBoundingClientRect().left + 8);
    if (progress) progress.textContent = `${Math.max(1, first + 1)} / ${visible.length}`;
    const hint = root.querySelector('.vs-swipe-hint');
    if (hint) hint.textContent = max > 4 ? 'Swipe or use the arrows to explore the finishes.' : 'Finish previews. Find every available finish in the builder.';
  }
  const story = root.querySelector('[data-vs-collection-story]');
  const titles = {standard:'Texture. Colour. Character.',solar:'Make space for a planet.',wool:'Wool, in the round.',jacquard:'Pattern, woven in.',sports:'Something to play for.'};
  const labels = {standard:'Standard Fabric',solar:'The Solar Series',wool:'Pendleton Wool',jacquard:'Pendleton Jacquard',sports:'The Sports Series'};
  filters.hidden = false;
  filters.addEventListener('click', event => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    const filter = button.dataset.filter;
    filters.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    rail.querySelectorAll('li').forEach(item => { item.hidden = filter === 'edit' ? !item.hasAttribute('data-edit') : item.dataset.collection !== filter; });
    rail.scrollLeft = 0;
    const visible = [...rail.children].filter(item => !item.hidden);
    rail.dataset.count = String(visible.length);
    root.querySelector('[data-vs-collection-layout]').dataset.filter = filter;
    story.hidden = filter === 'edit';
    if (filter !== 'edit') {
      story.querySelector('[data-vs-collection-label]').textContent = labels[filter];
      story.querySelector('[data-vs-collection-title]').textContent = titles[filter];
      story.querySelector('[data-vs-collection-description]').textContent = notes[filter];
      story.querySelector('[data-vs-collection-link]').href = visible[0].querySelector('a').href;
    }
    note.textContent = filter === 'edit' ? notes.edit : 'A curated introduction. Find every available finish in the builder.';
    requestAnimationFrame(boundaries);
  });
  const step = direction => {
    const item = [...rail.children].find(item => !item.hidden);
    rail.scrollBy({left: direction * (item.getBoundingClientRect().width + parseFloat(getComputedStyle(rail).gap)), behavior: reduced() ? 'instant' : 'smooth'});
  };
  controls.addEventListener('click', event => { const button = event.target.closest('[data-vs-step]'); if (button) step(Number(button.dataset.vsStep)); });
  rail.addEventListener('keydown', event => {
    if (event.target !== rail) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1); }
    if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); rail.scrollTo({left:event.key === 'Home' ? 0 : rail.scrollWidth,behavior:reduced()?'instant':'smooth'}); }
  });
  rail.addEventListener('scroll', boundaries, {passive:true});
  new ResizeObserver(boundaries).observe(rail);
  boundaries();
  // Package discovery only: exact native product links and compositions remain in the HTML.
  const packages = root.querySelector('[data-vs-package-choices]');
  packages.hidden = false;
  packages.addEventListener('click', event => {
    const button = event.target.closest('[data-vs-package]');
    if (!button) return;
    packages.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    root.querySelectorAll('[data-vs-package-panel]').forEach(panel => { panel.hidden = panel.dataset.vsPackagePanel !== button.dataset.vsPackage; });
  });
})();
