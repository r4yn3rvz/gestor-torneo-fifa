<template>
  <div class="panel standings-panel">
    <h2>🏆 Tabla de Posiciones</h2>
    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>Pos</th>
            <th class="text-left">Equipo</th>
            <th>PTS</th>
            <th>PJ</th>
            <th>G</th>
            <th>E</th>
            <th>P</th>
            <th>GF</th>
            <th>GC</th>
            <th>DG</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="(team, index) in standings" 
            :key="team.id"
            :class="{ 'top-team': index === 0 }"
          >
            <td class="rank">{{ index + 1 }}</td>
            <td class="text-left team-name">
              <span v-if="index === 0" class="crown">👑</span>
              {{ team.name }}
            </td>
            <td class="points">{{ team.points }}</td>
            <td>{{ team.played }}</td>
            <td>{{ team.won }}</td>
            <td>{{ team.drawn }}</td>
            <td>{{ team.lost }}</td>
            <td>{{ team.gf }}</td>
            <td>{{ team.gc }}</td>
            <td class="dg">{{ team.dg > 0 ? '+' + team.dg : team.dg }}</td>
          </tr>
          <tr v-if="standings.length === 0">
            <td colspan="10" class="empty">No hay datos disponibles.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getStandings } from '../services/store';

const standings = computed(() => getStandings());
</script>

<style scoped>
.standings-panel {
  overflow: hidden;
}
.table-responsive {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  font-size: 1rem;
}
th {
  background: rgba(0, 0, 0, 0.4);
  padding: 1rem 0.5rem;
  color: var(--text-dim);
  font-family: 'Teko', sans-serif;
  font-size: 1.2rem;
  letter-spacing: 1px;
}
td {
  padding: 0.8rem 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.text-left {
  text-align: left;
}
.rank {
  font-weight: 800;
  color: var(--text-dim);
}
.team-name {
  font-weight: 600;
  white-space: nowrap;
}
.points {
  font-weight: 800;
  color: var(--neon-green);
  font-size: 1.2rem;
}
.dg {
  color: #fff;
  font-weight: 600;
}
tbody tr {
  transition: background 0.2s ease;
}
tbody tr:hover {
  background: rgba(57, 255, 20, 0.05);
}
.top-team td {
  background: linear-gradient(90deg, rgba(57, 255, 20, 0.1) 0%, transparent 100%);
  border-bottom-color: var(--neon-green-dim);
}
.top-team .rank {
  color: var(--neon-green);
}
.crown {
  margin-right: 5px;
}
.empty {
  padding: 2rem;
  color: var(--text-dim);
  font-style: italic;
}
</style>
