import { useState, useCallback, useEffect } from 'react';
import { ReadingRecord } from '../types';

const STORAGE_KEY = 'tarot-reading-history';
const MAX_RECORDS = 50;

function loadRecords(): ReadingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveRecords(records: ReadingRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // localStorage full — ignore
  }
}

export function useReadingHistory() {
  const [records, setRecords] = useState<ReadingRecord[]>(loadRecords);

  // Reload from storage on mount
  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  const saveReading = useCallback((data: Omit<ReadingRecord, 'id' | 'timestamp'>) => {
    const record: ReadingRecord = {
      ...data,
      id: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
      timestamp: Date.now(),
    };
    setRecords(prev => {
      const updated = [record, ...prev].slice(0, MAX_RECORDS);
      saveRecords(updated);
      return updated;
    });
    return record;
  }, []);

  const deleteReading = useCallback((id: string) => {
    setRecords(prev => {
      const updated = prev.filter(r => r.id !== id);
      saveRecords(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setRecords([]);
    saveRecords([]);
  }, []);

  return { records, saveReading, deleteReading, clearAll };
}
