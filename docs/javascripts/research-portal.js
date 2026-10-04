(() => {
  function init() {
    document.querySelectorAll('[data-copy-target]').forEach(button => {
      if (button.dataset.bound) return;
      button.dataset.bound = 'true';
      button.addEventListener('click', async () => {
        const field = document.getElementById(button.dataset.copyTarget);
        const text = field.value ?? field.textContent;
        const status = button.nextElementSibling;
        try { await navigator.clipboard.writeText(text); status.textContent = ' ' + (button.dataset.copyMessage || 'Copied. Paste into ChatGPT.'); }
        catch { field.focus(); field.select?.(); status.textContent = ' Select and copy the text above.'; }
      });
    });
    document.querySelectorAll('.interactive-preview').forEach(details => {
      if (details.dataset.bound) return;
      details.dataset.bound = 'true';
      details.addEventListener('toggle', () => {
        const frame = details.querySelector('iframe');
        if (details.open) frame.src = frame.dataset.src;
        else frame.removeAttribute('src');
      });
    });
    const host = document.getElementById('project-filters');
    const list = document.getElementById('project-catalog');
    if (!host || !list || host.children.length) return;
    const cards = [...list.querySelectorAll('.project-card')];
    const params = new URLSearchParams(location.search);
    const inputs = {};
    const search = document.createElement('input');
    search.type = 'search'; search.id = 'project-search'; search.value = params.get('q') || '';
    search.placeholder = 'Search questions, places and themes';
    const label = document.createElement('label'); label.htmlFor = search.id; label.textContent = 'Search projects';
    host.append(label, search); inputs.q = search;
    for (const [key, field, text] of [['region','region','Region'],['topic','topics','Theme'],['output','outputs','Output']]) {
      const select = document.createElement('select'); select.id = 'project-'+key;
      select.add(new Option('All '+text.toLowerCase()+'s', ''));
      [...new Set(cards.flatMap(c => (c.dataset[field] || '').split('|')))].filter(Boolean).sort().forEach(v => select.add(new Option(v,v)));
      select.value = params.get(key) || '';
      const l = document.createElement('label'); l.htmlFor = select.id; l.textContent = text;
      host.append(l,select); inputs[key]=select;
    }
    const sort = document.createElement('select'); sort.id='project-sort';
    sort.add(new Option('Latest update','updated')); sort.add(new Option('Title','title')); sort.value=params.get('sort') || 'updated';
    const sl=document.createElement('label'); sl.htmlFor=sort.id; sl.textContent='Sort';host.append(sl,sort);inputs.sort=sort;
    const reset = document.createElement('button'); reset.type='button'; reset.textContent='Clear filters';host.append(reset);
    function apply() {
      const q=search.value.trim().toLowerCase();
      for(const card of cards) card.hidden = !card.textContent.toLowerCase().includes(q) || ['region','topic','output'].some(k => {
        const field={region:'region',topic:'topics',output:'outputs'}[k];return inputs[k].value && !card.dataset[field].split('|').includes(inputs[k].value);
      });
      cards.sort((a,b) => sort.value==='title' ? a.dataset.title.localeCompare(b.dataset.title) : b.dataset.updated.localeCompare(a.dataset.updated)).forEach(c=>list.append(c));
      document.getElementById('project-filter-status').textContent = cards.filter(c=>!c.hidden).length+' of '+cards.length+' projects';
      const url=new URL(location.href);
      Object.entries(inputs).forEach(([k,v])=> v.value && !(k==='sort'&&v.value==='updated') ? url.searchParams.set(k,v.value) : url.searchParams.delete(k));
      history.replaceState(null,'',url);
    }
    Object.values(inputs).forEach(i=>i.addEventListener('input',apply));
    reset.addEventListener('click',()=>{Object.values(inputs).forEach(i=>i.value='');sort.value='updated';apply();});apply();
  }
  document.addEventListener('DOMContentLoaded',init);
  if(typeof document$!=='undefined') document$.subscribe(init);
  init();
})();
