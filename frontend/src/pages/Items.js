import React, { useEffect, useMemo, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';

function Items() {
  const { items, meta, fetchItems } = useData();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    const controller = new AbortController();
    fetchItems({ page, pageSize, q, signal: controller.signal }).catch(console.error);
    return () => controller.abort();
  }, [fetchItems, page, pageSize, q]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((meta?.total || 0) / pageSize));
  }, [meta, pageSize]);

  const onSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const disablePrev = page <= 1;
  const disableNext = page >= totalPages;

  if (!items.length && (meta?.total ?? 0) === 0) return <p>No results</p>;

  return (
    <div className="container" style={{ padding: 0 }}>
      <form onSubmit={onSubmit} className="toolbar">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search..."
          aria-label="Search items"
        />
        <select value={pageSize} onChange={e => { setPageSize(parseInt(e.target.value, 10)); setPage(1); }}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <button type="button" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={disablePrev}>Prev</button>
        <span>Page {page} / {totalPages}</span>
        <button type="button" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={disableNext}>Next</button>
      </form>
      <List
        height={600}
        itemCount={items.length}
        itemSize={48}
        width={'100%'}
      >
        {({ index, style }) => {
          const item = items[index];
          return (
            <div style={style} className="row">
              <Link to={'/items/' + item.id}>{item.name}</Link>
            </div>
          );
        }}
      </List>
    </div>
  );
}

export default Items;