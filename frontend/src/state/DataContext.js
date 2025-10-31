import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pageSize: 20, total: 0, q: '' });

  const fetchItems = useCallback(async ({ page = 1, pageSize = 20, q = '', signal } = {}) => {
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('pageSize', String(pageSize));
      if (q) params.set('q', q);
      const res = await fetch('http://localhost:3001/api/items?' + params.toString(), { signal });
      const json = await res.json(); // { items, page, pageSize, total }
      setItems(Array.isArray(json.items) ? json.items : []);
      setMeta({ page: json.page, pageSize: json.pageSize, total: json.total, q });
    } catch (err) {
      if (err && err.name === 'AbortError') return; // ignore aborted requests
      throw err;
    }
  }, []);

  return (
    <DataContext.Provider value={{ items, meta, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);