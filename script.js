/* ================================================
   LIFE DASHBOARD — script.js
   Vanilla JavaScript, No Frameworks
   ================================================ */

'use strict';

/* ------------------------------------------------
   MODUL 1: GREETING & DATE/TIME REAL-TIME
   - Sapaan berubah sesuai waktu (pagi/siang/malam)
   - Nama custom disimpan di localStorage
   - Jam dan tanggal diupdate setiap detik
------------------------------------------------ */

// Ambil elemen DOM yang dibutuhkan
const greetingMessage = document.getElementById('greeting-message');
const datetimeDisplay = document.getElementById('datetime-display');
const userNameInput   = document.getElementById('user-name-input');
const saveNameBtn     = document.getElementById('save-name-btn');
const editNameBtn     = document.getElementById('edit-name-btn');
const nameInputArea   = document.getElementById('name-input-area');

// Nama hari dan bulan dalam bahasa Inggris
const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

/**
 * Mengembalikan sapaan berdasarkan jam saat ini
 * Pagi: 05-11, Siang: 12-17, Malam: 18-04
 */
function getGreetingWord() {
  const hour = new Date().getHours();
  if (hour >= 5  && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 18) return 'Good Afternoon';
  return 'Good Evening';
}

/**
 * Update tampilan greeting dengan nama yang tersimpan
 */
function updateGreeting() {
  // Ambil nama dari localStorage, default 'Engineer'
  const name = localStorage.getItem('userName') || 'Engineer';
  const word = getGreetingWord();
  // Nama ditampilkan dengan warna cyan via <span>
  greetingMessage.innerHTML = `${word}, <span>${name}</span>! 👋`;
}

/**
 * Update jam dan tanggal — dipanggil setiap detik
 */
function updateDateTime() {
  const now  = new Date();
  const day  = DAYS[now.getDay()];
  const date = now.getDate();
  const mon  = MONTHS[now.getMonth()];
  const year = now.getFullYear();

  // Format jam: HH:MM:SS
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');

  datetimeDisplay.textContent = `${day}, ${date} ${mon} ${year}  —  ${hh}:${mm}:${ss}`;
}


// Tombol pensil — toggle munculnya form input nama
editNameBtn.addEventListener('click', () => {
  const isHidden = nameInputArea.hasAttribute('hidden');
  if (isHidden) {
    nameInputArea.removeAttribute('hidden');
    editNameBtn.classList.add('active');
    editNameBtn.title = 'Close';
    userNameInput.focus();
  } else {
    nameInputArea.setAttribute('hidden', '');
    editNameBtn.classList.remove('active');
    editNameBtn.title = 'Edit name';
    userNameInput.value = '';
  }
});

// Simpan nama saat tombol Save ditekan
saveNameBtn.addEventListener('click', () => {
  const name = userNameInput.value.trim();
  if (name) {
    localStorage.setItem('userName', name);
    updateGreeting();
    userNameInput.value = '';
    // Tutup form setelah simpan
    nameInputArea.setAttribute('hidden', '');
    editNameBtn.classList.remove('active');
    editNameBtn.title = 'Edit name';
    // Feedback singkat pada tombol pensil
    editNameBtn.textContent = '✓';
    setTimeout(() => { editNameBtn.textContent = '✎'; }, 1500);
  } else {
    userNameInput.style.borderColor = 'var(--accent-orange)';
    setTimeout(() => { userNameInput.style.borderColor = ''; }, 1500);
  }
});

// Simpan nama juga saat user tekan Enter di input
userNameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') saveNameBtn.click();
});

// Panggil sekali langsung, lalu update setiap detik
updateGreeting();
updateDateTime();
setInterval(updateDateTime, 1000);
// Greeting cukup update setiap menit (untuk deteksi ganti pagi/siang/malam)
setInterval(updateGreeting, 60000);


/* ------------------------------------------------
   MODUL 2: RANDOM MOTIVATIONAL QUOTES
   - Tampilkan quote acak setiap kali halaman dibuka
   - Quote berbeda dari sebelumnya (tidak mengulang)
------------------------------------------------ */

const motivationalQuote = document.getElementById('motivational-quote');

const QUOTES = [
  { text: "You don’t have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "It is okay to be at a place of struggle. Struggle is just another word for growth.", author: "Idowu Koyenikan" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Sometimes the bravest and most important thing you can do is just show up.", author: "Brené Brown" },
  { text: "Hard times are not the enemy of a good life. They are part of it.", author: "Anonymous" },
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "The best time to plant a tree was twenty years ago. The second best time is now.", author: "Chinese proverb" },
  { text: "You don’t have to see the whole staircase, just take the first step.", author: "Martin Luther King Jr." },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "If you have a dream, don’t just sit there. Gather courage to believe that you can succeed and leave no stone unturned to make it a reality.", author: "Dr. Roopleen" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Keep going. Your hardest times often lead to the greatest moments of your life.", author: "Roy T. Bennett" },
  { text: "We must accept finite disappointment, but never lose infinite hope.", author: "Martin Luther King Jr." },
  { text: "You may encounter many defeats, but you must not be defeated.", author: "Maya Angelou" },
];

/**
 * Tampilkan quote acak — berbeda dari yang sebelumnya
 * Menggunakan efek typewriter: teks diketik huruf per huruf
 */
