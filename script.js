// SAHIFA ALMASHTIRISH
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(pageId).classList.remove('hidden');
    event.target.classList.add('active');
    
    if (pageId === 'lugat') renderLugat();
    if (pageId === 'grammatika') renderGrammatika();
}

// LUG'AT RENDER
function renderLugat() {
    const kitob = document.getElementById('kitob-select').value;
    const dars = document.getElementById('dars-select').value;
    const grid = document.getElementById('lugat-cards');
    
    let words = [];
    
    if (dars === 'all') {
        Object.values(lugat[kitob]).forEach(d => words.push(...d));
    } else {
        words = lugat[kitob][dars] || [];
    }
    
    grid.innerHTML = words.map(w => `
        <div class="word-card" onclick="flipCard(this)">
            <span class="word-emoji">${w.emoji}</span>
            <div class="word-korean">${w.korean}</div>
            <div class="word-uzbek">${w.uzbek}</div>
        </div>
    `).join('');
}

// DARS FILTER YANGILASH
function filterLugat() {
    const kitob = document.getElementById('kitob-select').value;
    const darsSelect = document.getElementById('dars-select');
    
    darsSelect.innerHTML = '<option value="all">Barcha darslar</option>';
    Object.keys(lugat[kitob]).forEach(dars => {
        darsSelect.innerHTML += `<option value="${dars}">${dars}</option>`;
    });
    
    renderLugat();
}

// QIDIRISH
function searchLugat() {
    const query = document.getElementById('search').value.toLowerCase();
    const kitob = document.getElementById('kitob-select').value;
    const grid = document.getElementById('lugat-cards');
    
    let words = [];
    Object.values(lugat[kitob]).forEach(d => words.push(...d));
    
    const filtered = words.filter(w => 
        w.korean.includes(query) || 
        w.uzbek.toLowerCase().includes(query)
    );
    
    grid.innerHTML = filtered.map(w => `
        <div class="word-card">
            <span class="word-emoji">${w.emoji}</span>
            <div class="word-korean">${w.korean}</div>
            <div class="word-uzbek">${w.uzbek}</div>
        </div>
    `).join('');
}

// GRAMMATIKA RENDER
function renderGrammatika() {
    const list = document.getElementById('grammatika-list');

    // Filter tugmalari
    const darslar = [...new Set(grammatika.map(g => g.dars))];
    
    let filterHTML = `
        <div class="gram-filters">
            <button class="gram-filter active" onclick="filterGrammatika('all', this)">Barchasi</button>
            ${darslar.map(d => `
                <button class="gram-filter" onclick="filterGrammatika('${d}', this)">${d}</button>
            `).join('')}
        </div>
        <div id="gram-cards" class="grammatika-grid"></div>
    `;
    
    list.innerHTML = filterHTML;
    showGramCards('all');
}

function showGramCards(dars) {
    const filtered = dars === 'all' 
        ? grammatika 
        : grammatika.filter(g => g.dars === dars);
    
    document.getElementById('gram-cards').innerHTML = filtered.map(g => `
        <div class="grammatika-card">
            <div class="gram-dars">${g.dars}</div>
            <div class="rule">${g.rule}</div>
            <div class="meaning">📌 ${g.meaning}</div>
            <div class="example">💬 ${g.example}</div>
        </div>
    `).join('');
}

function filterGrammatika(dars, btn) {
    document.querySelectorAll('.gram-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    showGramCards(dars);
}
// SCORE VA STREAK
var score = 0;
var total = 0;
var streak = 0;
var timer = null;
var timeLeft = 10;

// TIMER
function startTimer() {
    clearInterval(timer);
    timeLeft = 10;
    document.getElementById('timer-display').textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-display').textContent = timeLeft;
        
        if (timeLeft <= 3) {
            document.getElementById('timer-display').style.color = '#e94560';
        } else {
            document.getElementById('timer-display').style.color = 'white';
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
            streak = 0;
            updateStats();
            
            const testArea = document.getElementById('test-area');
            const timeoutDiv = document.createElement('div');
            timeoutDiv.innerHTML = `
                <p style="color:#e94560; text-align:center; font-size:1.2rem; margin:15px">
                    ⏰ Vaqt tugadi!
                </p>
            `;
            testArea.appendChild(timeoutDiv);
        }
    }, 1000);
}

// STATS YANGILASH
function updateStats() {
    document.getElementById('score-display').textContent = `${score}/${total}`;
    document.getElementById('streak-display').textContent = streak;
    
    const streakEl = document.getElementById('streak-display');
    if (streak >= 5) streakEl.style.color = '#f5a623';
    else if (streak >= 3) streakEl.style.color = '#00d2ff';
    else streakEl.style.color = 'white';
}

// TEST
function startTest() {
    document.getElementById('test-stats').classList.remove('hidden');
    
    const kitob = '1A';
    let words = [];
    Object.values(lugat[kitob]).forEach(d => words.push(...d));
    
    const word = words[Math.floor(Math.random() * words.length)];
    const wrong = words
        .filter(w => w.korean !== word.korean)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
    
    const options = [...wrong, word].sort(() => Math.random() - 0.5);
    
    document.getElementById('test-area').innerHTML = `
        <div class="test-question">
            <div class="test-emoji">${word.emoji}</div>
            <div class="test-word">${word.korean}</div>
            <p>Qaysi tarjima to'g'ri?</p>
        </div>
        <div class="test-options">
            ${options.map(o => `
                <button class="option-btn"
                    data-selected="${o.uzbek}"
                    data-correct="${word.uzbek}"
                    data-korean="${word.korean}">
                    ${o.uzbek}
                </button>
            `).join('')}
        </div>
        <button class="start-btn" onclick="startTest()">⏭️ Keyingi</button>
    `;

    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            checkAnswer(
                this,
                this.dataset.selected,
                this.dataset.correct,
                this.dataset.korean
            );
        });
    });

    startTimer();
}

