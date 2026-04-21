<template>
  <div>
    <h1><span style="color: var(--neon-green)">FIFA</span> TOURNAMENT MANAGER</h1>
    
    <div class="dashboard">
      <!-- Sección Izquierda: Inscripciones (si el torneo no ha iniciado) o Partidos (si ya inició) -->
      <div class="left-col">
        <Registration v-if="!isTournamentStarted" />
        <MatchList v-else />
      </div>
      
      <!-- Sección Derecha: Tabla de posiciones -->
      <div class="right-col">
        <StandingsTable />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { store } from './services/store';
import Registration from './components/Registration.vue';
import MatchList from './components/MatchList.vue';
import StandingsTable from './components/StandingsTable.vue';

const isTournamentStarted = computed(() => store.isTournamentStarted);
</script>

<style scoped>
/* App layout wrapper is handled in main.css via .dashboard */
</style>
