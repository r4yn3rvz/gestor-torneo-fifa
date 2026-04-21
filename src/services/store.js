import { reactive, watch } from 'vue';

// Estado simulando la base de datos (se puede persistir en localStorage)
const initialState = {
  teams: [], // { id, name }
  playedMatches: [], // [{ id, t1, t2, score1, score2, date }]
  isTournamentStarted: false,
};

// Cargar desde localStorage si existe
const savedState = JSON.parse(localStorage.getItem('fifa_tournament_db'));

export const store = reactive((savedState && Array.isArray(savedState.playedMatches)) ? savedState : initialState);

// Persistir estado en localStorage cada vez que cambie
watch(store, (newState) => {
  localStorage.setItem('fifa_tournament_db', JSON.stringify(newState));
}, { deep: true });

// --- MÉTODOS DEL SERVICIO --- //

export function addTeam(name) {
  if (store.isTournamentStarted) return;
  store.teams.push({
    id: Date.now().toString(),
    name
  });
}

export function removeTeam(id) {
  if (store.isTournamentStarted) return;
  store.teams = store.teams.filter(t => t.id !== id);
}

export function startTournament() {
  if (store.teams.length >= 2) {
    store.isTournamentStarted = true;
  }
}

export function resetTournament() {
  if (confirm("¿Estás seguro de eliminar todo el torneo?")) {
    store.teams = [];
    store.playedMatches = [];
    store.isTournamentStarted = false;
    localStorage.removeItem('fifa_tournament_db');
  }
}

// Agregar un partido manual jugado
export function recordMatch(t1, t2, score1, score2) {
  const s1 = parseInt(score1);
  const s2 = parseInt(score2);
  
  if (isNaN(s1) || isNaN(s2) || t1 === t2) return false;
  
  // Agregar al historial
  store.playedMatches.unshift({ // unshift para que el más reciente aparezca arriba
    id: Date.now().toString(),
    t1,
    t2,
    score1: s1,
    score2: s2,
    date: new Date().toISOString()
  });
  
  return true;
}

// Calcular lista de enfrentamientos pendientes (Round Robin)
export function getPendingMatches() {
  const pending = [];
  const teams = store.teams;
  
  // Combinatoria de N en 2 (Todos contra todos)
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const teamA = teams[i];
      const teamB = teams[j];
      
      // Verificar si este partido ya se jugó (en cualquier orden: A vs B o B vs A)
      const hasPlayed = store.playedMatches.some(m => 
        (m.t1 === teamA.id && m.t2 === teamB.id) ||
        (m.t1 === teamB.id && m.t2 === teamA.id)
      );
      
      if (!hasPlayed) {
        pending.push({
          t1: teamA.id,
          t2: teamB.id,
          t1Name: teamA.name,
          t2Name: teamB.name
        });
      }
    }
  }
  
  return pending;
}

// Calculador de tabla de posiciones dinámica
export function getStandings() {
  const standingsTable = {};

  // Inicializar la tabla
  store.teams.forEach(team => {
    standingsTable[team.id] = {
      ...team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0, 
      gc: 0, 
      dg: 0, 
      points: 0
    };
  });

  // Procesar partidos del historial
  store.playedMatches.forEach(m => {
    const team1 = standingsTable[m.t1];
    const team2 = standingsTable[m.t2];

    if (team1 && team2) {
      team1.played++;
      team2.played++;
      
      team1.gf += m.score1;
      team1.gc += m.score2;
      team2.gf += m.score2;
      team2.gc += m.score1;

      if (m.score1 > m.score2) {
        team1.won++;
        team2.lost++;
        team1.points += 3;
      } else if (m.score1 < m.score2) {
        team2.won++;
        team1.lost++;
        team2.points += 3;
      } else {
        team1.drawn++;
        team2.drawn++;
        team1.points += 1;
        team2.points += 1;
      }
    }
  });

  // Calcular diferencia de gol para todos
  Object.values(standingsTable).forEach(team => {
    team.dg = team.gf - team.gc;
  });

  // Ordenar: Puntos > Diferencia de Goles > Goles a Favor > Nombre
  return Object.values(standingsTable).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.dg !== a.dg) return b.dg - a.dg;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.name.localeCompare(b.name);
  });
}

export function getTeamName(teamId) {
  const team = store.teams.find(t => t.id === teamId);
  return team ? team.name : 'Desconocido';
}
