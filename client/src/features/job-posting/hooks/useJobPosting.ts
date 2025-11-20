import { useState } from 'react';
import type { JobPostingData, JobResponse } from '../../../lib/types/JobPostingType';
import { jobApi } from '../../../lib/axios/jobPostingInstance';

export interface UseJobPostingReturn {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  publishJob: (jobData: JobPostingData) => Promise<JobResponse | null>;
  saveDraft: (jobData: JobPostingData) => Promise<JobResponse | null>;
  fetchMyJobs: (loadAll?: boolean) => Promise<JobResponse[]>;
  fetchMyJobsPaginated: (page?: number, limit?: number, status?: string) => Promise<{ jobs: JobResponse[], pagination: any }>; // UPDATED
  getJobById: (jobId: string) => Promise<JobResponse | null>;
  updateJob: (jobId: string, jobData: JobPostingData) => Promise<JobResponse | null>;
  deleteJob: (jobId: string) => Promise<boolean>;
  getJobStatusCounts: () => Promise<{all: number, published: number, draft: number} | null>; // NEW
  clearMessages: () => void;
}




export const useJobPosting = (): UseJobPostingReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };


  const publishJob = async (jobData: JobPostingData): Promise<JobResponse | null> => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('Publishing job:', jobData);
      const response = await jobApi.createJob(jobData);
      
      console.log('Publish job response:', response);
      console.log('Response type:', typeof response);
      console.log('Response success property:', response.success);
      console.log('Response job property:', response.job);
      
      if (response && response.success === true) {
        const jobData = response.job;
        const message = response.message || 'Job posted successfully!';
        
        setSuccess(message);
        console.log('Job published successfully:', jobData);
        return jobData || null;
      } else {
        console.error('Response success is not true:', response);
        const errorMessage = response?.message || 'Job creation failed';
        setError(errorMessage);
        return null;
      }
    } catch (err: any) {
      console.error('Publish job error:', err);
      
      if (err.response && err.response.data && err.response.data.success === true) {
        console.log('Job was actually created successfully despite error:', err.response.data);
        setSuccess(err.response.data.message || 'Job posted successfully!');
        return err.response.data.job;
      }
      
      console.error('Error status:', err.response?.status);
      console.error('Error data:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to publish job';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

const getJobStatusCounts = async (): Promise<{all: number, published: number, draft: number} | null> => {
  try {
    const response = await jobApi.getJobStatusCounts();
    
    if (response && response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error: any) {
    console.error('Failed to fetch status counts:', error);
    setError('Failed to load job counts');
    return null;
  }
};

  const saveDraft = async (jobData: JobPostingData): Promise<JobResponse | null> => { // UPDATED: now accepts JobPostingData with document
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('Saving draft:', jobData);
      const response = await jobApi.saveDraft(jobData); // UPDATED: now passes full jobData including document
      
      console.log('Save draft response:', response);
      console.log('Response success:', response?.success);
      console.log('Response message:', response?.message);
      console.log('Response job:', response?.job);
      
      if (response && response.success === true) {
        const message = response.message || 'Draft saved successfully!';
        const jobData = response.job;
        
        setSuccess(message);
        console.log('Draft saved successfully:', jobData);
        return jobData || null;
      } else {
        console.error('Response success is not true:', response);
        const errorMessage = response?.message || 'Failed to save draft';
        setError(errorMessage);
        return null;
      }
    } catch (err: any) {
      console.error('Save draft error:', err);
      
      if (err.response && err.response.data) {
        const responseData = err.response.data;
        console.log('Error response data:', responseData);
        
        if (responseData.success === true) {
          console.log('Draft was actually saved successfully despite error:', responseData);
          setSuccess(responseData.message || 'Draft saved successfully!');
          return responseData.job;
        }
      }
      
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save draft';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };


const fetchMyJobs = async (loadAll: boolean = true): Promise<JobResponse[]> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching my jobs, loadAll:', loadAll);
      
      // Use the new getAllMyJobs method to load all jobs without pagination
      const response = await jobApi.getAllMyJobs();
      
      console.log('Fetch my jobs response:', response);
      
      if (response && response.success && response.data) {
        console.log('Successfully fetched all jobs:', response.data.length);
        return Array.isArray(response.data) ? response.data : [];
      } else {
        console.warn('Invalid response format:', response);
        const errorMessage = response?.message || 'Failed to fetch jobs - invalid response format';
        setError(errorMessage);
        return [];
      }
    } catch (err: any) {
      console.error('Fetch my jobs error:', err);
      
      let errorMessage = 'Failed to fetch jobs';
      
      if (err.message === 'Authentication failed or endpoint not found') {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
      } else if (err.response?.status === 404) {
        errorMessage = 'API endpoint not found. Please check your server configuration.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  };


const fetchMyJobsPaginated = async (page: number = 1, limit: number = 50, status?: string): Promise<{ jobs: JobResponse[], pagination: any }> => {
  setIsLoading(true);
  setError(null);

  try {
    console.log(`Fetching my jobs - page ${page}, limit ${limit}, status: ${status || 'all'}`);
    
    const response = await jobApi.getMyJobsPaginated(page, limit, status);
    
    console.log('Fetch paginated jobs response:', response);
    
    if (response && response.success && response.data) {
      console.log('Successfully fetched paginated jobs:', response.data.length);
      return {
        jobs: Array.isArray(response.data) ? response.data : [],
        pagination: response.pagination || {
          currentPage: page,
          totalPages: 1,
          totalJobs: response.data.length,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    } else {
      console.warn('Invalid response format:', response);
      const errorMessage = response?.message || 'Failed to fetch jobs - invalid response format';
      setError(errorMessage);
      return { jobs: [], pagination: {} };
    }
  } catch (err: any) {
    console.error('Fetch paginated jobs error:', err);
    
    let errorMessage = 'Failed to fetch jobs';
    
    if (err.response?.status === 401) {
      errorMessage = 'Your session has expired. Please log in again.';
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    setError(errorMessage);
    return { jobs: [], pagination: {} };
  } finally {
    setIsLoading(false);
  }
};



  const getJobById = async (jobId: string): Promise<JobResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching job by ID:', jobId);
      const response = await jobApi.getJobById(jobId);
      
      console.log('Get job by ID API response:', response);
      console.log('Response success:', response?.success);
      console.log('Response data:', response?.data);
      
      // Your backend returns { success: true, data: job }
      if (response && response.success && response.data) {
        console.log('Job data found:', response.data);
        console.log('Document file in response:', response.data.documentFile);
        return response.data;
      }
      
      console.error('Invalid response format or no data:', response);
      const errorMessage = response?.message || 'Failed to fetch job details - no data in response';
      setError(errorMessage);
      return null;
    } catch (err: any) {
      console.error('Get job by ID error:', err);
      
      let errorMessage = 'Failed to fetch job details';
      
      if (err.response?.status === 404) {
        errorMessage = 'Job not found';
      } else if (err.response?.status === 401) {
        errorMessage = 'You are not authorized to view this job';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateJob = async (jobId: string, jobData: JobPostingData): Promise<JobResponse | null> => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('Updating job:', jobId, jobData);
      const response = await jobApi.updateJob(jobId, jobData);
      
      console.log('Update job response:', response);
      
      // Check for both possible response formats
      if (response && response.success === true) {
        const jobData = response.job || response.data;
        const message = response.message || 'Job updated successfully!';
        
        setSuccess(message);
        return jobData || null;
      } else {
        const errorMessage = response?.message || 'Failed to update job';
        setError(errorMessage);
        return null;
      }
    } catch (err: any) {
      console.error('Update job error:', err);
      
      // Check if the error response actually contains success data
      if (err.response && err.response.data && err.response.data.success === true) {
        console.log('Job was actually updated successfully despite error:', err.response.data);
        setSuccess(err.response.data.message || 'Job updated successfully!');
        return err.response.data.job || err.response.data.data;
      }
      
      let errorMessage = 'Failed to update job';
      
      if (err.response?.status === 404) {
        errorMessage = 'Job not found';
      } else if (err.response?.status === 401) {
        errorMessage = 'You are not authorized to edit this job';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteJob = async (jobId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('Deleting job:', jobId);
      const response = await jobApi.deleteJob(jobId);
      
      console.log('Delete job response:', response);
      
      if (response.success) {
        setSuccess(response.message || 'Job deleted successfully!');
        return true;
      } else {
        const errorMessage = response.message || 'Failed to delete job';
        setError(errorMessage);
        return false;
      }
    } catch (err: any) {
      console.error('Delete job error:', err);
      
      let errorMessage = 'Failed to delete job';
      
      if (err.response?.status === 404) {
        errorMessage = 'Job not found';
      } else if (err.response?.status === 401) {
        errorMessage = 'You are not authorized to delete this job';
      } else if (err.response?.status === 403) {
        errorMessage = 'You do not have permission to delete this job';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

return {
  isLoading,
  error,
  success,
  publishJob,
  saveDraft,
  fetchMyJobs,
  fetchMyJobsPaginated,
  getJobById,
  updateJob,
  deleteJob,
  getJobStatusCounts, // NEW
  clearMessages
};
}