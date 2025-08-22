// This module provides functions to fetch activity data.
// It includes mock data for development and a real API endpoint for production.

export type Activity = {
    id: string;
    type: string;
    startTime: string; // ISO string format
    durationMin: number;
    distanceKm: number;
    preview: string;
  };
  
  const MOCK_DATA: Activity[] = [
    {
      id: 'a-001',
      type: 'Football',
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(), // ~yesterday
      durationMin: 95,
      distanceKm: 32.4,
      preview: 'Game time',
    },
    {
      id: 'a-002',
      type: 'Basketball',
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 49).toISOString(), // 2 days ago
      durationMin: 30,
      distanceKm: 6.1,
      preview: 'Little basketball training.',
    },
    {
      id: 'a-003',
      type: 'Walk',
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(), // 3 days ago
      durationMin: 50,
      distanceKm: 2.1,
      preview: 'Quick lunchtime walk.',
    },
    {
      id: 'a-004',
      type: 'Football',
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
      durationMin: 43,
      distanceKm: 22.4,
      preview: 'Training time',
    },
    {
      id: 'a-005',
      type: 'Basketball',
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 54).toISOString(), 
      durationMin: 60,
      distanceKm: 7.1,
      preview: 'Basketball game.',
    },
    {
      id: 'a-006',
      type: 'Football',
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 200).toISOString(), 
      durationMin: 40,
      distanceKm: 10.1,
      preview: 'Football game.',
    },
  ];
  
  // Toggle this to false when wiring a real backend
  const USE_MOCK = true;
  const BASE_URL = 'https://api.example.com'; // <- replace later
  
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  export async function fetchActivities(): Promise<Activity[]> {
    if (USE_MOCK) {
      await sleep(400); // simulate latency
      return MOCK_DATA;
    }
    const res = await fetch(`${BASE_URL}/activities`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }
  
  export async function fetchActivityById(id?: string): Promise<Activity | undefined> {
    if (!id) return undefined;
    if (USE_MOCK) {
      await sleep(200); // simulate latency
      return MOCK_DATA.find((activity) => activity.id === id);
    }
    const res = await fetch(`${BASE_URL}/activities/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }