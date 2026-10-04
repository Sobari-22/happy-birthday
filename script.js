// =========================================================
// Kartu ulang tahun — script sederhana
// Tidak ada yang wajib diubah di sini.
// Musik: ganti file di assets/birthday-song.mp3 (atau ubah src di index.html)
// =========================================================

const opening = document.getElementById('opening');
const openBtn = document.getElementById('openBtn');
const envelope = document.getElementById('envelope');
const card = document.getElementById('card');
const music = document.getElementById('bgm');
const musicBtn = document.getElementById('musicBtn');

// Atur volume musik (0.0 sampai 1.0) — pelan supaya nyaman
music.volume = 0.5;

// ---------- Tombol "Open Message" / klik amplop ----------
let opened = false;

function openMessage() {
  if (opened) return;
  opened = true;
  openBtn.disabled = true;

  // Musik baru dimulai setelah tombol/amplop ditekan (tidak autoplay)
  playMusic();

  // 1) Amplop terbuka: penutup terangkat, surat naik keluar
  opening.classList.add('is-opening');

  // Lama animasi amplop sebelum pindah ke kartu (ms)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const envelopeTime = reduceMotion ? 300 : 1700;

  // 2) Layar pembuka memudar
  setTimeout(() => {
    opening.classList.add('is-leaving');

    // 3) Tampilkan kartu setelah pembuka selesai memudar
    setTimeout(() => {
      opening.hidden = true;
      card.hidden = false;
      musicBtn.hidden = false;
      window.scrollTo(0, 0);
      card.classList.add('is-open');
    }, 600);
  }, envelopeTime);
}

openBtn.addEventListener('click', openMessage);
envelope.addEventListener('click', openMessage);

// ---------- Musik ----------
function setPlayingState(isPlaying) {
  musicBtn.classList.toggle('is-playing', isPlaying);
  musicBtn.setAttribute('aria-pressed', String(isPlaying));
  musicBtn.setAttribute('aria-label', isPlaying ? 'Jeda musik' : 'Putar musik');
}

function playMusic() {
  const attempt = music.play();
  if (attempt !== undefined) {
    attempt
      .then(() => setPlayingState(true))
      .catch(() => setPlayingState(false)); // file belum ada / diblokir browser
  }
}

musicBtn.addEventListener('click', () => {
  if (music.paused) {
    playMusic();
  } else {
    music.pause();
    setPlayingState(false);
  }
});

// ---------- Foto: kalau file belum ada, tampilkan kotak pengganti ----------
document.querySelectorAll('.photo img').forEach((img) => {
  const markMissing = () => img.closest('.photo').classList.add('is-missing');

  img.addEventListener('error', markMissing);

  // Jaga-jaga kalau error sudah terjadi sebelum script ini jalan
  if (img.complete && img.naturalWidth === 0) markMissing();
});