function showRandomQuote() {
  const lastIndex = parseInt(localStorage.getItem('lastQuoteIndex') ?? '-1');
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * QUOTES.length);
  } while (newIndex === lastIndex && QUOTES.length > 1);

  localStorage.setItem('lastQuoteIndex', newIndex);
  const q      = QUOTES[newIndex];
  const fullText = `"${q.text}" — ${q.author}`;

  // Kosongkan dulu, lalu ketik huruf per huruf
  motivationalQuote.textContent = '';
  motivationalQuote.classList.add('typewriter-active'); // kursor berkedip aktif

  let charIndex = 0;
  const speed   = 28; // ms per huruf — semakin kecil semakin cepat

  function typeNextChar() {
    if (charIndex < fullText.length) {
      motivationalQuote.textContent += fullText[charIndex];
      charIndex++;
      setTimeout(typeNextChar, speed);
    } else {
      // Selesai mengetik — hapus kursor berkedip setelah 2 detik
      setTimeout(() => {
        motivationalQuote.classList.remove('typewriter-active');
      }, 2000);
    }
  }

  // Mulai animasi setelah jeda singkat (beri kesan "berpikir")
  setTimeout(typeNextChar, 300);
}

// Jalankan saat halaman pertama kali dibuka
showRandomQuote();


/* ------------------------------------------------
   MODUL 3: FOCUS TIMER (POMODORO)
   - Countdown timer dengan durasi kustom
   - Tombol Start / Pause / Reset
   - Streak: naik 1 setiap timer selesai (tanpa reset)
   - Alarm berbunyi saat timer habis (Web Audio API)
   - Timer berwarna merah dan berdenyut saat < 10 detik
   - Data streak disimpan di localStorage
------------------------------------------------ */

const timerMinutesEl   = document.getElementById('timer-minutes');
const timerSecondsEl   = document.getElementById('timer-seconds');
const timerDisplayEl   = document.getElementById('timer-display');
const timerSectionEl   = document.getElementById('timer-section'); // tambahan untuk glow section
const timerStartBtn    = document.getElementById('timer-start-btn');
const timerPauseBtn    = document.getElementById('timer-pause-btn');
const timerResetBtn    = document.getElementById('timer-reset-btn');
const customMinutesEl  = document.getElementById('custom-minutes');
const applyDurationBtn = document.getElementById('apply-duration-btn');
const streakCountEl    = document.getElementById('streak-count');

// State timer
let timerDuration  = 25 * 60;  // dalam detik (default 25 menit)
let timeRemaining  = timerDuration;
let timerInterval  = null;
let timerIsRunning = false;
let timerCompleted = false; // flag: apakah selesai tanpa di-reset?

// Muat streak dari localStorage
let streakCount = parseInt(localStorage.getItem('streakCount') || '0');
streakCountEl.textContent = streakCount;

// Aktifkan pulse idle jika streak sudah > 0
const streakDisplayEl = document.getElementById('streak-display');
if (streakCount > 0) {
  streakCountEl.classList.add('has-value');
  streakDisplayEl.classList.add('has-streak');
}
function updateStreakTier(count) {
  const streakDisplayEl = document.getElementById('streak-display');
  streakDisplayEl.classList.remove('tier-10', 'tier-50', 'tier-100', 'tier-300', 'tier-500');
  if (count >= 201) {
    streakDisplayEl.classList.add('tier-500');
  } else if (count >= 51) {
    streakDisplayEl.classList.add('tier-300');
  } else if (count >= 11) {
    streakDisplayEl.classList.add('tier-100');
  } else if (count >= 4) {
    streakDisplayEl.classList.add('tier-50');
  } else if (count >= 1) {
    streakDisplayEl.classList.add('tier-10');
  }
}
updateStreakTier(streakCount);

/**
 * Perbarui tampilan angka timer di layar
 */
function renderTimer() {
  const mins = Math.floor(timeRemaining / 60);
  const secs = timeRemaining % 60;
  timerMinutesEl.textContent = String(mins).padStart(2, '0');
  timerSecondsEl.textContent = String(secs).padStart(2, '0');

  // Efek bahaya saat < 10 detik
  if (timeRemaining <= 10 && timerIsRunning) {
    timerDisplayEl.classList.add('danger');
  } else {
    timerDisplayEl.classList.remove('danger');
  }
}

/**
 * Mainkan suara alarm menggunakan Web Audio API
 * Tidak butuh file audio eksternal!
 */
function playAlarm() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    // Buat 3 nada alarm berturut-turut
    const notes = [880, 1100, 880, 1320, 880];
    notes.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type      = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.4, ctx.currentTime + i * 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.25 + 0.2);

      osc.start(ctx.currentTime + i * 0.25);
      osc.stop(ctx.currentTime  + i * 0.25 + 0.3);
    });
  } catch (e) {
    // Jika browser tidak support Web Audio API, tidak perlu error fatal
    console.warn('Web Audio API tidak tersedia:', e);
  }
}

/**
 * Satu "tick" timer — dipanggil setiap 1 detik
 */
function timerTick() {
  if (timeRemaining <= 0) {
    // Timer selesai!
    clearInterval(timerInterval);
    timerInterval  = null;
    timerIsRunning = false;
    timerCompleted = true;
    renderTimer();

    // Hapus semua glow mode saat selesai
    timerDisplayEl.classList.remove('timer-running', 'timer-paused');
    timerSectionEl.classList.remove('timer-running', 'timer-paused');

    // Naikkan streak
    streakCount++;
    localStorage.setItem('streakCount', streakCount);
    streakCountEl.textContent = streakCount;
    updateStreakTier(streakCount)

    // Aktifkan class pulse idle (jika belum ada)
    streakCountEl.classList.add('has-value');
    streakDisplayEl.classList.add('has-streak');

    // Animasi pop pada streak
    streakCountEl.classList.remove('streak-pop');
    void streakCountEl.offsetWidth; // trigger reflow untuk restart animasi
    streakCountEl.classList.add('streak-pop');

    // Bunyi alarm
    playAlarm();

    // Catat sesi ke data analytics
    recordFocusSession();

    // Restore energi + update Coder Class saat sesi selesai
    restoreEnergy();
    updateCoderClass(streakCount);

    // Update tombol
    timerStartBtn.disabled = false;
    timerPauseBtn.disabled = true;
    timerStartBtn.textContent = '▶ Start Again';
    return;
  }
  timeRemaining--;
  renderTimer();
  // Kurangi energi setiap detik saat timer berjalan
  updateEnergyBar(energyLevel - getEnergyDrainPerSecond());
}

