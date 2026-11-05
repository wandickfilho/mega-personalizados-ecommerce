'use client';

import { useEffect, useState } from 'react';
import { getStoreOpeningStatus, type StoreOpeningState } from '@/lib/storeOpeningHours';
import { cn } from '@/lib/utils';

interface StoreOpeningStatusProps {
  className?: string;
}

export default function StoreOpeningStatus({ className }: StoreOpeningStatusProps) {
  const [status, setStatus] = useState<StoreOpeningState | null>(null);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const update = () => {
      const next = getStoreOpeningStatus();
      setStatus((current) =>
        current?.isOpen === next.isOpen && current.detail === next.detail ? current : next
      );
    };

    const startUpdates = () => {
      update();
      const millisecondsToNextMinute = 60_000 - (Date.now() % 60_000);
      timeoutId = setTimeout(() => {
        update();
        intervalId = setInterval(update, 60_000);
      }, millisecondsToNextMinute);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') update();
    };

    startUpdates();
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  if (!status) {
    return <span className={cn('store-opening-status store-opening-status-pending', className)}>Consultando horário...</span>;
  }

  return (
    <span className={cn('store-opening-status', status.isOpen ? 'store-opening-status-open' : 'store-opening-status-closed', className)}>
      <span className="store-opening-status-dot" aria-hidden />
      <span><strong>{status.label}</strong><span className="store-opening-status-detail">{status.detail}</span></span>
    </span>
  );
}
