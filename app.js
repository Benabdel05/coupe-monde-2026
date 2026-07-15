// Données des matchs (exemples - à mettre à jour avec les vraies données)
const teams = {
    'QAT': { name: 'Qatar', flag: '🇶🇦' },
    'ECU': { name: 'Équateur', flag: '🇪🇨' },
    'SEN': { name: 'Sénégal', flag: '🇸🇳' },
    'NED': { name: 'Pays-Bas', flag: '🇳🇱' },
    'ENG': { name: 'Angleterre', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    'IRN': { name: 'Iran', flag: '🇮🇷' },
    'USA': { name: 'USA', flag: '🇺🇸' },
    'WAL': { name: 'Pays de Galles', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
    'ARG': { name: 'Argentine', flag: '🇦🇷' },
    'KSA': { name: 'Arabie Saoudite', flag: '🇸🇦' },
    'MEX': { name: 'Mexique', flag: '🇲🇽' },
    'POL': { name: 'Pologne', flag: '🇵🇱' },
    'FRA': { name: 'France', flag: '🇫🇷' },
    'AUS': { name: 'Australie', flag: '🇦🇺' },
    'DEN': { name: 'Danemark', flag: '🇩🇰' },
    'TUN': { name: 'Tunisie', flag: '🇹🇳' },
    'ESP': { name: 'Espagne', flag: '🇪🇸' },
    'CRC': { name: 'Costa Rica', flag: '🇨🇷' },
    'GER': { name: 'Allemagne', flag: '🇩🇪' },
    'JPN': { name: 'Japon', flag: '🇯🇵' },
    'BEL': { name: 'Belgique', flag: '🇧🇪' },
    'CAN': { name: 'Canada', flag: '🇨🇦' },
    'MAR': { name: 'Maroc', flag: '🇲🇦' },
    'CRO': { name: 'Croatie', flag: '🇭🇷' },
    'BRA': { name: 'Brésil', flag: '🇧🇷' },
    'SRB': { name: 'Serbie', flag: '🇷🇸' },
    'SUI': { name: 'Suisse', flag: '🇨🇭' },
    'CMR': { name: 'Cameroun', flag: '🇨🇲' },
    'POR': { name: 'Portugal', flag: '🇵🇹' },
    'GHA': { name: 'Ghana', flag: '🇬🇭' },
    'URU': { name: 'Uruguay', flag: '🇺🇾' },
    'KOR': { name: 'Corée du Sud', flag: '🇰🇷' }
};

// Données de la Coupe du Monde 2026 (48 équipes, 12 groupes de 4)
// Note: Ces données sont indicatives, les vraies équipes seront connues après les qualifications
const groups = {
    'A': ['USA', 'CAN', 'MEX', 'QAT'],
    'B': ['BRA', 'ARG', 'FRA', 'GER'],
    'C': ['ESP', 'POR', 'ENG', 'NED'],
    'D': ['ITA', 'BEL', 'CRO', 'URU'],
    'E': ['SEN', 'MAR', 'TUN', 'GHA'],
    'F': ['JPN', 'KOR', 'IRN', 'AUS'],
    'G': ['USA2', 'CAN2', 'CRC', 'JAM'],
    'H': ['COL', 'ECU', 'PER', 'CHI'],
    'I': ['NGA', 'CMR', 'EGY', 'CIV'],
    'J': ['KSA', 'UAE', 'IRQ', 'OMA'],
    'K': ['NZL', 'TAH', 'FIJ', 'PNG'],
    'L': ['WAL', 'SCO', 'UKR', 'TUR']
};

const matches = [
    // Phase de groupes (exemples)
    { id: 1, phase: 'group', group: 'A', date: '2026-06-11', time: '19:00', team1: 'USA', team2: 'CAN', score1: null, score2: null, status: 'upcoming', venue: 'Los Angeles' },
    { id: 2, phase: 'group', group: 'A', date: '2026-06-12', time: '16:00', team1: 'MEX', team2: 'QAT', score1: null, score2: null, status: 'upcoming', venue: 'Mexico City' },
    { id: 3, phase: 'group', group: 'B', date: '2026-06-12', time: '19:00', team1: 'BRA', team2: 'GER', score1: null, score2: null, status: 'upcoming', venue: 'New York' },
    { id: 4, phase: 'group', group: 'B', date: '2026-06-13', time: '16:00', team1: 'ARG', team2: 'FRA', score1: null, score2: null, status: 'upcoming', venue: 'Miami' },
    
    // Ajoute tous les matchs ici...
];

const scorers = [
    { name: 'Kylian Mbappé', country: 'FRA', goals: 5 },
    { name: 'Erling Haaland', country: 'NOR', goals: 4 },
    { name: 'Vinicius Jr', country: 'BRA', goals: 4 },
    { name: 'Lionel Messi', country: 'ARG', goals: 3 },
    { name: 'Harry Kane', country: 'ENG', goals: 3 },
];

// Compte à rebours
function updateCountdown() {
    const worldCupDate = new Date('2026-06-11T19:00:00').getTime();
    const now = new Date().getTime();
    const distance = worldCupDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Rendu des matchs
function renderMatchCard(match) {
    const t1 = teams[match.team1] || { name: match.team1, flag: '🏳️' };
    const t2 = teams[match.team2] || { name: match.team2, flag: '🏳️' };
    
    const isLive = match.status === 'live';
    const statusClass = match.status;
    const statusText = match.status === 'live' ? '🔴 EN DIRECT' : 
                       match.status === 'finished' ? 'TERMINÉ' : 'À VENIR';
    
    const scoreDisplay = match.status === 'upcoming' ? '- : -' : 
                         `${match.score1} - ${match.score2}`;

    return `
        <div class="match-card ${isLive ? 'live' : ''}">
            <div class="match-status ${statusClass}">${statusText}</div>
            <div class="match-teams">
                <div class="team">
                    <div class="team-flag">${t1.flag}</div>
                    <div class="team-name">${t1.name}</div>
                </div>
                <div class="vs">
                    <div class="score">${scoreDisplay}</div>
                </div>
                <div class="team">
                    <div class="team-flag">${t2.flag}</div>
                    <div class="team-name">${t2.name}</div>
                </div>
            </div>
            <div class="match-info">
                📅 ${new Date(match.date).toLocaleDateString('fr-FR')} | 
                🕐 ${match.time} | 
                📍 ${match.venue} | 
                ${match.group ? `Groupe ${match.group}` : match.phase.toUpperCase()}
            </div>
        </div>
    `;
}

function renderMatchRow(match) {
    const t1 = teams[match.team1] || { name: match.team1, flag: '🏳️' };
    const t2 = teams[match.team2] || { name: match.team2, flag: '🏳️' };
    
    return `
        <div class="match-row" data-phase="${match.phase}">
            <div class="match-time">${match.time}</div>
            <div class="team-cell">
                <span class="flag">${t1.flag}</span>
                <span>${t1.name}</span>
            </div>
            <div class="score" style="text-align:center;font-weight:900;">
                ${match.status === 'upcoming' ? '- : -' : `${match.score1} - ${match.score2}`}
            </div>
            <div class="team-cell" style="justify-content:flex-end;">
                <span>${t2.name}</span>
                <span class="flag">${t2.flag}</span>
            </div>
            <div class="match-phase">${match.phase === 'group' ? `Grp ${match.group}` : match.phase}</div>
        </div>
    `;
}

// Affichage des matchs du jour
function renderTodayMatches() {
    const today = new Date().toISOString().split('T')[0];
    const todayMatches = matches.filter(m => m.date === today);
    const container = document.getElementById('today-matches');
    
    if (todayMatches.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#888;">Aucun match aujourd\'hui. Prochains matchs bientôt !</p>';
        return;
    }
    
    container.innerHTML = todayMatches.map(renderMatchCard).join('');
}

// Affichage de tous les matchs
function renderAllMatches(filter = 'all') {
    const container = document.getElementById('all-matches');
    let filtered = matches;
    
    if (filter !== 'all') {
        filtered = matches.filter(m => m.phase === filter);
    }
    
    container.innerHTML = filtered.map(renderMatchRow).join('');
}

// Affichage des groupes
function renderGroups() {
    const container = document.getElementById('groups-container');
    
    container.innerHTML = Object.entries(groups).map(([groupName, teamCodes]) => {
        const groupTeams = teamCodes.map(code => {
            const t = teams[code] || { name: code, flag: '🏳️' };
            return { ...t, code, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, pts: 0 };
        }).sort((a, b) => b.pts - a.pts);
        
        return `
            <div class="group-card">
                <div class="group-title">Groupe ${groupName}</div>
                <table class="group-table">
                    <thead>
                        <tr>
                            <th>Équipe</th>
                            <th>MJ</th>
                            <th>G</th>
                            <th>N</th>
                            <th>P</th>
                            <th>BP</th>
                            <th>BC</th>
                            <th>Pts</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${groupTeams.map(t => `
                            <tr>
                                <td class="team-cell">
                                    <span class="flag">${t.flag}</span>
                                    <span>${t.name}</span>
                                </td>
                                <td>${t.played}</td>
                                <td>${t.won}</td>
                                <td>${t.drawn}</td>
                                <td