// Tombol START
timerStartBtn.addEventListener('click', () => {
  if (timerIsRunning) return;

  // Kalau sudah selesai, reset dulu sebelum mulai lagi
  if (timerCompleted) {
    timeRemaining  = timerDuration;
    timerCompleted = false;
  }

  timerIsRunning = true;
  timerInterval  = setInterval(timerTick, 1000);

  // Aktifkan glow mode RUNNING (cyan breathing)
  timerDisplayEl.classList.add('timer-running');
  timerDisplayEl.classList.remove('timer-paused');
  timerSectionEl.classList.add('timer-running');
  timerSectionEl.classList.remove('timer-paused');

  timerStartBtn.disabled = true;
  timerPauseBtn.disabled = false;
  timerStartBtn.textContent = '▶ Start';
});

// Tombol PAUSE
timerPauseBtn.addEventListener('click', () => {
  if (!timerIsRunning) return;
  clearInterval(timerInterval);
  timerInterval  = null;
  timerIsRunning = false;

  // Ganti ke glow mode PAUSED (orange/yellow warm)
  timerDisplayEl.classList.remove('timer-running');
  timerDisplayEl.classList.add('timer-paused');
  timerSectionEl.classList.remove('timer-running');
  timerSectionEl.classList.add('timer-paused');

  timerStartBtn.disabled = false;
  timerPauseBtn.disabled = true;
  timerStartBtn.textContent = '▶ Resume';
});

// Tombol RESET — streak TIDAK naik jika di-reset sebelum selesai
timerResetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval  = null;
  timerIsRunning = false;
  timerCompleted = false;
  timeRemaining  = timerDuration;
  renderTimer();

  // Kembali ke state default — hapus semua glow mode
  timerDisplayEl.classList.remove('timer-running', 'timer-paused', 'danger');
  timerSectionEl.classList.remove('timer-running', 'timer-paused');

  timerStartBtn.disabled = false;
  timerPauseBtn.disabled = true;
  timerStartBtn.textContent = '▶ Start';

  // Restore energi ke 100% saat reset
  restoreEnergy();
});

// Tombol APPLY DURATION (Challenge #2)
applyDurationBtn.addEventListener('click', () => {
  const mins = parseInt(customMinutesEl.value);
  if (isNaN(mins) || mins < 1 || mins > 180) {
    customMinutesEl.style.borderColor = 'var(--accent-orange)';
    setTimeout(() => { customMinutesEl.style.borderColor = ''; }, 1500);
    return;
  }
  // Stop timer dulu sebelum ganti durasi
  clearInterval(timerInterval);
  timerInterval  = null;
  timerIsRunning = false;
  timerCompleted = false;

  timerDuration  = mins * 60;
  timeRemaining  = timerDuration;
  renderTimer();

  timerStartBtn.disabled = false;
  timerPauseBtn.disabled = true;
  timerStartBtn.textContent = '▶ Start';
  timerDisplayEl.classList.remove('danger');

  applyDurationBtn.textContent = '✓ Applied!';
  setTimeout(() => { applyDurationBtn.textContent = 'Apply'; }, 1500);
});

// Render timer sekali saat halaman load
renderTimer();

/* ------------------------------------------------
   MODUL RPG: MINI RPG STATUS SYSTEM
   - Energy bar berkurang saat timer berjalan
   - Warna bar berubah sesuai level
   - Coder Class badge naik otomatis sesuai streak
------------------------------------------------ */

// ── Elemen DOM ──
const energyBarFill  = document.getElementById('energy-bar-fill');
const energyText     = document.getElementById('energy-text');
const energyBarTrack = document.getElementById('energy-bar-track');
const coderBadge     = document.getElementById('coder-class-badge');
const coderRankText  = document.getElementById('coder-rank-text');

// ── State energi (0–100) ──
let energyLevel = 100;

// ── Tabel rank berdasarkan total sesi ──
const RANKS = [
  { min: 0,  max: 3,  label: 'Wandering Mind',   class: ''         },
  { min: 4,  max: 10,  label: 'Novice',    class: ''         },
  { min: 11,  max: 50,  label: 'Warrior',    class: ''         },
  { min: 51,  max: 200,  label: 'Zen Master',    class: ''         },
  { min: 201, max: Infinity, label: 'Transcendent State', class: 'god-mode' },
];

/**
 * Update tampilan energy bar — lebar, warna, teks
 */
function updateEnergyBar(value) {
  // Clamp antara 0–100
  energyLevel = Math.max(0, Math.min(100, value));

  // Update lebar bar
  energyBarFill.style.width = energyLevel + '%';

  // Update teks persentase
  energyText.textContent = Math.round(energyLevel) + '%';

  // Update aria-valuenow untuk aksesibilitas
  energyBarTrack.setAttribute('aria-valuenow', Math.round(energyLevel));

  // Update warna berdasarkan level
  energyBarFill.classList.remove('energy-medium', 'energy-low');
  if (energyLevel <= 20) {
    energyBarFill.classList.add('energy-low');
    energyText.style.color = '#ff4444';
  } else if (energyLevel <= 50) {
    energyBarFill.classList.add('energy-medium');
    energyText.style.color = 'var(--accent-yellow)';
  } else {
    energyText.style.color = 'var(--accent-cyan)';
  }
}

/**
 * Restore energi ke 100% (saat timer selesai atau reset)
 */
function restoreEnergy() {
  updateEnergyBar(100);
}

/**
 * Hitung penurunan energi per detik berdasarkan durasi timer
 * Target: bar hampir habis (~10% sisa) di akhir sesi
 * Rumus: kita drain dari 100 ke ~10 dalam timerDuration detik
 * = 90 / timerDuration per detik
 */
function getEnergyDrainPerSecond() {
  return 90 / timerDuration;
}

/**
 * Cek jumlah sesi dan update Coder Class badge
 */
function updateCoderClass(totalSessions) {
  const prevRankLabel = coderRankText.textContent;

  // Cari rank yang sesuai
  const rank = RANKS.slice().reverse().find(r => totalSessions >= r.min) || RANKS[0];

  // Hanya trigger animasi jika rank berubah
  if (rank.label !== prevRankLabel) {
    // Hapus class lama, tambah class baru
    coderBadge.classList.remove('god-mode', 'rank-up');

    // Tunda sedikit untuk restart animasi
    void coderBadge.offsetWidth;

    coderRankText.textContent = rank.label;

    if (rank.class) coderBadge.classList.add(rank.class);
    coderBadge.classList.add('rank-up');

    // Hapus class rank-up setelah animasi selesai
    coderBadge.addEventListener('animationend', function handler() {
      coderBadge.classList.remove('rank-up');
      coderBadge.removeEventListener('animationend', handler);
    });
  }
}

// Inisialisasi saat halaman load
updateEnergyBar(100);
updateCoderClass(streakCount);


/* ------------------------------------------------
   MODUL 4: TO-DO LIST
   - Tambah task dengan prioritas (High/Medium/Low)
   - Centang task (toggle selesai)
   - Hapus task
   - Progress bar otomatis update
   - Sort: Default / Priority / Name A-Z / Status
   - Semua data disimpan di localStorage
------------------------------------------------ */

const newTaskInput  = document.getElementById('new-task-input');
const taskPriority  = document.getElementById('task-priority');
const addTaskBtn    = document.getElementById('add-task-btn');
const taskList      = document.getElementById('task-list');
const progressFill  = document.getElementById('progress-bar-fill');
const progressLabel = document.getElementById('progress-label');
const sortBtns      = document.querySelectorAll('.sort-btn');

// Array task — format: { id, text, priority, completed, createdAt }
let tasks       = JSON.parse(localStorage.getItem('tasks') || '[]');
let currentSort = localStorage.getItem('taskSort') || 'default';

/**
 * Simpan array tasks ke localStorage
 */
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Update progress bar dan label persentase
 */
function updateProgressBar() {
  const total     = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent   = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressFill.style.width    = `${percent}%`;
  progressLabel.textContent   = `${completed} / ${total} tasks completed  (${percent}%)`;
}

/**
 * Urutkan salinan tasks sesuai mode sort yang aktif
 * Tidak mengubah array asli — hanya untuk render
 */
function getSortedTasks() {
  const copy = [...tasks];
  const priorityOrder = { high: 0, medium: 1, low: 2 };

  switch (currentSort) {
    case 'priority':
      return copy.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    case 'name':
      return copy.sort((a, b) => a.text.localeCompare(b.text));
    case 'status':
      // Task belum selesai tampil dulu
      return copy.sort((a, b) => Number(a.completed) - Number(b.completed));
    default:
      // 'default': urutan tambah (terbaru di atas)
      return copy.sort((a, b) => b.createdAt - a.createdAt);
  }
}

/**
 * Render ulang seluruh daftar task ke DOM
 */
function renderTasks() {
  taskList.innerHTML = '';
  const sorted = getSortedTasks();

  if (sorted.length === 0) {
    taskList.innerHTML = '<li style="color:var(--text-muted);font-size:0.85rem;padding:0.75rem 0;">No tasks yet. Add one above! 🚀</li>';
    updateProgressBar();
    return;
  }

  sorted.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = `task-item entry-stagger${task.completed ? ' completed' : ''}`;
    li.dataset.id = task.id;

    // Stagger delay: setiap item muncul 60ms lebih lambat dari sebelumnya
    li.style.animationDelay = `${index * 0.06}s`;

    // Tentukan emoji dan warna badge prioritas
    const priorityEmoji = { high: '🔴', medium: '🟡', low: '🟢' };

    li.innerHTML = `
      <button class="task-checkbox${task.completed ? ' checked' : ''}"
              aria-label="${task.completed ? 'Mark incomplete' : 'Mark complete'}"
              data-action="toggle">
        ${task.completed ? '✓' : ''}
      </button>
      <span class="task-text">${escapeHtml(task.text)}</span>
      <span class="task-priority-badge priority-${task.priority}">
        ${priorityEmoji[task.priority]} ${task.priority}
      </span>
      <button class="task-delete-btn" aria-label="Delete task" data-action="delete">✕</button>
    `;
    taskList.appendChild(li);
  });

  updateProgressBar();
}

/**
 * Tambah task baru
 */
