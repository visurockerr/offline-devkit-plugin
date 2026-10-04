const search = document.getElementById('search');
const cards = Array.from(document.querySelectorAll('.tool-card'));
search.addEventListener('input', () => {
  const q = search.value.trim().toLowerCase();
  cards.forEach(card => {
    const hay = (card.dataset.name + ' ' + card.textContent).toLowerCase();
    card.style.display = hay.includes(q) ? '' : 'none';
  });
});
