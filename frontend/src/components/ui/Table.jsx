import { useMemo, useState } from 'react';

export function Table({ columns, data }) {
  const [page, setPage] = useState(0);
  const pageSize = 6;

  const totalPages = Math.ceil(data.length / pageSize) || 1;

  const visibleRows = useMemo(() => {
    const start = page * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white/80 shadow-sm">
      <div className="overflow-x-auto overflow-y-visible scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
        <table className="min-w-full text-sm whitespace-nowrap">
          <thead className="bg-slate-50/80 sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.accessor}
                  className="px-3 sm:px-4 py-2 text-left text-xs font-semibold text-slate-500 whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row, idx) => (
              <tr
                key={idx}
                className="border-t border-slate-100/80 hover:bg-slate-50/60 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.accessor}
                    className="px-3 sm:px-4 py-2 text-slate-700 text-xs sm:text-sm whitespace-nowrap"
                  >
                    {col.cell ? col.cell(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
            {visibleRows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-xs text-slate-400"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-3 sm:px-4 py-3 border-t border-slate-100 bg-white/70 text-xs text-slate-500">
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="px-3 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

