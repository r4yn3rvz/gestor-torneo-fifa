<template>
  <div class="panel registration-panel">
    <h2>Inscripción de Equipos</h2>
    <p v-if="teams.length === 0" class="empty-state">No hay equipos inscritos aún.</p>
    
    <ul class="team-list" v-else>
      <li v-for="team in teams" :key="team.id" class="team-item">
        <span class="team-name">{{ team.name }}</span>
        <button class="delete-btn" @click="handleRemove(team.id)" title="Eliminar">&times;</button>
      </li>
    </ul>

    <form @submit.prevent="handleAdd" class="add-form">
      <input 
        type="text" 
        v-model="newTeamName" 
        placeholder="Nombre del equipo/Jugador" 
        required 
        maxlength="30"
      />
      <button type="submit" class="primary">+</button>
    </form>

    <div class="actions" v-if="teams.length >= 2">
      <button class="primary full-width" @click="handleStart">🎮 Iniciar Torneo ({{ teams.length }} Equipos)</button>
    </div>
    <p v-else class="hint">Añade al menos 2 equipos para comenzar.</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { store, addTeam, removeTeam, startTournament } from '../services/store';

const newTeamName = ref('');

const teams = computed(() => store.teams);

const handleAdd = () => {
  if (newTeamName.value.trim()) {
    addTeam(newTeamName.value.trim());
    newTeamName.value = '';
  }
};

const handleRemove = (id) => {
  removeTeam(id);
};

const handleStart = () => {
  startTournament();
};
</script>

<style scoped>
.registration-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.empty-state, .hint {
  color: var(--text-dim);
  font-style: italic;
  font-size: 0.9rem;
}
.team-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;
}
.team-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.8rem 1rem;
  border-radius: 8px;
  border-left: 3px solid var(--neon-green);
}
.team-name {
  font-weight: 600;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}
.delete-btn {
  background: transparent;
  border: none;
  color: #ff3333;
  font-size: 1.5rem;
  padding: 0 0.5rem;
  font-family: sans-serif;
}
.delete-btn:hover {
  transform: scale(1.2);
  box-shadow: none;
}
.add-form {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
.add-form input {
  flex: 1;
}
.add-form button {
  padding: 0.8rem 1.2rem;
  font-size: 1.5rem;
  line-height: 1;
}
.full-width {
  width: 100%;
  margin-top: 1rem;
}
</style>
