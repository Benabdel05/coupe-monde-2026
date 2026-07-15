// ============================================
// CONFIGURATION
// ============================================
// 1. Inscris-toi sur https://www.football-data.org/client/register
// 2. Colle ta clé API gratuite ci-dessous
// 3. Attention : ce site est statique (GitHub Pages), donc cette clé
//    est visible dans le code. C'est normal/acceptable pour une clé
//    gratuite à usage limité, mais ne mets jamais une clé payante ici.
const API_KEY = '73cdfe0d81144e54b69d9269df96f301';
const API_BASE = 'https://api.football-data.org/v4';
const COMPETITION = 'WC'; // Code de la Coupe du Monde FIFA

// Fallback flags (map codes API -> emoji drapeau) pour l'affichage
const flagEmojis = {
    'USA': '🇺🇸', 'CAN': '🇨🇦', 'MEX': '🇲🇽', 'BRA': '🇧🇷', 'ARG': '🇦🇷',
    'FRA': '🇫🇷', 'GER': '🇩🇪', 'ESP': '🇪🇸', 'POR': '🇵🇹', 'ENG': '🏴',
    'NED': '🇳🇱', 'ITA': '🇮🇹', 'BEL': '🇧🇪', 'CRO': '🇭🇷', 'URU': '🇺🇾',
    'SEN': '🇸🇳', 'MAR': '🇲🇦', 'TUN': '🇹🇳', 'GHA': '🇬🇭', 'JPN': '🇯🇵',
    'KOR': '🇰🇷', 'IRN': '🇮🇷', 'AUS': '🇦🇺', 'QAT': '🇶🇦'
};

function getFlag(name) {
    const found = Object.keys(flagEmojis).find(code =>
        name && name.toLowerCase().includes(code.toLowerCase())
    );
    return found ? flagEmojis[found] : '🏳️';
}

// Données de secours si l'API échoue (pas de clé, quota dépassé, hors-ligne...)
const fallbackMatches = [
    { id: 1, phase: 'group', group: 'A', date: '2026-06-11', time: '19:00', team1: 'USA', team2: 'Canada', score1: null, score2: null, status: 'upcoming', venue: 'Los Angeles' },
    { id: 2, phase: 'group', group: 'A', date: '2026-06-12', time: '16:00', team1: 'Mexique', team2: 'Qatar', score1: null, score2: null, status: 'upcoming', venue: 'Mexico City' },
];

let matches = [];
let groupsData = {};
let scorersData = [];

// ============================================
// APPELS API
// ============================================
async function apiFetch(endpoint) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: { 'X-Auth-Token': API_KEY }
    });
    if (!response.ok) {
        throw new Error(`Erreur API (${response.status}) sur ${endpoint}`);
    }
    return response.json();
}

function mapStatus(apiStatus) {
    if (apiStatus === 'IN_PLAY' || apiStatus === 'PAUSED' || apiStatus === 'LIVE') return 'live';
    if (apiStatus === 'FINISHED') return 'finished';
    return 'upcoming';
}

function mapApiMatch(m) {
    const dateObj = new Date(m.utcDate);
    return {
        id: m.id,
        phase: (m.stage || '').toLowerCase().includes('group') ? 'group' : (m.stage || '').toLowerCase(),
        group: m.group ? m.group.replace('GROUP_', '') : null,
        date: dateObj.toISOString().split('T')[0],
        time: dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        team1: m.homeTeam?.name || 'À déterminer',
        team2: m.awayTeam?.name || 'À déterminer',
        score1: m.score?.fullTime?.home,
        score2: m.score?.fullTime?.away,
        status: mapStatus(m.status),
        venue: m.venue || ''
    };
}

async function loadMatches() {
    try {
        const data = await apiFetch(`/competitions/${COMPETITION}/matches`);
        matches = (data.matches || []).map(mapApiMatch);
    } catch (err) {
        console.warn('Impossible de charger les matchs depuis l\'API, utilisation des données de secours.', err);
        matches = fallbackMatches;
    }
}

async function loadGroups() {
    try {
        const data = await apiFetch(`/competitions/${COMPETITION}/standings`);
        groupsData = {};
        (data.standings || []).forEach(group => {
            const groupName = (group.group || '').replace('GROUP_', '');
            groupsData[groupName] = group.table.map(t => ({
                name: t.team.name,
                flag: getFlag(t.team.name),
                played: t.playedGames,
                won: t.won,
                drawn: t.draw,
                lost: t.lost,
                gf: t.goalsFor,
                ga: t.goalsAgainst,
                pts: t.points
            }));
        });
    } catch (err) {
        console.warn('Impossible de charger les groupes depuis l\'API.', err);
        groupsData = {};
    }
}

async function loadScorers() {
    try {
        const data = await apiFetch(`/competitions/${COMPETITION}/scorers`);
        scorersData = (data.scorers || []).map(s => ({
            name: s.player.name,
            country: s.team.name,
            goals: s.goals
        }));
    } catch (err) {
        console.warn('Impossible de charger les buteurs depuis l\'API.', err);
        scorersData = [];
    }
}

