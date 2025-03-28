export const benchmarks = [
  {
    id: 'benchmark-hellen',
    tipo: 'Benchmark',
    titulo: 'Hellen',
    tempo: 'For Time',
    descricao: 'For time:',
    exercicios: [
      { nome: 'Run', series: 3, repeticoes: 1, distancia: '400m' },
      { nome: 'Kettlebell Swings', series: 21, repeticoes: 1 },
      { nome: 'Pull-ups', series: 12, repeticoes: 1 }
    ],
    pesos: {
      feminino: '35-lb (16-kg) Kettlebell',
      masculino: '53-lb (24-kg) Kettlebell'
    },
    editavel: false
  },
  {
    id: 'benchmark-fran',
    tipo: 'Benchmark',
    titulo: 'Fran',
    tempo: 'For Time',
    descricao: 'For time:',
    exercicios: [
      { nome: 'Thrusters', series: 1, repeticoes: 1, formato: '21-15-9' },
      { nome: 'Pull-Ups', series: 1, repeticoes: 1, formato: '21-15-9' }
    ],
    pesos: {
      feminino: '65-lb (29-kg)',
      masculino: '95-lb (43-kg)'
    },
    editavel: false
  },
  {
    id: 'benchmark-murph',
    tipo: 'Benchmark',
    titulo: 'Murph',
    tempo: 'For Time',
    descricao: 'For time:',
    exercicios: [
      { nome: 'Run', series: 1, repeticoes: 1, distancia: '1600m' },
      { nome: 'Pull-ups', series: 100, repeticoes: 1 },
      { nome: 'Push-ups', series: 200, repeticoes: 1 },
      { nome: 'Air Squats', series: 300, repeticoes: 1 },
      { nome: 'Run', series: 1, repeticoes: 1, distancia: '1600m' }
    ],
    pesos: {
      feminino: '14-lb (6-kg)',
      masculino: '20-lb (9-kg)'
    },
    instrucoes: 'Partition the pull-ups, push-ups, and squats as needed. If you\'ve got a vest or body armor, wear it.',
    editavel: false
  },
  {
    id: 'benchmark-helen',
    tipo: 'Benchmark',
    titulo: 'Helen',
    exercicios: [
      { nome: 'Corrida', series: 1, repeticoes: 1, distancia: '400m' },
      { nome: 'Kettlebell Swings (53lb/24kg)', series: 21, repeticoes: 1 },
      { nome: 'Pull-ups', series: 12, repeticoes: 1 }
    ],
    editavel: false
  },
  {
    id: 'benchmark-grace',
    tipo: 'Benchmark',
    titulo: 'Grace',
    exercicios: [
      { nome: 'Clean and Jerk (135lb/61kg)', series: 30, repeticoes: 1 }
    ],
    editavel: false
  },
  {
    id: 'benchmark-cindy',
    tipo: 'Benchmark',
    titulo: 'Cindy',
    exercicios: [
      { nome: 'Pull-ups', series: 5, repeticoes: 1 },
      { nome: 'Push-ups', series: 10, repeticoes: 1 },
      { nome: 'Air Squats', series: 15, repeticoes: 1 }
    ],
    editavel: false
  },
  {
    id: 'benchmark-annie',
    tipo: 'Benchmark',
    titulo: 'Annie',
    exercicios: [
      { nome: 'Double Unders', series: 50, repeticoes: 1 },
      { nome: 'Sit-ups', series: 50, repeticoes: 1 },
      { nome: 'Double Unders', series: 40, repeticoes: 1 },
      { nome: 'Sit-ups', series: 40, repeticoes: 1 },
      { nome: 'Double Unders', series: 30, repeticoes: 1 },
      { nome: 'Sit-ups', series: 30, repeticoes: 1 },
      { nome: 'Double Unders', series: 20, repeticoes: 1 },
      { nome: 'Sit-ups', series: 20, repeticoes: 1 },
      { nome: 'Double Unders', series: 10, repeticoes: 1 },
      { nome: 'Sit-ups', series: 10, repeticoes: 1 }
    ],
    editavel: false
  },
  {
    id: 'benchmark-angie',
    tipo: 'Benchmark',
    titulo: 'Angie',
    exercicios: [
      { nome: 'Pull-ups', series: 100, repeticoes: 1 },
      { nome: 'Push-ups', series: 100, repeticoes: 1 },
      { nome: 'Sit-ups', series: 100, repeticoes: 1 },
      { nome: 'Squats', series: 100, repeticoes: 1 }
    ],
    editavel: false
  },
  {
    id: 'benchmark-jackie',
    tipo: 'Benchmark',
    titulo: 'Jackie',
    exercicios: [
      { nome: 'Row (Calorias)', series: 1000, repeticoes: 1 },
      { nome: 'Thrusters (45lb/20kg)', series: 50, repeticoes: 1 },
      { nome: 'Pull-ups', series: 30, repeticoes: 1 }
    ],
    editavel: false
  },
  {
    id: 'benchmark-diane',
    tipo: 'Benchmark',
    titulo: 'Diane',
    exercicios: [
      { nome: 'Deadlift (225lb/102kg)', series: 21, repeticoes: 1 },
      { nome: 'Handstand Push-ups', series: 21, repeticoes: 1 },
      { nome: 'Deadlift (225lb/102kg)', series: 15, repeticoes: 1 },
      { nome: 'Handstand Push-ups', series: 15, repeticoes: 1 },
      { nome: 'Deadlift (225lb/102kg)', series: 9, repeticoes: 1 },
      { nome: 'Handstand Push-ups', series: 9, repeticoes: 1 }
    ],
    editavel: false
  }
]; 