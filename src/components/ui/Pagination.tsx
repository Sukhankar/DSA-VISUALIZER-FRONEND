import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

interface PaginationProps {
  currentPage: number; // 1-indexed for display
  totalPages: number;
  onPageChange: (page: number) => void;
  totalElements?: number;
  pageSize?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalElements,
  pageSize = 12,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
        end = 4;
      } else if (currentPage >= totalPages - 1) {
        start = totalPages - 3;
      }

      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = totalElements ? Math.min(currentPage * pageSize, totalElements) : undefined;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-slate-800">
      {/* Items count summary */}
      <div className="text-xs text-slate-400">
        {totalElements !== undefined && endItem !== undefined ? (
          <span>
            Showing <strong className="text-slate-200">{startItem}</strong> to{' '}
            <strong className="text-slate-200">{endItem}</strong> of{' '}
            <strong className="text-slate-200">{totalElements}</strong> algorithms
          </span>
        ) : (
          <span>
            Page <strong className="text-slate-200">{currentPage}</strong> of{' '}
            <strong className="text-slate-200">{totalPages}</strong>
          </span>
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          leftIcon={<ChevronLeft className="w-4 h-4" />}
        >
          Prev
        </Button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (typeof page === 'string') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 text-xs text-slate-500 font-mono">
                  ...
                </span>
              );
            }

            const isCurrent = page === currentPage;
            return (
              <button
                key={`page-${page}`}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-500'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          rightIcon={<ChevronRight className="w-4 h-4" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