// JAVOB TEKSHIRISH
function checkAnswer(btn, selected, correct, korean) {
    clearInterval(timer);
    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
    
    total++;
    
    if (selected === correct) {
        btn.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
        btn.innerHTML += ' ✅';
        score++;
        streak++;
    } else {
        btn.style.background = 'linear-gradient(135deg, #e94560, #c0392b)';
        btn.innerHTML += ' ❌';
        streak = 0;
        
        document.querySelectorAll('.option-btn').forEach(b => {
            if (b.dataset.selected === correct) {
                b.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
            }
        });

        const testArea = document.getElementById('test-area');
        const explainDiv = document.createElement('div');
        explainDiv.id = 'explain-area';
        explainDiv.innerHTML = `
            <button class="explain-btn" id="explain-button">
                💡 Tushuntir
            </button>
            <div id="explain-text"></div>
        `;
        testArea.appendChild(explainDiv);
        
        document.getElementById('explain-button').addEventListener('click', () => {
            getExplanation(korean, correct);
        });
    }
    
    updateStats();
}
// JAVOB TEKSHIRISH
function checkAnswer(btn, selected, correct, korean) {
    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
    
    if (selected === correct) {
        btn.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
        btn.innerHTML += ' ✅';
    } else {
        btn.style.background = 'linear-gradient(135deg, #e94560, #c0392b)';
        btn.innerHTML += ' ❌';
        document.querySelectorAll('.option-btn').forEach(b => {
            if (b.textContent.includes(correct)) {
                b.style.background = 'linear-gradient(135deg, #00b894, #00cec9)';
            }
        });

        // Izoh tugmasi
        const testArea = document.getElementById('test-area');
        const explainDiv = document.createElement('div');
        explainDiv.id = 'explain-area';
        explainDiv.innerHTML = `
            <button class="explain-btn" onclick="getExplanation('${korean}', '${correct}')">
                💡 Tushuntir
            </button>
            <div id="explain-text"></div>
        `;
        testArea.appendChild(explainDiv);
    }
}

// AI IZOH
async function getExplanation(korean, uzbek) {
    const btn = document.querySelector('.explain-btn');
    btn.innerHTML = '⏳ Yuklanmoqda...';
    btn.disabled = true;

    try {
        const response = await fetch(CONFIG.DEEPSEEK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CONFIG.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    {
                        role: "user",
                        content: `Korean so'z: "${korean}", O'zbekcha: "${uzbek}". 
                        Bu so'zni o'zbek tilida qisqacha tushuntir (2-3 jumla). 
                        Misol jumla ham ber. Faqat o'zbek tilida yoz.`
                    }
                ],
                max_tokens: 200
            })
        });

        const data = await response.json();
        const text = data.choices[0].message.content;

        document.getElementById('explain-text').innerHTML = `
            <div class="explain-box">
                <p>${text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>
            </div>
        `;
        btn.innerHTML = '💡 Tushuntirildi';

    } catch (err) {
        document.getElementById('explain-text').innerHTML = `
            <div class="explain-box">
                <p>❌ Xato: API ga ulanib bo'lmadi</p>
            </div>
        `;
        btn.innerHTML = '💡 Tushuntir';
        btn.disabled = false;
    }
}

// FLASHCARD
// FLASHCARD
var flashWords = [];
var flashIndex = 0;
var isFlipped = false;

function startFlashcard() {
    const kitob = '1A';
    flashWords = [];
    Object.values(lugat[kitob]).forEach(d => flashWords.push(...d));
    flashWords = flashWords.sort(() => Math.random() - 0.5);
    flashIndex = 0;
    showFlashcard();
}

function showFlashcard() {
    const w = flashWords[flashIndex];
    isFlipped = false;
    
    document.getElementById('flashcard-area').innerHTML = `
        <div class="fc-counter">${flashIndex + 1} / ${flashWords.length}</div>
        
        <div class="fc-card" id="fc-card" onclick="flipFlashcard()">
            <div class="fc-front">
                <div class="fc-emoji">${w.emoji}</div>
                <div class="fc-korean">${w.korean}</div>
                <div class="fc-hint">bosing →</div>
            </div>
            <div class="fc-back">
                <div class="fc-emoji">${w.emoji}</div>
                <div class="fc-uzbek">${w.uzbek}</div>
            </div>
        </div>

        <div class="fc-buttons">
            <button class="fc-btn fc-prev" onclick="prevFlashcard()">⬅️ Oldingi</button>
            <button class="fc-btn fc-next" onclick="nextFlashcard()">Keyingi ➡️</button>
        </div>

        <div class="fc-progress">
            <div class="fc-progress-bar" style="width: ${((flashIndex+1)/flashWords.length)*100}%"></div>
        </div>
    `;
}

function flipFlashcard() {
    const card = document.getElementById('fc-card');
    isFlipped = !isFlipped;
    card.classList.toggle('fc-flipped');
}

function nextFlashcard() {
    if (flashIndex < flashWords.length - 1) {
        flashIndex++;
        showFlashcard();
    }
}

function prevFlashcard() {
    if (flashIndex > 0) {
        flashIndex--;
        showFlashcard();
    }
}

// ISHGA TUSHIRISH
window.onload = function() {
    renderLugat();
}

// FLIP CARD
function flipCard(card) {
    card.classList.toggle('flipped');
}