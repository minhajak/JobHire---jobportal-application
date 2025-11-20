// src/features/job-posting/components/Pagination.tsx

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange, 
  loading 
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);
      
      if (currentPage <= 3) {
        start = 1;
        end = maxVisible;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - maxVisible + 1;
        end = totalPages;
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="bg-white border-t border-gray-100 px-4 sm:px-6 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm sm:text-base text-gray-600 order-2 sm:order-1">
          Showing {startItem}-{endItem} of {totalItems} jobs
        </p>
        
        <div className="flex items-center justify-center sm:justify-end space-x-1 sm:space-x-2 order-1 sm:order-2">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || loading}
            className="p-2 sm:p-3 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:hover:text-gray-400 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronsLeft className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>
          
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="p-2 sm:p-3 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:hover:text-gray-400 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>

          <div className="flex items-center space-x-1 sm:space-x-2 mx-2 sm:mx-4">
            {getVisiblePages().map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                disabled={loading}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium rounded-xl transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed ${
                  page === currentPage
                    ? 'bg-blue-500 text-white cursor-default'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="p-2 sm:p-3 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:hover:text-gray-400 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>
          
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || loading}
            className="p-2 sm:p-3 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:hover:text-gray-400 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronsRight className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;