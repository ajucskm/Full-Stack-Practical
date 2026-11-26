const categorySelect = document.getElementById('category-select');
const setupText = document.getElementById('setup-text');
const punchlineText = document.getElementById('punchline-text');
const statusMsg = document.getElementById('status-msg');
const newJokeBtn = document.getElementById('new-joke-btn');
const copyBtn = document.getElementById('copy-btn');

let currentJoke = '';

// Local fallback jokes in case file:/// or network blocks external APIs
const fallbackJokes = Array.of(
  { category: 'Programming', setup: 'Why do programmers prefer dark mode?', delivery: 'Because light attracts bugs!' },
  { category: 'Programming', setup: 'How many programmers does it take to change a light bulb?', delivery: 'None, that is a hardware problem.' },
  { category: 'Programming', setup: 'Why did the developer go broke?', delivery: 'Because he used up all his cache!' },
  { category: 'Misc', setup: 'Why do not scientists trust atoms?', delivery: 'Because they make up everything!' },
  { category: 'Pun', setup: 'I used to play piano by ear...', delivery: 'Now I use my hands.' },
  { category: 'Misc', setup: 'What do you call a fake noodle?', delivery: 'An impasta!' }
);

function getFallbackJoke(category) {
  const filtered = category === 'Any'
    ? fallbackJokes
    : fallbackJokes.filter(j => j.category === category);
  const pool = filtered.length > 0 ? filtered : fallbackJokes;
  return pool.at(Math.floor(Math.random() * pool.length));
}

async function fetchJoke() {
  const category = categorySelect.value;

  newJokeBtn.disabled = true;
  copyBtn.disabled = true;
  statusMsg.textContent = '';
  setupText.textContent = 'Loading a fresh joke...';
  punchlineText.textContent = '';

  try {
    // 1. Try icanhazdadjoke API (fast, CORS-enabled, reliable)
    if (category === 'Any') {
      const res = await fetch('https://icanhazdadjoke.com', {
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setupText.textContent = data.joke;
        punchlineText.textContent = '';
        currentJoke = data.joke;
        copyBtn.disabled = false;
        return;
      }
    }

    // 2. Try JokeAPI for specific categories
    const response = await fetch(`https://jokeapi.dev{category}?safe-mode`);
    if (!response.ok) throw new Error('API unavailable');

    const data = await response.json();
    if (data.error) throw new Error(data.message);

    if (data.type === 'twopart') {
      setupText.textContent = data.setup;
      punchlineText.textContent = data.delivery;
      currentJoke = `${data.setup}\n${data.delivery}`;
    } else {
      setupText.textContent = data.joke;
      punchlineText.textContent = '';
      currentJoke = data.joke;
    }
    copyBtn.disabled = false;

  } catch (error) {
    // 3. Seamless offline/file:// fallback
    const localJoke = getFallbackJoke(category);
    setupText.textContent = localJoke.setup;
    punchlineText.textContent = localJoke.delivery;
    currentJoke = `${localJoke.setup}\n${localJoke.delivery}`;
    copyBtn.disabled = false;
  } finally {
    newJokeBtn.disabled = false;
  }
}

function copyJoke() {
  if (!currentJoke) return;

  navigator.clipboard.writeText(currentJoke).then(() => {
    statusMsg.textContent = 'Copied to clipboard!';
    setTimeout(() => {
      statusMsg.textContent = '';
    }, 2000);
  });
}

newJokeBtn.addEventListener('click', fetchJoke);
copyBtn.addEventListener('click', copyJoke);
categorySelect.addEventListener('change', fetchJoke);

// Load initial joke
fetchJoke();