function addTask() {
  const text = newTaskInput.value.trim();
  if (!text) {
    // Goyangkan input jika kosong
    newTaskInput.style.borderColor = 'var(--accent-orange)';
    setTimeout(() => { newTaskInput.style.borderColor = ''; }, 1500);
    return;
  }

  const newTask = {
    id:        Date.now(),          // ID unik berdasarkan timestamp
    text:      text,
    priority:  taskPriority.value,
    completed: false,
    createdAt: Date.now(),
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  newTaskInput.value = '';
  newTaskInput.focus();
}

/**
 * Escape HTML untuk keamanan — mencegah XSS
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Event delegation — satu listener untuk semua aksi di task list
taskList.addEventListener('click', (e) => {
  const btn    = e.target.closest('button[data-action]');
  if (!btn) return;
  const li     = btn.closest('.task-item');
  const taskId = parseInt(li.dataset.id);
  const action = btn.dataset.action;

  if (action === 'toggle') {
    const task     = tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    }
  }

  if (action === 'delete') {
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks();
    renderTasks();
  }
});

// Tombol Add Task
addTaskBtn.addEventListener('click', addTask);
newTaskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

// Sort buttons (Challenge #3)
sortBtns.forEach(btn => {
  // Tandai tombol sort yang aktif
  if (btn.dataset.sort === currentSort) btn.classList.add('active');

  btn.addEventListener('click', () => {
    currentSort = btn.dataset.sort;
    localStorage.setItem('taskSort', currentSort);
    // Update tampilan active
    sortBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTasks();
  });
});

// Render tasks pertama kali saat halaman load
renderTasks();


/* ------------------------------------------------
   MODUL 5: QUICK LINKS
   - Tambah link dengan nama kustom
   - Tampilkan sebagai kartu dengan favicon
   - Hapus link (tombol ✕ muncul saat hover)
   - Data disimpan di localStorage
------------------------------------------------ */

const newLinkName = document.getElementById('new-link-name');
const newLinkUrl  = document.getElementById('new-link-url');
const addLinkBtn  = document.getElementById('add-link-btn');
const linksGrid   = document.getElementById('links-grid');

// Array links — format: { id, name, url }
let links = JSON.parse(localStorage.getItem('quickLinks') || '[]');

// Link default jika localStorage kosong
if (links.length === 0) {
  links = [
    { id: 1, name: 'Google',   url: 'https://google.com'   },
    { id: 2, name: 'GitHub',   url: 'https://github.com'   },
    { id: 3, name: 'YouTube',  url: 'https://youtube.com'  },
    { id: 4, name: 'RevoU',    url: 'https://revou.co'     },
  ];
  localStorage.setItem('quickLinks', JSON.stringify(links));
}

/**
 * Ambil domain dari URL untuk ditampilkan di kartu
 */
function getDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

/**
 * Ambil URL favicon Google untuk domain tertentu
 */
function getFaviconUrl(url) {
  try {
    const domain = new URL(url).origin;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return '';
  }
}

/**
 * Render ulang semua kartu link ke DOM
 */
function renderLinks() {
  linksGrid.innerHTML = '';

  links.forEach(link => {
    const card = document.createElement('div');
    card.className  = 'link-card';
    card.dataset.id = link.id;

    const faviconUrl = getFaviconUrl(link.url);

    card.innerHTML = `
      <button class="link-delete-btn" aria-label="Delete link" data-action="delete-link">✕</button>
      <img class="link-icon" src="${faviconUrl}"
           alt="${escapeHtml(link.name)} icon"
           onerror="this.style.display='none'"
           width="24" height="24" />
      <span class="link-name">${escapeHtml(link.name)}</span>
      <span class="link-domain">${getDomain(link.url)}</span>
    `;

    // Klik kartu (selain tombol hapus) buka link di tab baru
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-action="delete-link"]')) return;
      window.open(link.url, '_blank', 'noopener,noreferrer');
    });

    linksGrid.appendChild(card);
  });
}

/**
 * Tambah link baru
 */
function addLink() {
  const name = newLinkName.value.trim();
  let   url  = newLinkUrl.value.trim();

  if (!name || !url) {
    if (!name) newLinkName.style.borderColor = 'var(--accent-orange)';
    if (!url)  newLinkUrl.style.borderColor  = 'var(--accent-orange)';
    setTimeout(() => {
      newLinkName.style.borderColor = '';
      newLinkUrl.style.borderColor  = '';
    }, 1500);
    return;
  }

  // Tambahkan https:// jika belum ada
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  links.push({ id: Date.now(), name, url });
  localStorage.setItem('quickLinks', JSON.stringify(links));
  renderLinks();

  newLinkName.value = '';
  newLinkUrl.value  = '';
}

// Event delegation untuk tombol hapus link
linksGrid.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action="delete-link"]');
  if (!btn) return;
  const card   = btn.closest('.link-card');
  const linkId = parseInt(card.dataset.id);
  links = links.filter(l => l.id !== linkId);
  localStorage.setItem('quickLinks', JSON.stringify(links));
  renderLinks();
});

addLinkBtn.addEventListener('click', addLink);
newLinkUrl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addLink();
});

// Render links saat halaman load
renderLinks();


/* ------------------------------------------------
   MODUL 6: PRODUCTIVITY ANALYTICS GRAPH
   - Bar chart murni HTML/CSS/JS (tanpa library)
   - Catat berapa sesi fokus selesai per hari
   - Tampilkan 7 hari terakhir
   - Hari ini di-highlight dengan warna hijau
   - Data disimpan di localStorage
------------------------------------------------ */

