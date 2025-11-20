// src/features/job-posting/components/MyJobs.tsx - Reduced font sizes

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useJobPosting } from '../hooks/useJobPosting';
import type { JobResponse } from '../../../lib/types/JobPostingType'
import Pagination from './Pagination';
import JobCard from './JobCard';

// Items per page selector component
const ItemsPerPageSelector: React.FC<{
  value: number;
  onChange: (value: number) => void;
  options: number[];
}> = ({ value, onChange, options }) => (
  <div className="flex items-center">
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white cursor-pointer text-gray-900"
      style={{
        color: '#111827'
      }}
    >
      {options.map((option) => (
        <option 
          key={option} 
          value={option}
          className="text-gray-900 bg-white"
          style={{
            color: '#111827',
            backgroundColor: '#ffffff'
          }}
        >
          {option}
        </option>
      ))}
    </select>
  </div>
);

const MyJobs: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'draft'>('all');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Status counts state to store total counts for each filter
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    published: 0,
    draft: 0
  });

  // Use the job posting hook
  const hookResult = useJobPosting();
  const { error, success, fetchMyJobsPaginated, clearMessages } = hookResult;
  const deleteJob = 'deleteJob' in hookResult ? hookResult.deleteJob : undefined;

  useEffect(() => {
    clearMessages();
    loadJobs();
    loadStatusCounts();
  }, []);

  // Load jobs when page, items per page, or filter changes
  useEffect(() => {
    loadJobs();
  }, [currentPage, itemsPerPage, filter]);

  // Only show success messages that originate from actions on this page
  useEffect(() => {
    if (success && (success.includes('deleted') || success.includes('Draft saved'))) {
      setLocalSuccess(success);
      const timer = setTimeout(() => {
        setLocalSuccess(null);
        clearMessages();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success, clearMessages]);

  // Function to load status counts using the dedicated API endpoint
  const loadStatusCounts = async () => {
    try {
      // Use the new getJobStatusCounts method if available
      if ('getJobStatusCounts' in hookResult && hookResult.getJobStatusCounts) {
        const counts = await hookResult.getJobStatusCounts();
        if (counts) {
          setStatusCounts(counts);
        }
      } else {
        // Fallback: Make separate calls for each status
        const [allResponse, publishedResponse, draftResponse] = await Promise.all([
          fetchMyJobsPaginated(1, 1), // Get first page to get total count
          fetchMyJobsPaginated(1, 1, 'published'), // Published jobs
          fetchMyJobsPaginated(1, 1, 'draft') // Draft jobs
        ]);

        setStatusCounts({
          all: allResponse?.pagination?.totalJobs || 0,
          published: publishedResponse?.pagination?.totalJobs || 0,
          draft: draftResponse?.pagination?.totalJobs || 0
        });
      }
    } catch (error) {
      console.error('Failed to load status counts:', error);
      // Keep existing counts on error
    }
  };

  const loadJobs = async () => {
    try {
      if (currentPage === 1) {
        setIsInitialLoading(true);
      } else {
        setIsLoading(true);
      }

      // Get status filter for API call
      let statusFilter: string | undefined;
      if (filter === 'active') statusFilter = 'published';
      else if (filter === 'draft') statusFilter = 'draft';

      // Pass status filter to API
      const response = await fetchMyJobsPaginated(currentPage, itemsPerPage, statusFilter);

      if (response && response.jobs) {
        setJobs(response.jobs);
        setPagination({
          totalPages: response.pagination?.totalPages || 1,
          currentPage: response.pagination?.currentPage || 1,
          hasNextPage: response.pagination?.hasNextPage || false,
          hasPrevPage: response.pagination?.hasPrevPage || false
        });
      } else {
        setJobs([]);
        setPagination({
          totalPages: 0,
          currentPage: 1,
          hasNextPage: false,
          hasPrevPage: false
        });
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
      setJobs([]);
    } finally {
      setIsInitialLoading(false);
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilter: 'all' | 'active' | 'draft') => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleEditJob = (jobId: string) => {
    navigate(`/jobs/edit/${jobId}`);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!deleteJob) return;
    
    try {
      const result = await deleteJob(jobId);
      if (result) {
        // Reload status counts after deletion
        await loadStatusCounts();
        
        if (jobs.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          await loadJobs();
        }
      }
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  const handlePostNewJob = () => {
    navigate('/jobs/post');
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop-style Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="w-full max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-2xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">My Jobs</h1>
                <p className="text-xs text-gray-500">{statusCounts.all} total jobs</p>
              </div>
            </div>

            <button
              onClick={handlePostNewJob}
              className="px-4 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-2xl hover:bg-blue-600 transition-colors flex items-center space-x-2 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Job</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl mx-auto px-6 py-6">
        {/* Success Message */}
        {localSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-2xl mb-6 flex items-center justify-between">
            <p className="text-sm font-medium">{localSuccess}</p>
            <button
              onClick={() => {
                setLocalSuccess(null);
                clearMessages();
              }}
              className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-2xl mb-6 flex items-center justify-between">
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={clearMessages}
              className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Controls Row - Fixed alignment with reduced font sizes */}
        <div className="flex items-center justify-between gap-4 mb-8">
          {/* Filter Pills - Left aligned with smaller text */}
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All', count: statusCounts.all },
              { key: 'active', label: 'Published', count: statusCounts.published },
              { key: 'draft', label: 'Drafts', count: statusCounts.draft },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleFilterChange(tab.key as any)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap flex items-center space-x-1 cursor-pointer ${
                  filter === tab.key
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-xs px-1 py-0.5 rounded-full font-semibold ${
                  filter === tab.key
                    ? 'bg-white text-blue-600'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Items per page selector - Right aligned */}
          <div className="flex-shrink-0">
            <ItemsPerPageSelector
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              options={[5, 10, 20, 50]}
            />
          </div>
        </div>

        {/* Jobs List - Desktop Card Style */}
        {isLoading && currentPage > 1 ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-base">Loading...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="bg-white rounded-3xl shadow-sm border p-16 max-w-md mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {filter === 'all' ? 'No jobs yet' : `No ${filter} jobs`}
              </h3>
              <p className="text-gray-600 mb-8 text-base">
                {filter === 'all'
                  ? 'Create your first job posting to get started.'
                  : `You don't have any ${filter} jobs at the moment.`}
              </p>
              {filter === 'all' && (
                <button
                  onClick={handlePostNewJob}
                  className="px-8 py-4 bg-blue-500 text-white font-semibold rounded-2xl hover:bg-blue-600 transition-colors cursor-pointer text-base"
                >
                  Post Your First Job
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-8">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onEdit={handleEditJob}
                  onDelete={handleDeleteJob}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={filter === 'all' ? statusCounts.all : (filter === 'active' ? statusCounts.published : statusCounts.draft)}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                loading={isLoading}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default MyJobs;