// ============================================
// COMPTE À REBOURS
// ============================================
function updateCountdown() {
    const worldCupDate = new Date('2026-06-11T19:00:00').getTime();
    const now = new Date().getTime();
    const distance = worldCupDate - now;

    const clamp = distance < 0 ? 0 : distance;
    const days = Math.floor(clamp / (1000 * 60 * 60 * 24));
    const hours = Math.floor((clamp % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((clamp % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((clamp % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// ============================================
// RENDU DES MATCHS
// ============================================
function renderMatchCard(match) {
    const isLive = match.status === 'live';
    const statusText = match.status === 'live' ? '🔴 EN DIRECT' :
                       match.status === 'finished' ? 'TERMINÉ' : 'À VENIR';
    const scoreDisplay = match.status === 'upcoming' ? '- : -' : `${match.score1 ?? '-'} - ${match.score2 ?? '-'}`;

    return `
        <div class="match-card ${isLive ? 'live' : ''}">
            <div class="match-status ${match.status}">${statusText}</div>
            <div class="match-teams">
                <div class="team">
                    <div class="team-flag">${getFlag(match.team1)}</div>
                    <div class="team-name">${match.team1}</div>
                </div>
                <div class="vs"><div class="score">${scoreDisplay}</div></div>
                <div class="team">
                    <div class="team-flag">${getFlag(match.team2)}</div>
                    <div class="team-name">${match.team2}</div>
                </div>
            </div>
            <div class="match-info">
                📅 ${new Date(match.date).toLocaleDateString('fr-FR')} |
                🕐 ${match.time} |
                📍 ${match.venue || 'À confirmer'} |
                ${match.group ? `Groupe ${match.group}` : (match.phase || '').toUpperCase()}
            </div>
        </div>
    `;
}

function renderMatchRow(match) {
    return `
        <div class="match-row" data-phase="${match.phase}">
            <div class="match-time">${match.time}</div>
            <div class="team-cell">
                <span class="flag">${getFlag(match.team1)}</span>
                <span>${match.team1}</span>
            </div>
            <div class="score" style="text-align:center;font-weight:900;">
                ${match.status === 'upcoming' ? '- : -' : `${match.score1 ?? '-'} - ${match.score2 ?? '-'}`}
            </div>
            <div class="team-cell" style="justify-content:flex-end;">
                <span>${match.team2}</span>
                <span class="flag">${getFlag(match.team2)}</span>
            </div>
            <div class="match-phase">${match.group ? `Grp ${match.group}` : match.phase}</div>
        </div>
    `;
}

function renderTodayMatches() {
    const today = new Date().toISOString().split('T')[0];
    const todayMatches = matches.filter(m => m.date === today);
    const container = document.getElementById('today-matches');

    container.innerHTML = todayMatches.length === 0
        ? '<p style="text-align:center;color:#888;">Aucun match aujourd\'hui. Prochains matchs bientôt !</p>'
        : todayMatches.map(renderMatchCard).join('');
}

function renderAllMatches(filter = 'all') {
    const container = document.getElementById('all-matches');
    const filtered = filter === 'all' ? matches : matches.filter(m => m.phase === filter);

    container.innerHTML = filtered.length === 0
        ? '<p style="text-align:center;color:#888;">Aucun match pour ce filtre.</p>'
        : filtered.map(renderMatchRow).join('');
}

function renderGroups() {
    const container = document.getElementById('groups-container');
    const entries = Object.entries(groupsData);

    if (entries.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#888;">Groupes pas encore disponibles.</p>';
        return;
    }

    container.innerHTML = entries.map(([groupName, groupTeams]) => `
        <div class="group-card">
            <div class="group-title">Groupe ${groupName}</div>
            <table class="group-table">
                <thead>
                    <tr><th>Équipe</th><th>MJ</th><th>G</th><th>N</th><th>P</th><th>BP</th><th>BC</th><th>Pts</th></tr>
                </thead>
                <tbody>
                    ${groupTeams.map(t => `
                        <tr>
                            <td class="team-cell"><span class="flag">${t.flag}</span><span>${t.name}</span></td>
                            <td>${t.played}</td><td>${t.won}</td><td>${t.drawn}</td><td>${t.lost}</td>
                            <td>${t.gf}</td><td>${t.ga}</td><td>${t.pts}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `).join('');
}

function renderScorers() {
    const container = document.getElementById('scorers');

    container.innerHTML = scorersData.length === 0
        ? '<p style="text-align:center;color:#888;padding:20px;">Classement des buteurs pas encore disponible.</p>'
        : scorersData.map((s, i) => `
            <div class="scorer-row">
                <div class="scorer-rank">#${i + 1}</div>
                <div>
                    <div class="scorer-name">${s.name}</div>
                    <div class="scorer-country">${s.country}</div>
                </div>
                <div></div>
                <div class="scorer-goals">${s.goals} ⚽</div>
            </div>
        `).join('');
}

function initFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderAllMatches(btn.dataset.phase);
        });
    });
}

// ============================================
// INITIALISATION
// ============================================
async function init() {
    updateCountdown();
    setInterval(updateCountdown, 1000);

    await Promise.all([loadMatches(), loadGroups(), loadScorers()]);

    renderTodayMatches();
    renderAllMatches();
    renderGroups();
    renderScorers();
    initFilters();

    // Rafraîchit les matchs toutes les 60 secondes (pour le direct)
    setInterval(async () => {
        await loadMatches();
        renderTodayMatches();
        renderAllMatches(document.querySelector('.filter-btn.active')?.dataset.phase || 'all');
    }, 60000);
}

document.addEventListener('DOMContentLoaded', init);
