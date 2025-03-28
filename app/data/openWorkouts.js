export const openWorkouts = [
  {
    id: 'open-25.1',
    tipo: 'Open',
    titulo: 'Open 25.1',
    ano: 2025,
    tempo: '15 minutos',
    formato: 'AMRAP',
    descricao: 'As many rounds and reps as possible in 15 minutes of:',
    exercicios: [
      { nome: 'Lateral Burpees over the Dumbbell', series: 3, repeticoes: 1, incremento: 3 },
      { nome: 'Dumbbell Hang Clean-to-Overhead', series: 3, repeticoes: 1, incremento: 3 },
      { nome: 'Walking Lunge', series: 1, repeticoes: 1, distancia: '30ft (2 x 15ft)' }
    ],
    pesos: {
      feminino: '35-lb (15-kg) dumbbell',
      masculino: '50-lb (22.5-kg) dumbbell'
    },
    instrucoes: '*After completing each round, add 3 reps to the burpees and hang clean-to-overheads.',
    editavel: false
  },
  {
    id: 'open-25.2',
    tipo: 'Open',
    titulo: 'Open 25.2',
    ano: 2025,
    tempo: '12 minutos',
    formato: 'For Time',
    descricao: 'For time:',
    exercicios: [
      { nome: 'Pull-ups', series: 21, repeticoes: 1 },
      { nome: 'Double Unders', series: 42, repeticoes: 1 },
      { nome: 'Thrusters (weight 1)', series: 21, repeticoes: 1 },
      { nome: 'Chest-to-bar Pull-ups', series: 18, repeticoes: 1 },
      { nome: 'Double Unders', series: 36, repeticoes: 1 },
      { nome: 'Thrusters (weight 2)', series: 18, repeticoes: 1 },
      { nome: 'Bar Muscle-ups', series: 15, repeticoes: 1 },
      { nome: 'Double Unders', series: 30, repeticoes: 1 },
      { nome: 'Thrusters (weight 3)', series: 15, repeticoes: 1 }
    ],
    pesos: {
      feminino: '65, 75, 85 lb (29, 34, 38 kg)',
      masculino: '95, 115, 135 lb (43, 52, 61 kg)'
    },
    editavel: false
  },
  {
    id: 'open-25.3',
    tipo: 'Open',
    titulo: 'Open 25.3',
    ano: 2025,
    tempo: '20 minutos',
    formato: 'For Time',
    descricao: 'For time:',
    exercicios: [
      { nome: 'Wall Walks', series: 5, repeticoes: 1 },
      { nome: 'Row (Calorias)', series: 50, repeticoes: 1 },
      { nome: 'Wall Walks', series: 5, repeticoes: 1 },
      { nome: 'Deadlifts', series: 25, repeticoes: 1 },
      { nome: 'Wall Walks', series: 5, repeticoes: 1 },
      { nome: 'Cleans', series: 25, repeticoes: 1 },
      { nome: 'Wall Walks', series: 5, repeticoes: 1 },
      { nome: 'Snatches', series: 25, repeticoes: 1 },
      { nome: 'Wall Walks', series: 5, repeticoes: 1 },
      { nome: 'Row (Calorias)', series: 50, repeticoes: 1 }
    ],
    pesos: {
      feminino: '155-lb (70-kg) deadlift, 85-lb (38-kg) clean, 65-lb (29-kg) snatch',
      masculino: '225-lb (102-kg) deadlift, 135-lb (61-kg) clean, 95-lb (43-kg) snatch'
    },
    editavel: false
  },
  {
    id: 'open-24.3',
    tipo: 'Open',
    titulo: 'Open 24.3',
    ano: 2024,
    tempo: '15 minutos',
    formato: 'For Time',
    descricao: 'All for time:',
    exercicios: [
      { nome: 'Thrusters (weight 1)', series: 10, repeticoes: 1 },
      { nome: 'Chest-to-bar Pull-ups', series: 10, repeticoes: 1 },
      { nome: 'Rest', series: 1, repeticoes: 1, tempo: '1 minuto' },
      { nome: 'Thrusters (weight 2)', series: 7, repeticoes: 1 },
      { nome: 'Bar Muscle-ups', series: 7, repeticoes: 1 }
    ],
    pesos: {
      feminino: '65, 95 lb (29, 43 kg)',
      masculino: '95, 135 lb (43, 61 kg)'
    },
    editavel: false
  }
]; 