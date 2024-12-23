// Placeholder for user data
const users = [];

// Sign-Up Functionality
function signUp() {
    const username = document.getElementById('signUpUsername').value.trim();
    const email = document.getElementById('signUpEmail').value.trim();
    const password = document.getElementById('signUpPassword').value.trim();
    const error = document.getElementById('signUpError');
    const success = document.getElementById('signUpSuccess');

    // Clear messages
    error.textContent = '';
    success.textContent = '';

    // Validation
    if (!username || !email || !password) {
        error.textContent = 'Please fill in all fields.';
        return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        error.textContent = 'Enter a valid email.';
        return;
    }

    if (users.some(user => user.username === username)) {
        error.textContent = 'Username already exists.';
        return;
    }

    // Save user data
    users.push({ username, email, password });
    success.textContent = 'Account created successfully!';
    document.getElementById('signUpForm').reset();
}

// Login Functionality
function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const error = document.getElementById('loginError');

    // Clear messages
    error.textContent = '';

    // Validation
    if (!username || !password) {
        error.textContent = 'Please fill in all fields.';
        return;
    }

    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        error.textContent = 'Incorrect username or password.';
        return;
    }

    alert(`Welcome back, ${username}!`);
    document.getElementById('loginForm').reset();
}

// Toggle Between Login and Signup
function toggleAuth(type) {
    const loginForm = document.getElementById('loginForm');
    const signUpForm = document.getElementById('signUpForm');
    const authTitle = document.getElementById('authTitle');

    if (type === 'login') {
        loginForm.classList.add('active');
        signUpForm.classList.remove('active');
        authTitle.textContent = 'Login';
    } else {
        signUpForm.classList.add('active');
        loginForm.classList.remove('active');
        authTitle.textContent = 'Sign Up';
    }
}
// JavaScript to toggle between sections
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach((section) => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.7;

// Images with improved quality
const playerImg = new Image();
playerImg.src = "https://i.postimg.cc/nXXZTdhT/player.png";

const enemyImg = new Image();
enemyImg.src = "https://i.postimg.cc/9Rnrg4jq/enemy.png";

// Player setup
let player = {
    x: 50,
    y: canvas.height / 2 - 50,
    width: 70,
    height: 90,
    speed: 10,
    health: 100,
    label: "مصر",
    bullets: [],
};

// Game variables
let enemies = [];
let score = 0;
let requiredScore = 5;

// DOM Elements
const lifeBar = document.getElementById("lifeBar");
const scoreDisplay = document.getElementById("scoreDisplay");
const requiredScoreDisplay = document.getElementById("requiredScore");
const restartButton = document.getElementById("restartButton");

// Button events
document.getElementById("leftButton").addEventListener("click", () => {
    player.x = Math.max(0, player.x - player.speed);
});

document.getElementById("rightButton").addEventListener("click", () => {
    player.x = Math.min(canvas.width - player.width, player.x + player.speed);
});

document.getElementById("upButton").addEventListener("click", () => {
    player.y = Math.max(0, player.y - player.speed);
});

document.getElementById("downButton").addEventListener("click", () => {
    player.y = Math.min(canvas.height - player.height, player.y + player.speed);
});

document.getElementById("shootButton").addEventListener("click", () => {
    player.bullets.push({ x: player.x + player.width, y: player.y + player.height / 2, radius: 5 });
});

restartButton.addEventListener("click", () => {
    resetGame();
});

// Create enemies
function createEnemy() {
    const enemySize = 70;
    const enemyY = Math.random() * (canvas.height - enemySize);
    enemies.push({
        x: canvas.width,
        y: enemyY,
        width: enemySize,
        height: 90,
        speed: 3 + Math.random() * 2,
        label: "عدو",
    });
}

setInterval(createEnemy, 2000);

// Draw player
function drawPlayer() {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
    ctx.fillStyle = "white";
    ctx.font = "20px 'Arial'";
    ctx.fillText(player.label, player.x + player.width / 4, player.y - 15);

    player.bullets.forEach((bullet, index) => {
        bullet.x += 10;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fillStyle = "yellow";
        ctx.fill();

        if (bullet.x > canvas.width) {
            player.bullets.splice(index, 1);
        }
    });
}

// Draw enemies
function drawEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.x -= enemy.speed;

        if (enemy.x + enemy.width < 0) {
            enemies.splice(index, 1);
        }

        player.bullets.forEach((bullet, bulletIndex) => {
            if (
                bullet.x > enemy.x &&
                bullet.x < enemy.x + enemy.width &&
                bullet.y > enemy.y &&
                bullet.y < enemy.y + enemy.height
            ) {
                enemies.splice(index, 1);
                player.bullets.splice(bulletIndex, 1);
                score++;
            }
        });

        ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
        ctx.fillStyle = "white";
        ctx.font = "20px 'Arial'";
        ctx.fillText(enemy.label, enemy.x + enemy.width / 4, enemy.y - 15);
    });
}

// Update life bar
function updateLifeBar() {
    lifeBar.style.width = `${player.health}%`;
    if (player.health <= 0) {
        endGame();
    }
}

// End game
function endGame() {
    restartButton.style.display = "block";
    cancelAnimationFrame(gameInterval);
}

