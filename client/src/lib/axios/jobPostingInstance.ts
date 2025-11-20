import type { ApiResponse, JobPostingData, JobResponse } from "../types/JobPostingType";
import client from "./axios"; 

export const jobApi = {
  createJob: async (jobData: JobPostingData): Promise<ApiResponse<JobResponse>> => {
    try {
      console.log('Creating job with data:', jobData);
      
      let requestData: FormData | any;
      let headers: any = {};
      
      if (jobData.document) {
        // Use FormData for file uploads
        requestData = new FormData();
        
        // Add all job fields to FormData
        Object.keys(jobData).forEach(key => {
          if (key !== 'document' && jobData[key as keyof JobPostingData]) {
            requestData.append(key, jobData[key as keyof JobPostingData] as string);
          }
        });
        
        // Add the file
        requestData.append('document', jobData.document);
        
        // Set content type for multipart/form-data
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        // No file, send as JSON
        requestData = jobData;
        headers['Content-Type'] = 'application/json';
      }
      
      const response = await client.post('/jobs', requestData, { headers });
      
      console.log('Raw API Response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      return response.data as ApiResponse<JobResponse>;
    } catch (error: any) {
      console.error('Error creating job:', error);
      console.error('Error response:', error.response?.data);
      
      // Check if this is actually a successful response disguised as an error
      if (error.response && error.response.data && error.response.data.success === true) {
        console.log('This was actually successful despite being in catch block');
        return error.response.data as ApiResponse<JobResponse>;
      }
      
      throw error;
    }
  },

  // Save job as draft - UPDATED to support file uploads
  saveDraft: async (jobData: JobPostingData): Promise<ApiResponse<JobResponse>> => {
    try {
      console.log('Saving draft with data:', jobData);
      
      // Create FormData if there's a file, otherwise send JSON
      let requestData: FormData | any;
      let headers: any = {};
      
      if (jobData.document) {
        // Use FormData for file uploads
        requestData = new FormData();
        
        // Add all job fields to FormData
        Object.keys(jobData).forEach(key => {
          if (key !== 'document' && jobData[key as keyof JobPostingData]) {
            requestData.append(key, jobData[key as keyof JobPostingData] as string);
          }
        });
        
        // Add the file
        requestData.append('document', jobData.document);
        
        // Set content type for multipart/form-data
        headers['Content-Type'] = 'multipart/form-data';
      } else {
        // No file, send as JSON
        requestData = {
          ...jobData,
          status: 'draft'
        };
        headers['Content-Type'] = 'application/json';
      }
      
      const response = await client.post<ApiResponse<JobResponse>>('/jobs/draft', requestData, { headers });
      console.log('Save draft response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error saving draft:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Get user's jobs - Updated to handle "load all" scenario
  getMyJobs: async (params?: {
    status?: string;
    page?: number;
    limit?: number;
    loadAll?: boolean; // New parameter to load all jobs
  }): Promise<ApiResponse<JobResponse[]>> => {
    try {
      console.log('Fetching my jobs with params:', params);
      
      // If loadAll is true, don't send pagination parameters
      let queryParams = {};
      
      if (params?.loadAll) {
        // Only send status filter, no pagination
        if (params.status) {
          queryParams = { status: params.status };
        }
        console.log('Loading all jobs without pagination');
      } else {
        // Include pagination parameters
        queryParams = {
          ...(params?.status && { status: params.status }),
          ...(params?.page && { page: params.page }),
          ...(params?.limit && { limit: params.limit })
        };
      }
      
      const response = await client.get<ApiResponse<JobResponse[]>>('/jobs/my-jobs', {
        params: queryParams
      });
      
      console.log('My jobs response:', response.data);
      console.log('Response status:', response.status);
      console.log('Jobs count:', response.data.data?.length || 0);
      
      // Validate response structure
      if (typeof response.data !== 'object' || response.data === null) {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format from server');
      }
      
      // Check if we got HTML instead of JSON - Fix the type error
      if (typeof response.data === 'string' && (response.data as string).includes('<!doctype')) {
        console.error('Received HTML response instead of JSON');
        throw new Error('Server returned HTML instead of JSON - check your API endpoint and authentication');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching my jobs:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Enhanced error handling for HTML responses - Fix the type error
      if (error.response?.data && 
          typeof error.response.data === 'string' && 
          (error.response.data as string).includes('<!doctype')) {
        throw new Error('Authentication failed or endpoint not found');
      }
      
      throw error;
    }
  },

  // New method specifically for loading all jobs without pagination
  getAllMyJobs: async (status?: string): Promise<ApiResponse<JobResponse[]>> => {
    try {
      console.log('Fetching ALL my jobs without pagination, status:', status);
      
      const params: any = {};
      if (status) {
        params.status = status;
      }
      
      // Use the new endpoint that guarantees all results
      const response = await client.get<ApiResponse<JobResponse[]>>('/jobs/my-jobs/all', {
        params
      });
      
      console.log('All my jobs response:', response.data);
      console.log('Total jobs loaded:', response.data.data?.length || 0);
      
      return response.data;
    } catch (error: any) {
      console.error('Error fetching all my jobs:', error);
      throw error;
    }
  },

  // Get all jobs (public)
  getAllJobs: async (params?: {
    page?: number;
    limit?: number;
    workplaceType?: string;
    jobType?: string;
    location?: string;
    companyName?: string;
  }): Promise<ApiResponse<JobResponse[]>> => {
    try {
      const response = await client.get<ApiResponse<JobResponse[]>>('/jobs', {
        params: params || {}
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching all jobs:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

// Updated API methods in lib/api.ts

// Get paginated user jobs - UPDATED to support status filtering
getMyJobsPaginated: async (page: number = 1, limit: number = 10, status?: string): Promise<ApiResponse<JobResponse[]>> => {
  try {
    console.log(`API: Fetching my jobs - page ${page}, limit ${limit}, status: ${status || 'all'}`);
    
    const params: any = { page, limit };
    if (status) {
      params.status = status;
    }
    
    const response = await client.get<ApiResponse<JobResponse[]>>('/jobs/my-jobs', {
      params
    });
    
    console.log('API: Paginated my jobs response:', response.data);
    console.log('API: Response status:', response.status);
    console.log('API: Jobs count:', response.data.data?.length || 0);
    console.log('API: Pagination info:', response.data.pagination);
    
    return response.data;
  } catch (error: any) {
    console.error('API: Error fetching paginated my jobs:', error);
    console.error('API: Error response:', error.response?.data);
    throw error;
  }
},

// NEW: Get job status counts
getJobStatusCounts: async (): Promise<ApiResponse<{all: number, published: number, draft: number}>> => {
  try {
    console.log('API: Fetching job status counts');
    
    const response = await client.get<ApiResponse<{all: number, published: number, draft: number}>>('/jobs/my-jobs/counts');
    
    console.log('API: Status counts response:', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('API: Error fetching status counts:', error);
    console.error('API: Error response:', error.response?.data);
    throw error;
  }
},

  // Get job by ID
  getJobById: async (jobId: string): Promise<ApiResponse<JobResponse>> => {
    try {
      const response = await client.get<ApiResponse<JobResponse>>(`/jobs/${jobId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching job by ID:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Update job
  updateJob: async (jobId: string, jobData: JobPostingData): Promise<ApiResponse<JobResponse>> => {
    try {
      const formData = new FormData();
      
      // Add all job fields to FormData
      Object.keys(jobData).forEach(key => {
        if (key !== 'document' && jobData[key as keyof JobPostingData]) {
          formData.append(key, jobData[key as keyof JobPostingData] as string);
        }
      });
      
      // Add file if selected
      if (jobData.document) {
        formData.append('document', jobData.document);
      }
      
      const response = await client.put<ApiResponse<JobResponse>>(`/jobs/${jobId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error updating job:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Delete job
  deleteJob: async (jobId: string): Promise<ApiResponse<{ message: string }>> => {
    try {
      const response = await client.delete<ApiResponse<{ message: string }>>(`/jobs/${jobId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error deleting job:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  }
};