const barChart         = document.getElementById('bar-chart');
const resetAnalyticsBtn = document.getElementById('reset-analytics-btn');

/**
 * Format tanggal ke string "YYYY-MM-DD" — dipakai sebagai key
 */
function getDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Ambil data analytics dari localStorage
 * Format: { "2025-06-29": 3, "2025-06-30": 5, ... }
 */
function getAnalyticsData() {
  return JSON.parse(localStorage.getItem('analyticsData') || '{}');
}

/**
 * Catat 1 sesi fokus selesai hari ini
 * Dipanggil dari Modul 3 saat timer selesai
 */
function recordFocusSession() {
  const data = getAnalyticsData();
  const key  = getDateKey();
  data[key]  = (data[key] || 0) + 1;
  localStorage.setItem('analyticsData', JSON.stringify(data));
  renderAnalytics(); // Update grafik langsung
}

/**
 * Render bar chart untuk 7 hari terakhir
 */
function renderAnalytics() {
  barChart.innerHTML = '';
  const data    = getAnalyticsData();
  const today   = new Date();
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  // Buat array 7 hari: dari 6 hari lalu hingga hari ini
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d   = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }

  // Cari nilai maksimum untuk skala bar
  const values = days.map(d => data[getDateKey(d)] || 0);
  const maxVal = Math.max(...values, 1); // minimal 1 supaya bar tidak NaN

  days.forEach((d, i) => {
    const key      = getDateKey(d);
    const count    = data[key] || 0;
    const isToday  = i === 6;
    const heightPx = Math.round((count / maxVal) * 120); // max height 120px
    const dayLabel = dayNames[d.getDay()];

    const col = document.createElement('div');
    col.className = 'bar-column';
    col.innerHTML = `
      <span class="bar-value">${count}</span>
      <div class="bar-fill${isToday ? ' today' : ''}"
           style="height:${heightPx}px"
           title="${dayLabel}: ${count} session(s)">
      </div>
      <span class="bar-day">${isToday ? '★' : dayLabel}</span>
    `;
    barChart.appendChild(col);
  });
}

// Tombol reset analytics
resetAnalyticsBtn.addEventListener('click', () => {
  if (confirm('Reset all analytics data and your STREAK? This cannot be undone.')) {
    localStorage.removeItem('analyticsData');
    renderAnalytics();
    localStorage.setItem('streakCount', '0');
    streakCount = 0;
    if (typeof streakCountEl !== 'undefined') {
      streakCountEl.textContent = '0';
      streakCountEl.classList.remove('has-value');
    }
    const streakDisplayEl = document.getElementById('streak-display');
    if (streakDisplayEl) {
      streakDisplayEl.classList.remove(
        'has-streak', 
        'tier-10', 
        'tier-50', 
        'tier-100', 
        'tier-300', 
        'tier-500'
      );
    }
    if (typeof updateStreakTier === 'function') {
      updateStreakTier(0);
    }
  }
});

// Render grafik saat halaman load
renderAnalytics();


/* ------------------------------------------------
   MODUL 7A: LOCAL MP3 DRAG & DROP PLAYER
   - Drag & drop atau klik untuk load file MP3
   - Playlist dengan navigasi prev/next
   - Seek bar, volume, shuffle, repeat
   - Audio Visualizer bar animasi CSS
   - Marquee scroll untuk judul panjang
------------------------------------------------ */

// ── Elemen DOM ──
const dropZone      = document.getElementById('drop-zone');
const fileInput     = document.getElementById('file-input');
const trackTitle    = document.getElementById('track-title');
const trackDuration = document.getElementById('track-duration');
const seekBar       = document.getElementById('seek-bar');
const volumeSlider  = document.getElementById('volume-slider');
const btnPlay       = document.getElementById('btn-play');
const btnPrev       = document.getElementById('btn-prev');
const btnNext       = document.getElementById('btn-next');
const btnShuffle    = document.getElementById('btn-shuffle');
const btnRepeat     = document.getElementById('btn-repeat');
const playlistEl    = document.getElementById('playlist');
const visualizer    = document.getElementById('audio-visualizer');

// ── State ──
const audio      = new Audio();
let playlist     = [];        // array { name, url (objectURL) }
let currentIndex = -1;
let isShuffled   = false;
let isRepeat     = false;
let isSeeking    = false;

