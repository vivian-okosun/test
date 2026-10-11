const $ = (selector) => document.querySelector(selector);
const toast = $('#toast');
let toastTimer;
function notify(message) { toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 4200); }

$('.menu-toggle').addEventListener('click', (e) => { const nav = $('.nav'); nav.classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', nav.classList.contains('open')); });
document.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => $('.nav').classList.remove('open')));

document.querySelectorAll('.play').forEach(button => button.addEventListener('click', () => { $('#modal-title').textContent = button.dataset.title; $('#modal').classList.remove('hidden'); }));
$('.modal-close').addEventListener('click', () => $('#modal').classList.add('hidden'));
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') $('#modal').classList.add('hidden'); });

$('#prayer-form').addEventListener('submit', e => { e.preventDefault(); e.target.reset(); notify('Your prayer request has been received with care.'); });

const bookings = JSON.parse(localStorage.getItem('ministry-bookings') || '[]');
$('#booking-form').addEventListener('submit', e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  if (bookings.some(b => b.date === data.date && b.status === 'confirmed')) { notify('That date is already confirmed. Please choose another date.'); return; }
  bookings.push({ ...data, status: 'pending' });
  localStorage.setItem('ministry-bookings', JSON.stringify(bookings));
  e.target.reset();
  notify('Invitation received. The requested date is pending team review.');
});

$('#admin-toggle').addEventListener('click', () => { $('#dashboard').classList.remove('hidden'); $('#dashboard').scrollIntoView({ behavior: 'smooth' }); });
$('.close-dashboard').addEventListener('click', () => $('#dashboard').classList.add('hidden'));

function displayDate(value) { return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T12:00:00`)).toUpperCase(); }
$('#sermon-form').addEventListener('submit', e => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); const card = document.createElement('article'); card.className = 'sermon-card'; card.innerHTML = `<div class="thumbnail cover-three"><button class="play small-play" data-title="${d.title}" aria-label="Play sermon">▶</button></div><p>${displayDate(d.date)}</p><h3>${d.title}</h3><a href="#watch">Watch →</a>`; $('#sermon-list').prepend(card); card.querySelector('.play').addEventListener('click', () => { $('#modal-title').textContent = d.title; $('#modal').classList.remove('hidden'); }); e.target.reset(); notify('Sermon added to this browser preview.'); });
$('#event-form').addEventListener('submit', e => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); const date = new Date(`${d.date}T12:00:00`); const card = document.createElement('article'); card.className = 'event'; card.innerHTML = `<div class="date"><b>${String(date.getDate()).padStart(2,'0')}</b><span>${date.toLocaleString('en', {month:'short'}).toUpperCase()}</span></div><div><p class="event-type">UPCOMING GATHERING</p><h3>${d.title}</h3><p class="event-detail">Details to be announced</p></div><a href="#rsvp" class="event-arrow" aria-label="RSVP">→</a>`; $('#event-list').prepend(card); e.target.reset(); notify('Event added to this browser preview.'); });
