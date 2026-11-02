import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'jobguard_scan_history_v1';

// Seed realistic sample items if storage is totally empty so dashboard is immediately rich & informative
const SEED_DATA = [
  {
    id: 'seed-1',
    timestamp: Date.now() - 1000 * 60 * 60 * 26, // 26 hrs ago
    title: 'Data Entry Assistant - Urgent Remote',
    company_profile: 'Fast growing global crypto trading firm with instant hiring.',
    employment_type: 'Full-time',
    required_experience: 'Entry level',
    required_education: 'High School or equivalent',
    telecommuting: 1,
    has_company_logo: 0,
    has_questions: 0,
    probability: 0.94,
    isFraud: true,
    verdict: 'Likely fake'
  },
  {
    id: 'seed-2',
    timestamp: Date.now() - 1000 * 60 * 60 * 18, // 18 hrs ago
    title: 'Senior Systems Architect (Distributed Cloud)',
    company_profile: 'Tier 1 enterprise cloud provider scaling infrastructure.',
    employment_type: 'Full-time',
    required_experience: 'Mid-Senior level',
    required_education: "Bachelor's Degree",
    telecommuting: 1,
    has_company_logo: 1,
    has_questions: 1,
    probability: 0.04,
    isFraud: false,
    verdict: 'Likely genuine'
  },
  {
    id: 'seed-3',
    timestamp: Date.now() - 1000 * 60 * 60 * 9, // 9 hrs ago
    title: 'Virtual Assistant / Check Processor',
    company_profile: 'Private family wealth office seeking wire transfer coordinator.',
    employment_type: 'Part-time',
    required_experience: 'Internship',
    required_education: 'Unspecified',
    telecommuting: 1,
    has_company_logo: 0,
    has_questions: 0,
    probability: 0.88,
    isFraud: true,
    verdict: 'Likely fake'
  },
  {
    id: 'seed-4',
    timestamp: Date.now() - 1000 * 60 * 60 * 3, // 3 hrs ago
    title: 'Frontend React Engineer - Platform UI',
    company_profile: 'Established fintech product organization founded in 2017.',
    employment_type: 'Full-time',
    required_experience: 'Mid-Senior level',
    required_education: "Bachelor's Degree",
    telecommuting: 1,
    has_company_logo: 1,
    has_questions: 1,
    probability: 0.08,
    isFraud: false,
    verdict: 'Likely genuine'
  }
];

export function useScanHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Initialize with seed data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
      return SEED_DATA;
    } catch (e) {
      console.warn('Unable to access localStorage, using memory storage', e);
      return SEED_DATA;
    }
  });

  const saveHistory = useCallback((newHistory) => {
    setHistory(newHistory);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to persist scan history in localStorage', e);
    }
  }, []);

  const addScan = useCallback((scanRecord) => {
    const item = {
      id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
      verdict: scanRecord.isFraud ? 'Likely fake' : 'Likely genuine',
      ...scanRecord
    };

    setHistory((prev) => {
      const updated = [item, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save scan to localStorage', e);
      }
      return updated;
    });

    return item;
  }, []);

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear history from localStorage', e);
    }
    setHistory([]);
  }, []);

  const deleteScan = useCallback((id) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to delete scan from localStorage', e);
      }
      return updated;
    });
  }, []);

  // Computed KPIs
  const totalScans = history.length;
  const fraudCount = history.filter((h) => h.isFraud).length;
  const fraudRate = totalScans > 0 ? (fraudCount / totalScans) * 100 : 0;
  const avgProbability =
    totalScans > 0
      ? (history.reduce((sum, h) => sum + (h.probability || 0), 0) / totalScans) * 100
      : 0;
  const lastScan = history.length > 0 ? history[0].timestamp : null;

  return {
    history,
    addScan,
    clearHistory,
    deleteScan,
    stats: {
      totalScans,
      fraudCount,
      genuineCount: totalScans - fraudCount,
      fraudRate: Math.round(fraudRate * 10) / 10,
      avgProbability: Math.round(avgProbability * 10) / 10,
      lastScan
    }
  };
}
