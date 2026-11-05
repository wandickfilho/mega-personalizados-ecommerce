import { STORE_HOURS, STORE_TIME_ZONE } from '@/config/storeHours';

type DayOfWeek = keyof typeof STORE_HOURS;

export interface StoreOpeningState {
  isOpen: boolean;
  label: 'Aberto agora' | 'Fechado agora';
  detail: string;
}

const WEEKDAY_INDEX: Record<string, DayOfWeek> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

const WEEKDAY_LABEL: Record<DayOfWeek, string> = {
  0: 'domingo',
  1: 'segunda-feira',
  2: 'terça-feira',
  3: 'quarta-feira',
  4: 'quinta-feira',
  5: 'sexta-feira',
  6: 'sábado',
};

function getFortalezaTime(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: STORE_TIME_ZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  return {
    day: WEEKDAY_INDEX[value('weekday')],
    minutes: Number(value('hour')) * 60 + Number(value('minute')),
  };
}

function minutesFromTime(time: string) {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

/** Calculates the planned weekly schedule only. Future holiday exceptions can be added here. */
export function getStoreOpeningStatus(now = new Date()): StoreOpeningState {
  const current = getFortalezaTime(now);
  const todayHours = STORE_HOURS[current.day];

  if (
    todayHours &&
    current.minutes >= minutesFromTime(todayHours.opensAt) &&
    current.minutes < minutesFromTime(todayHours.closesAt)
  ) {
    return {
      isOpen: true,
      label: 'Aberto agora',
      detail: `Atendimento até às ${todayHours.closesAt}`,
    };
  }

  for (let offset = 0; offset < 7; offset += 1) {
    const candidate = getFortalezaTime(new Date(now.getTime() + offset * 86_400_000));
    const hours = STORE_HOURS[candidate.day];
    if (!hours || (offset === 0 && current.minutes >= minutesFromTime(hours.opensAt))) continue;

    const when =
      offset === 0
        ? 'hoje'
        : offset === 1 && current.day !== 0
          ? 'amanhã'
          : WEEKDAY_LABEL[candidate.day];
    return {
      isOpen: false,
      label: 'Fechado agora',
      detail: `Abre ${when} às ${hours.opensAt}`,
    };
  }

  return { isOpen: false, label: 'Fechado agora', detail: 'Consulte nossos horários' };
}
