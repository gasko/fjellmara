import { Race } from './race';

export const RACES: Race[] = [
  { id: 1, name: 'Fjällmaraton', year: 2017 },
  { id: 2, name: 'BUFF Bydalen 50K', year: 2017 },
  { id: 13, name: 'KIA Fjällmaradon', year: 2016  }
];

export const CHECKPOINTS_FJALLMARA: Checkpoint[] = [
  { name: 'start', distance: 0},
  { name: 'Ottfjället', distance:  770},
  { name: 'Nordbottnen', distance: 1550},
  { name: 'Hållfjället', distance: 2030},
  { name: 'Ottsjö', distance: 2810},
  { name: 'Välliste', distance: 3920},
  { name: 'Pre.Mål', distance: 4220},
  { name: 'Mål', distance: 4300}
];

export const CHECKPOINTS_27K: Checkpoint[] = [
  { name: 'start', distance: 0},
  { name: 'Hållfjället', distance: 1060},
  { name: 'Grofjället', distance: 1350},
  { name: 'Välliste', distance: 2210},
  { name: 'Pre.Mål', distance: 2650},
  { name: 'Mål', distance: 2700}
];
