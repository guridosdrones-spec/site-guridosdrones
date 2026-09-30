(() => {
  'use strict';
  const catalog = window.IDIOMAS || {};
  const select = document.getElementById('idioma');
  if (!select) return;
  const normalize = text => text.replace(/\s+/g, ' ').trim();
  const originals = [];
  const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    if (node.parentElement.closest('script,style,code,.idioma,.marca')) continue;
    const key = normalize(node.nodeValue);
    if (Object.hasOwn(catalog, key)) originals.push({node, original: node.nodeValue, key});
  }
  const attributes = [];
  document.querySelectorAll('[aria-label],[title],[alt],meta[name="description"]').forEach(el => {
    ['aria-label', 'title', 'alt', 'content'].forEach(name => {
      const original = el.getAttribute(name);
      if (original && Object.hasOwn(catalog, normalize(original))) {
        attributes.push({el, name, original, key: normalize(original)});
      }
    });
  });
  const labels = {pt: 'Escolher idioma', en: 'Choose language', es: 'Elegir idioma'};
  function apply(language) {
    const lang = Object.hasOwn(labels, language) ? language : 'pt';
    const index = lang === 'en' ? 0 : 1;
    originals.forEach(({node, original, key}) => {
      node.nodeValue = lang === 'pt' ? original : original.replace(/\S[\s\S]*\S|\S/, catalog[key][index]);
    });
    attributes.forEach(({el, name, original, key}) => {
      el.setAttribute(name, lang === 'pt' ? original : catalog[key][index]);
    });
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
    select.value = lang;
    select.setAttribute('aria-label', labels[lang]);
    select.title = labels[lang];
    try { localStorage.setItem('guri-idioma', lang); } catch (_) { /* Storage can be unavailable. */ }
  }
  let saved = 'pt';
  try { saved = localStorage.getItem('guri-idioma') || 'pt'; } catch (_) { /* Portuguese fallback. */ }
  apply(saved);
  select.addEventListener('change', () => apply(select.value));
})();
