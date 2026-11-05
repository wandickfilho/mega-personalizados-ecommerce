export const STORE_TIME_ZONE = 'America/Fortaleza';

export const STORE_HOURS = {
  0: null,
  1: { opensAt: '08:00', closesAt: '17:30' },
  2: { opensAt: '08:00', closesAt: '17:30' },
  3: { opensAt: '08:00', closesAt: '17:30' },
  4: { opensAt: '08:00', closesAt: '17:30' },
  5: { opensAt: '08:00', closesAt: '17:30' },
  6: { opensAt: '08:00', closesAt: '12:00' },
} as const;

export const STORE_HOURS_DISPLAY = [
  { label: 'Segunda a sexta', hours: '08:00 às 17:30' },
  { label: 'Sábado', hours: '08:00 às 12:00' },
  { label: 'Domingo', hours: 'Fechado' },
] as const;
