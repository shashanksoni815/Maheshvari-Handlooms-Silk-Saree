import React from 'react';
import { Search, ChevronLeft, ChevronRight, Edit, Trash2, Eye } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface AdminDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSearch?: (term: string) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  isLoading?: boolean;
  searchPlaceholder?: string;
}

export function AdminDataTable<T extends { _id: string }>({
  data,
  columns,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onSearch,
  onEdit,
  onDelete,
  onView,
  isLoading,
  searchPlaceholder = 'Search...'
}: AdminDataTableProps<T>) {
  
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="bg-white rounded-md shadow-sm border border-supporting/50">
      {/* Toolbar */}
      <div className="p-4 border-b border-supporting/50 flex justify-between items-center bg-gray-50/50">
        <div className="relative w-72">
          {onSearch && (
            <>
              <input
                type="text"
                placeholder={searchPlaceholder}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-supporting rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-primary/5 text-primary">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className={`px-6 py-4 font-semibold tracking-wide uppercase text-xs ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete || onView) && (
                <th className="px-6 py-4 font-semibold tracking-wide uppercase text-xs text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-supporting/50">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-muted">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-muted">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row._id} className="hover:bg-gray-50/50 transition-colors">
                  {columns.map((col, idx) => (
                    <td key={idx} className={`px-6 py-4 whitespace-nowrap ${col.className || ''}`}>
                      {typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <td className="px-6 py-4 text-right space-x-2">
                      {onView && (
                        <button onClick={() => onView(row)} className="text-primary hover:text-accent p-1 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {onEdit && (
                        <button onClick={() => onEdit(row)} className="text-primary hover:text-accent p-1 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(row)} className="text-red-500 hover:text-red-700 p-1 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-supporting/50 flex items-center justify-between text-sm text-muted">
          <div>
            Showing <span className="font-medium text-primary">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-medium text-primary">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
            <span className="font-medium text-primary">{totalCount}</span> results
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-3 py-1 font-medium text-primary">{currentPage} / {totalPages}</span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
