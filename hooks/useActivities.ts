import { Activity, fetchActivities } from '@/lib/api/activities';
import { useCallback, useEffect, useState } from 'react';

// This file defines a custom hook to fetch and manage activities data.

export function useActivities() {
  const [data, setData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchActivities();
      setData(list);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, refresh: load } as const;
}