// ── Format waktu mm:ss ──
function formatTime(secs) {
  if (isNaN(secs) || secs < 0) return '--:--';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

// ── Bersihkan nama file: hapus ekstensi + ganti _ dan - ──
function cleanName(filename) {
  return filename
    .replace(/\.(mp3|mpeg|ogg|wav|flac|aac)$/i, '')
    .replace(/[_-]/g, ' ')
    .trim();
}

// ── Render playlist ke DOM ──
function renderPlaylist() {
  playlistEl.innerHTML = '';
  playlist.forEach(function(track, i) {
    const li   = document.createElement('li');
    li.className = 'playlist-item' + (i === currentIndex ? ' active' : '');
    li.dataset.index = i;
    li.innerHTML =
      '<span class="track-num">' + (i + 1) + '</span>' +
      '<span class="track-name" title="' + track.name + '">' + track.name + '</span>' +
      '<button class="track-remove" data-index="' + i + '" aria-label="Remove track" title="Remove">✕</button>';

    // Klik item → putar track
    li.addEventListener('click', function(e) {
      if (e.target.classList.contains('track-remove')) return;
      loadTrack(i);
      audio.play();
    });

    // Tombol hapus
    li.querySelector('.track-remove').addEventListener('click', function(e) {
      e.stopPropagation();
      removeTrack(i);
    });

    playlistEl.appendChild(li);
  });
}

// ── Load track ke audio element ──
function loadTrack(index) {
  if (index < 0 || index >= playlist.length) return;
  currentIndex = index;
  const track  = playlist[index];

  audio.src = track.url;
  audio.load();
  updateNowPlayingUI(track.name);
  renderPlaylist();
}

// ── Update UI "Now Playing" ──
function updateNowPlayingUI(name) {
  // Reset animasi marquee dulu
  trackTitle.classList.remove('scrolling');
  trackTitle.textContent = name;
  // Jika teks lebih panjang dari container, aktifkan marquee
  setTimeout(function() {
    if (trackTitle.scrollWidth > trackTitle.offsetWidth) {
      // Duplikat teks untuk efek marquee seamless
      trackTitle.textContent = name + '   •   ' + name;
      trackTitle.classList.add('scrolling');
    }
  }, 100);
  trackDuration.textContent = '--:-- / ' + formatTime(audio.duration);
}

// ── Hapus track dari playlist ──
function removeTrack(index) {
  // Revoke objectURL supaya tidak memory leak
  URL.revokeObjectURL(playlist[index].url);
  playlist.splice(index, 1);

  if (playlist.length === 0) {
    // Playlist kosong — reset semua
    audio.pause();
    audio.src = '';
    currentIndex = -1;
    trackTitle.textContent    = 'No track loaded';
    trackDuration.textContent = '--:-- / --:--';
    seekBar.value = 0;
    visualizer.classList.remove('playing');
    btnPlay.textContent = '▶';
    renderPlaylist();
    return;
  }

  // Jika track yang dihapus adalah yang sedang aktif
  if (index === currentIndex) {
    currentIndex = Math.min(index, playlist.length - 1);
    loadTrack(currentIndex);
    audio.play();
  } else if (index < currentIndex) {
    currentIndex--;
  }
  renderPlaylist();
}

// ── Tambah file ke playlist ──
function addFiles(files) {
  let added = 0;
  Array.from(files).forEach(function(file) {
    if (!file.type.includes('audio') && !file.name.match(/\.(mp3|ogg|wav|flac|aac)$/i)) return;
    const url  = URL.createObjectURL(file);
    const name = cleanName(file.name);
    playlist.push({ name: name, url: url });
    added++;
  });

  if (added === 0) return;
  renderPlaylist();

  // Auto-play track pertama yang baru ditambahkan
  if (currentIndex === -1) {
    loadTrack(0);
    audio.play();
  }
}

// ── Pilih track berikutnya (next/prev dengan shuffle support) ──
function getNextIndex(direction) {
  if (playlist.length === 0) return -1;

  if (isShuffled) {
    let rand;
    do { rand = Math.floor(Math.random() * playlist.length); }
    while (playlist.length > 1 && rand === currentIndex);
    return rand;
  }

  const next = currentIndex + direction;
  if (next < 0)                  return playlist.length - 1;
  if (next >= playlist.length)   return 0;
  return next;
}

// ── Event: audio time update → update seek bar & durasi ──
audio.addEventListener('timeupdate', function() {
  if (isSeeking || isNaN(audio.duration)) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  seekBar.value = pct;
  trackDuration.textContent =
    formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration);
});

// ── Event: metadata loaded → update durasi ──
audio.addEventListener('loadedmetadata', function() {
  trackDuration.textContent =
    formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration);
});

// ── Event: audio ended ──
audio.addEventListener('ended', function() {
  if (isRepeat) {
    audio.currentTime = 0;
    audio.play();
    return;
  }
  const next = getNextIndex(1);
  if (next !== -1) {
    loadTrack(next);
    audio.play();
  } else {
    // Playlist habis
    visualizer.classList.remove('playing');
    btnPlay.textContent = '▶';
  }
});

// ── Event: play / pause state ──
audio.addEventListener('play', function() {
  btnPlay.textContent = '⏸';
  visualizer.classList.add('playing');
});

audio.addEventListener('pause', function() {
  btnPlay.textContent = '▶';
  visualizer.classList.remove('playing');
});

// ── Tombol Play/Pause ──
btnPlay.addEventListener('click', function() {
  if (playlist.length === 0) return;
  if (audio.paused) {
    if (!audio.src) loadTrack(0);
    audio.play();
  } else {
    audio.pause();
  }
});

// ── Tombol Prev / Next ──
btnPrev.addEventListener('click', function() {
  // Jika > 3 detik berjalan, restart track saat ini
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  const idx = getNextIndex(-1);
  if (idx !== -1) { loadTrack(idx); audio.play(); }
});

btnNext.addEventListener('click', function() {
  const idx = getNextIndex(1);
  if (idx !== -1) { loadTrack(idx); audio.play(); }
});

// ── Tombol Shuffle ──
btnShuffle.addEventListener('click', function() {
  isShuffled = !isShuffled;
  btnShuffle.classList.toggle('active', isShuffled);
});

// ── Tombol Repeat ──
btnRepeat.addEventListener('click', function() {
  isRepeat = !isRepeat;
  btnRepeat.classList.toggle('active', isRepeat);
});

// ── Seek Bar ──
seekBar.addEventListener('mousedown', function() { isSeeking = true; });
seekBar.addEventListener('touchstart', function() { isSeeking = true; });

seekBar.addEventListener('input', function() {
  if (isNaN(audio.duration)) return;
  const t = (seekBar.value / 100) * audio.duration;
  trackDuration.textContent = formatTime(t) + ' / ' + formatTime(audio.duration);
});

