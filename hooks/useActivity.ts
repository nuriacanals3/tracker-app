import { Activity, fetchActivityById } from '@/lib/api/activities';
import { useEffect, useState } from 'react';

// This file defines a custom hook to fetch and manage a single activity by ID.

export function useActivity(id?: string) {
    const [data, setData] = useState<Activity | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);
  
    useEffect(() => {
      let cancelled = false;
      (async () => {
        setLoading(true);
        setError(null);
        try {
          const item = await fetchActivityById(id);
          if (!cancelled) setData(item);
        } catch (e) {
          if (!cancelled) setError(e);
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
      return () => { cancelled = true; };
    }, [id]);
  
    return { data, loading, error } as const;
  }