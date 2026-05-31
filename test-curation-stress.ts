import { generateBespokeRoute } from './utils/curationEngine';
import { Destination } from '@shared/travel-rules';
import * as fs from 'fs';
import * as path from 'path';

// ── Load Data ──
const destinations: Destination[] = JSON.parse(fs.readFileSync(path.join(__dirname, 'prisma', 'data.json'), 'utf-8'));
const edgesPath = path.join(__dirname, 'generated-edges-audit.json');
const transitRoutes = fs.existsSync(edgesPath) ? JSON.parse(fs.readFileSync(edgesPath, 'utf-8')) : [];

console.log(`Loaded ${destinations.length} destinations, ${transitRoutes.length} transit edges.\n`);

// ── Test Matrix ──
const months = ['January', 'March', 'June', 'August', 'November'];
const landscapeCombos = [
  ['Deserts'],
  ['Mountains'],
  ['Beaches', 'Islands'],
  ['Forests', 'Wildlife'],
  ['Mountains', 'Deserts'],
  ['Beaches', 'Mountains', 'Forests'],
  [], // no filter
];
const vibeCombos = [
  ['Luxury', 'Regal', 'Exclusive'],
  ['Authentic', 'Cultural', 'Scenic'],
  ['Remote', 'Untouched', 'Raw'],
  ['Historic', 'Iconic'],
  [], // no vibes
];
const dayOptions = [5, 7, 10, 14, 21];

let totalTests = 0;
let passed = 0;
let failed = 0;
const failures: string[] = [];
const results: Array<{
  label: string;
  ids: string[];
  names: string[];
  days: number;
  count: number;
  rationale: string;
}> = [];

for (const month of months) {
  for (const landscapes of landscapeCombos) {
    for (const vibes of vibeCombos) {
      for (const days of dayOptions) {
        totalTests++;
        const label = `${month} | ${days}d | L:[${landscapes.join(',')}] | V:[${vibes.join(',')}]`;

        try {
          const result = generateBespokeRoute(
            { travelMonth: month, selectedLandscapes: landscapes, selectedVibes: vibes, days },
            destinations,
            transitRoutes
          );

          const ids = result.destinationIds;
          const names = ids.map((id: string) => destinations.find(d => d.id === id)?.name || '???');

          // ── Assertions ──
          const errors: string[] = [];

          // 1. Must return at least 1 destination
          if (ids.length === 0) errors.push('EMPTY: returned 0 destinations');

          // 2. No duplicate IDs
          const uniqueIds = new Set(ids);
          if (uniqueIds.size !== ids.length) errors.push(`DUPES: ${ids.length - uniqueIds.size} duplicate IDs`);

          // 3. Total minRequiredDays should not vastly exceed the trip length
          const totalMinDays = ids.reduce((sum: number, id: string) => {
            const d = destinations.find(x => x.id === id);
            return sum + (d?.minRequiredDays || 2);
          }, 0);
          if (totalMinDays > days * 1.5) {
            errors.push(`OVERPACKED: ${totalMinDays} min days for a ${days}-day trip`);
          }

          // 4. Rationale should not be empty
          if (!result.rationale || result.rationale.length < 20) {
            errors.push('BAD_RATIONALE: too short or empty');
          }

          // 5. Vibe diversity check: no more than 60% of destinations should share the exact same primary vibe tag
          if (ids.length >= 3) {
            const vibeFreq: Record<string, number> = {};
            for (const id of ids) {
              const d = destinations.find(x => x.id === id);
              d?.vibeTags?.forEach(v => { vibeFreq[v] = (vibeFreq[v] || 0) + 1; });
            }
            const maxVibeFreq = Math.max(...Object.values(vibeFreq));
            if (maxVibeFreq > ids.length * 0.8) {
              errors.push(`LOW_DIVERSITY: vibe "${Object.entries(vibeFreq).find(([,v]) => v === maxVibeFreq)?.[0]}" appears in ${maxVibeFreq}/${ids.length} destinations`);
            }
          }

          if (errors.length > 0) {
            failed++;
            failures.push(`❌ ${label}\n   ${errors.join('\n   ')}\n   Route: ${names.join(' → ')}`);
          } else {
            passed++;
          }

          results.push({ label, ids, names, days, count: ids.length, rationale: result.rationale });

        } catch (err: any) {
          failed++;
          failures.push(`💥 ${label}\n   CRASH: ${err.message}`);
        }
      }
    }
  }
}

// ── Summary Report ──
console.log('═'.repeat(80));
console.log(`CURATION ENGINE V2 — STRESS TEST REPORT`);
console.log('═'.repeat(80));
console.log(`Total Tests:  ${totalTests}`);
console.log(`✅ Passed:    ${passed}`);
console.log(`❌ Failed:    ${failed}`);
console.log(`Pass Rate:    ${((passed / totalTests) * 100).toFixed(1)}%`);
console.log('═'.repeat(80));

if (failures.length > 0) {
  console.log('\n── FAILURES ──');
  failures.forEach(f => console.log(f));
  console.log('');
}

// ── Distribution Analysis ──
console.log('\n── DESTINATION COUNT DISTRIBUTION ──');
const countDist: Record<number, number> = {};
results.forEach(r => { countDist[r.count] = (countDist[r.count] || 0) + 1; });
Object.entries(countDist).sort(([a],[b]) => +a - +b).forEach(([count, freq]) => {
  const bar = '█'.repeat(Math.ceil(freq / 2));
  console.log(`  ${count} destinations: ${bar} (${freq} tests)`);
});

// ── Pacing Analysis ──
console.log('\n── PACING CHECK (avg destinations per day-range) ──');
for (const dayVal of dayOptions) {
  const subset = results.filter(r => r.days === dayVal);
  const avgCount = subset.reduce((s, r) => s + r.count, 0) / subset.length;
  console.log(`  ${dayVal}-day trips → avg ${avgCount.toFixed(1)} destinations`);
}

// ── Sample Routes (one per month) ──
console.log('\n── SAMPLE ROUTES ──');
for (const month of months) {
  const sample = results.find(r => r.label.startsWith(month) && r.days === 14);
  if (sample) {
    console.log(`\n  📅 ${sample.label}`);
    console.log(`     Route: ${sample.names.join(' → ')}`);
    console.log(`     Rationale: "${sample.rationale}"`);
  }
}

console.log('\n' + '═'.repeat(80));
console.log('Done.');