seekBar.addEventListener('change', function() {
  if (!isNaN(audio.duration)) {
    audio.currentTime = (seekBar.value / 100) * audio.duration;
  }
  isSeeking = false;
});

// ── Volume Slider ──
audio.volume = parseFloat(volumeSlider.value);
volumeSlider.addEventListener('input', function() {
  audio.volume = parseFloat(volumeSlider.value);
  document.getElementById('vol-icon').textContent =
    audio.volume === 0 ? '🔇' : audio.volume < 0.4 ? '🔉' : '🔊';
});

// ── Drag & Drop ──
dropZone.addEventListener('dragover', function(e) {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', function() {
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', function(e) {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  addFiles(e.dataTransfer.files);
});

// ── Klik drop zone → buka file picker ──
dropZone.addEventListener('click', function() {
  fileInput.click();
});

// ── Keyboard accessibility (Enter/Space) pada drop zone ──
dropZone.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fileInput.click();
  }
});

fileInput.addEventListener('change', function() {
  if (fileInput.files.length > 0) addFiles(fileInput.files);
  // Reset input supaya file yang sama bisa di-load ulang
  fileInput.value = '';
});

/* ------------------------------------------------
   MODUL 7B: TOGGLE ANALYTICS GRAPH
   - Tombol show/hide grafik dengan animasi slide
   - Simpan state (terbuka/tertutup) di localStorage
------------------------------------------------ */

const toggleBtn        = document.getElementById('toggle-analytics-btn');
const analyticsSection = document.getElementById('analytics-section');

/**
 * Tampilkan analytics dengan animasi slide-in
 */
function showAnalytics() {
  analyticsSection.classList.remove('is-hidden');
  analyticsSection.removeAttribute('hidden');
  // Paksa reflow agar animasi dimulai ulang
  void analyticsSection.offsetWidth;
  analyticsSection.classList.remove('slide-out');
  analyticsSection.classList.add('slide-in');

  toggleBtn.setAttribute('aria-expanded', 'true');
  toggleBtn.innerHTML = '<span id="toggle-analytics-icon">▲</span> Hide Weekly Focus Graph';
  localStorage.setItem('analyticsOpen', 'true');
  renderAnalytics(); // Render ulang supaya animasi bar chart tampil
}

/**
 * Sembunyikan analytics dengan animasi slide-out
 */
function hideAnalytics() {
  analyticsSection.classList.remove('slide-in');
  analyticsSection.classList.add('slide-out');

  toggleBtn.setAttribute('aria-expanded', 'false');
  toggleBtn.innerHTML = '<span id="toggle-analytics-icon">▼</span> Show Weekly Focus Graph';
  localStorage.setItem('analyticsOpen', 'false');

  // Setelah animasi selesai, sembunyikan elemen
  analyticsSection.addEventListener('animationend', () => {
    analyticsSection.classList.add('is-hidden');
    analyticsSection.classList.remove('slide-out');
  }, { once: true }); // { once: true } = listener otomatis dihapus setelah dijalankan
}

// Pulihkan state dari sesi sebelumnya
if (localStorage.getItem('analyticsOpen') === 'true') {
  analyticsSection.classList.remove('is-hidden');
  analyticsSection.removeAttribute('hidden');
  toggleBtn.setAttribute('aria-expanded', 'true');
  toggleBtn.innerHTML = '<span id="toggle-analytics-icon">▲</span> Hide Weekly Focus Graph';
} else {
  // Pastikan tersembunyi saat pertama load
  analyticsSection.classList.add('is-hidden');
}

toggleBtn.addEventListener('click', () => {
  const isHidden = analyticsSection.classList.contains('is-hidden');
  if (isHidden) {
    showAnalytics();
  } else {
    hideAnalytics();
  }
});


/* ------------------------------------------------
   MODUL 8: SCROLL-REVEAL (Intersection Observer)
   - Semua elemen dengan class .reveal dimulai
     dalam state tersembunyi (opacity 0, shifted down)
   - Saat elemen masuk viewport, class .is-visible
     ditambahkan untuk memicu animasi slide-up
   - Menggunakan IntersectionObserver API — performa
     jauh lebih baik dari scroll event listener
------------------------------------------------ */

/**
 * Setup Intersection Observer untuk scroll-reveal
 */
function initScrollReveal() {
  // Pilih semua elemen yang perlu di-reveal
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length === 0) return;

  // Opsi observer:
  // threshold: 0.12 = animasi mulai saat 12% elemen terlihat
  // rootMargin: sedikit negatif supaya trigger tidak terlalu cepat
  const observerOptions = {
    root:       null,         // viewport browser
    rootMargin: '0px 0px -60px 0px', // trigger 60px sebelum batas bawah viewport
    threshold:  0.12,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Elemen masuk viewport — tambahkan class visible
        entry.target.classList.add('is-visible');

        // Setelah animasi selesai, stop observe elemen ini
        // (animasi cukup 1 kali, tidak perlu diulang)
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe semua elemen .reveal
  revealEls.forEach(el => {
    // Cek apakah elemen sudah terlihat saat load
    // (misalnya di layar besar, semua konten langsung terlihat)
    const rect = el.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight - 60;

    if (alreadyVisible) {
      // Langsung visible tanpa animasi — hindari flash of invisible content
      el.classList.add('is-visible');
    } else {
      // Observasi untuk animasi saat scroll
      observer.observe(el);
    }
  });
}

// Jalankan setelah DOM selesai dimuat
// (script.js sudah di bawah body, jadi DOM pasti ready)
initScrollReveal();