// Reset game
function resetGame() {
    player.health = 100;
    score = 0;
    requiredScore = 5;
    enemies = [];
    restartButton.style.display = "none";
    gameLoop();
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawEnemies();
    updateLifeBar();

    scoreDisplay.textContent = `النتيجة: ${score}`;
    requiredScoreDisplay.textContent = `النتيجة المطلوبة: ${requiredScore}`;

    if (score >= requiredScore) {
        requiredScore += 5;
    }

    gameInterval = requestAnimationFrame(gameLoop);
}

let gameInterval = requestAnimationFrame(gameLoop);

// ** Section for Wikipedia & YouTube Integration **

let currentLanguage = 'ar';
let searchResults = [];
const YOUTUBE_API_KEY = "AIzaSyAk0lJVqzNWRyG1OPHCQhG7wwod3cZjQSw";

// Language Translations
const translations = {
    ar: {
        mainTitle: "موسوعة الحضارة المصرية",
        searchPlaceholder: "ابحث عن التاريخ المصري...",
        searchButton: "ابحث",
        readMore: "عرض المزيد",
        listenArticle: "استمع إلى المقال",
        voiceSearch: "بحث صوتي"
    },
    en: {
        mainTitle: "Egyptian Civilization Encyclopedia",
        searchPlaceholder: "Search for Egyptian history...",
        searchButton: "Search",
        readMore: "Show more",
        listenArticle: "Listen to the article",
        voiceSearch: "Voice Search"
    }
};

// Update UI on language change
function changeLanguage() {
    const languageSelect = document.getElementById("language");
    currentLanguage = languageSelect.value;
    const translation = translations[currentLanguage];

    document.getElementById("main-title").textContent = translation.mainTitle;
    document.getElementById("search-bar").placeholder = translation.searchPlaceholder;
    document.getElementById("search-button").textContent = translation.searchButton;
    fetchContent("الحضارة المصرية");
}

// Fetch content from Wikipedia
async function fetchContent(query = null) {
    const searchQuery = query || document.getElementById("search-bar").value.trim() || "الحضارة المصرية";
    const wikiApiUrl = `https://${currentLanguage}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchQuery)}&format=json&origin=*`;

    try {
        const response = await fetch(wikiApiUrl);
        const data = await response.json();
        searchResults = data.query.search;
        currentIndex = 0;
        displayContent();
        fetchYouTubeVideo(searchQuery);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Display summarized article
function displayContent() {
    if (searchResults.length === 0) {
        document.getElementById("content-section").innerHTML = `<p>${translations[currentLanguage].noResults}</p>`;
        return;
    }

    const result = searchResults[currentIndex];
    fetchPageContent(result.title);
}

// Fetch Wikipedia summary
async function fetchPageContent(title) {
    const wikiApiUrl = `https://${currentLanguage}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

    try {
        const response = await fetch(wikiApiUrl);
        const data = await response.json();

        document.getElementById("content-section").innerHTML = `
            <h2>${data.title}</h2>
            <p>${data.extract}</p>
            ${data.thumbnail ? `<img src="${data.thumbnail.source}" alt="${data.title}">` : ''}
            <button onclick="fetchFullPageContent('${data.title}')">${translations[currentLanguage].readMore}</button>
            <button onclick="readArticle('${data.extract}')">${translations[currentLanguage].listenArticle}</button>
            <div id="youtube-video"></div>
        `;
    } catch (error) {
        console.error("Error fetching page content:", error);
    }
}

// Fetch full Wikipedia page content
async function fetchFullPageContent(title) {
    const wikiApiUrl = `https://${currentLanguage}.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(title)}&format=json&origin=*`;

    try {
        const response = await fetch(wikiApiUrl);
        const data = await response.json();
        const fullContentHtml = data.parse.text['*'];

        document.getElementById("content-section").innerHTML += `
            <div class="full-content">${fullContentHtml}</div>
        `;
    } catch (error) {
        console.error("Error fetching full page content:", error);
    }
}

// Fetch YouTube video
async function fetchYouTubeVideo(query) {
    const youtubeApiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}&type=video&maxResults=1`;

    try {
        const response = await fetch(youtubeApiUrl);
        const data = await response.json();

        if (data.items && data.items.length > 0) {
            const video = data.items[0];
            displayYouTubeVideo(video);
        } else {
            document.getElementById("youtube-video").innerHTML = `<p>No related video found.</p>`;
        }
    } catch (error) {
        console.error("Error fetching YouTube video:", error);
    }
}

// Display YouTube video
function displayYouTubeVideo(video) {
    document.getElementById("youtube-video").innerHTML = `
        <div class="video-player" style="text-align: center; margin: 20px 0;">
            <iframe width="100%" height="315" src="https://www.youtube.com/embed/${video.id.videoId}" 
                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen></iframe>
            <p>${video.snippet.title}</p>
        </div>
    `;
}

// Text-to-Speech
function readArticle(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = currentLanguage;
    window.speechSynthesis.speak(speech);
}

// Voice search
function voiceSearch() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = currentLanguage;
    recognition.onresult = (event) => {
        const query = event.results[0][0].transcript;
        document.getElementById("search-bar").value = query;
        fetchContent(query);
    };
    recognition.start();
}

// Load default content on page load
document.addEventListener("DOMContentLoaded", () => {
    fetchContent("الحضارة المصرية");
});
