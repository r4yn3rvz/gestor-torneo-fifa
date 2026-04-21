<template>
  <div class="panel match-panel">
    <div class="header">
      <h2>📅 Panel de Partidos</h2>
      <button class="danger small" @click="handleResetTournament">Reiniciar</button>
    </div>

    <!-- Sección 1: Anotar Resultado -->
    <div class="section new-match">
      <h3>⚽ Anotar Nuevo Resultado</h3>
      <form class="match-form" @submit.prevent="submitMatch">
        <div class="team-select-group">
          <select v-model="form.t1" required>
            <option value="" disabled>Equipo Local</option>
            <option v-for="team in teams" :key="team.id" :value="team.id">{{ team.name }}</option>
          </select>
          <input type="number" v-model.number="form.s1" min="0" required placeholder="Goles" class="score-input" />
        </div>
        
        <span class="vs">VS</span>

        <div class="team-select-group">
          <input type="number" v-model.number="form.s2" min="0" required placeholder="Goles" class="score-input" />
          <select v-model="form.t2" required>
            <option value="" disabled>Equipo Visitante</option>
            <option v-for="team in teams" :key="team.id" :value="team.id">{{ team.name }}</option>
          </select>
        </div>

        <button type="submit" class="primary log-btn" :disabled="!isValidForm">Anotar</button>
      </form>
    </div>

    <!-- Sección 2: Partidos Pendientes Sugeridos -->
    <div class="section pending-matches">
      <h3>⏳ Faltan por jugar</h3>
      <div v-if="pendingMatches.length === 0" class="empty-state">
        ¡Torneo finalizado! Ya se jugaron todos los cruces.
      </div>
      <div class="chip-list" v-else>
        <div class="chip" v-for="(p, index) in pendingMatches" :key="index" @click="prefillMatch(p.t1, p.t2)">
          {{ p.t1Name }} <span class="chip-vs">vs</span> {{ p.t2Name }}
        </div>
      </div>
    </div>

    <!-- Sección 3: Historial -->
    <div class="section history">
      <h3>📜 Historial Reciente</h3>
      <div v-if="playedMatches.length === 0" class="empty-state">
        Ningún partido registrado.
      </div>
      <ul class="history-list" v-else>
        <li class="history-item" v-for="match in playedMatches" :key="match.id">
          <span class="t1">{{ getTeamName(match.t1) }}</span>
          <span class="score badge">{{ match.score1 }} - {{ match.score2 }}</span>
          <span class="t2">{{ getTeamName(match.t2) }}</span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store, getTeamName, recordMatch, resetTournament, getPendingMatches } from '../services/store';

const teams = computed(() => store.teams);
const playedMatches = computed(() => store.playedMatches);
const pendingMatches = computed(() => getPendingMatches());

const form = ref({
  t1: '',
  t2: '',
  s1: null,
  s2: null
});

const isValidForm = computed(() => {
  return form.value.t1 && form.value.t2 && 
         form.value.t1 !== form.value.t2 && 
         form.value.s1 !== null && form.value.s2 !== null;
});

const submitMatch = () => {
  if (isValidForm.value) {
    const success = recordMatch(form.value.t1, form.value.t2, form.value.s1, form.value.s2);
    if (success) {
      // Limpiar form
      form.value.t1 = '';
      form.value.t2 = '';
      form.value.s1 = null;
      form.value.s2 = null;
    }
  }
};

const prefillMatch = (t1, t2) => {
  form.value.t1 = t1;
  form.value.t2 = t2;
  form.value.s1 = 0;
  form.value.s2 = 0;
};

const handleResetTournament = () => {
  resetTournament();
};
</script>

<style scoped>
.match-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--panel-border);
  padding-bottom: 0.5rem;
}
.small {
  font-size: 1rem;
  padding: 0.5rem 1rem;
}
h3 {
  font-size: 1.5rem;
  color: var(--neon-green);
  margin-bottom: 1rem;
}
.section {
  background: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 12px;
}
.match-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.team-select-group {
  display: flex;
  gap: 0.5rem;
}
select {
  flex: 1;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid var(--panel-border);
  color: white;
  padding: 0.8rem;
  border-radius: 8px;
  font-family: 'Outfit', sans-serif;
  outline: none;
}
select:focus {
  border-color: var(--neon-green);
}
.score-input {
  width: 70px;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
}
.vs {
  text-align: center;
  font-family: 'Teko', sans-serif;
  color: var(--text-dim);
  font-size: 1.5rem;
  margin: -0.5rem 0;
}
.log-btn {
  margin-top: 0.5rem;
}
.log-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: var(--text-dim);
  color: var(--text-dim);
}

.chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.chip {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.5rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}
.chip:hover {
  background: var(--neon-green-dim);
  border-color: var(--neon-green);
  color: white;
}
.chip-vs {
  color: var(--text-dim);
  font-size: 0.8rem;
  margin: 0 0.2rem;
}

.history-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
}
.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  background: rgba(0,0,0,0.4);
  border-radius: 8px;
  font-weight: 600;
}
.history-item .t1 { text-align: right; flex: 1; }
.history-item .t2 { text-align: left; flex: 1; }
.badge {
  background: var(--neon-green);
  color: black;
  padding: 0.2rem 0.8rem;
  border-radius: 12px;
  margin: 0 1rem;
  font-weight: 800;
  font-size: 1.1rem;
}
.empty-state {
  color: var(--text-dim);
  font-style: italic;
}
</style>
