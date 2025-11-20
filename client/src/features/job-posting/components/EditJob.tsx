// features/job-posting/components/EditJob.tsx - Updated with better responsive design
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Briefcase, ArrowLeft, CheckCircle, X, Send } from 'lucide-react';
import { useJobPosting } from '../hooks/useJobPosting';
import type { JobFormData, JobPostingData } from '../../../lib/types/JobPostingType';

const EditJob: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { isLoading, error, success, getJobById, updateJob, clearMessages } = useJobPosting();

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [jobStatus, setJobStatus] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [formData, setFormData] = useState<JobFormData>({
    jobTitle: '',
    companyName: '',
    aboutCompany: '',
    workplaceType: '',
    jobLocation: '',
    jobType: '',
    jobDescription: '',
    requirements: '',
    documentTitle: ''
  });

  const [privacyOption, setPrivacyOption] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [document, setDocument] = useState<File | null>(null);
  const [currentDocumentName, setCurrentDocumentName] = useState<string>('');

  useEffect(() => {
    if (jobId) {
      loadJobData();
    }
  }, [jobId]);

  // Handle success message display as toast
  useEffect(() => {
    if (success) {
      setShowSuccessToast(true);
      // Auto-hide toast after 4 seconds
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
        clearMessages();
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [success, clearMessages]);

  const loadJobData = async () => {
    if (!jobId) return;
    
    try {
      setIsInitialLoading(true);
      const jobData = await getJobById(jobId);
      
      console.log('Response from getJobById hook:', jobData);
      
      if (jobData) {
        console.log('Job data received:', jobData);
        console.log('Job status:', jobData.status);
        console.log('Document file property:', jobData.documentFile);
        
        // Set job status for conditional rendering
        setJobStatus(jobData.status || '');
        
        setFormData({
          jobTitle: jobData.jobTitle || '',
          companyName: jobData.companyName || '',
          aboutCompany: jobData.aboutCompany || '',
          workplaceType: jobData.workplaceType || '',
          jobLocation: jobData.jobLocation || '',
          jobType: jobData.jobType || '',
          jobDescription: jobData.jobDescription || '',
          requirements: jobData.requirements || '',
          documentTitle: jobData.documentTitle || ''
        });
        
        setPrivacyOption(jobData.privacyOption || 'anyone');
        setSelectedStyle(jobData.selectedStyle || 'manual');
        
        // Handle document file name - check multiple possible structures
        let documentName = '';
        console.log('Processing document file:', jobData.documentFile);
        
        if (jobData.documentFile) {
          if (jobData.documentFile.originalName) {
            documentName = jobData.documentFile.originalName;
            console.log('Found originalName:', documentName);
          } else if (jobData.documentFile.filename) {
            documentName = jobData.documentFile.filename;
            console.log('Found filename:', documentName);
          } else {
            console.log('No recognizable filename property found in:', jobData.documentFile);
          }
        } else {
          console.log('No documentFile property found');
        }
        
        setCurrentDocumentName(documentName);
        console.log('Final document name set:', documentName);
        console.log('Form data set successfully');
      } else {
        console.error('No job data received from getJobById hook');
      }
    } catch (err) {
      console.error('Failed to load job data:', err);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setDocument(file);
  };

  const validateRequiredFields = (): string | null => {
    const requiredFields = [
      { key: 'jobTitle', label: 'Job Title' },
      { key: 'companyName', label: 'Company Name' },
      { key: 'workplaceType', label: 'Workplace Type' },
      { key: 'jobType', label: 'Job Type' },
      { key: 'jobLocation', label: 'Job Location' }
    ];

    const missingFields = requiredFields.filter(field => 
      !formData[field.key as keyof JobFormData]?.trim()
    );

    if (missingFields.length > 0) {
      return `Please fill in the following required fields: ${missingFields.map(f => f.label).join(', ')}`;
    }

    return null;
  };

  const handleUpdateJob = async () => {
    if (!jobId) return;

    const jobPostingData: JobPostingData = {
      ...formData,
      privacyOption,
      selectedStyle,
      document: document || undefined
    };

    const updatedJob = await updateJob(jobId, jobPostingData);
    if (updatedJob) {
      // Navigate back to my jobs after successful update (delayed for user to see toast)
      setTimeout(() => {
        navigate('/my-jobs');
      }, 2500);
    }
  };

  const handlePublishDraft = async () => {
    if (!jobId) return;

    // Validate required fields before publishing
    const validationError = validateRequiredFields();
    if (validationError) {
      // You might want to show this as an error message or toast
      alert(validationError); // Simple alert for now, you can enhance this
      return;
    }

    try {
      setIsPublishing(true);
      
      const jobPostingData: JobPostingData = {
        ...formData,
        privacyOption,
        selectedStyle,
        document: document || undefined
      };

      // First update the job with current form data and change status to published
      const updatedJobData = {
        ...jobPostingData,
        status: 'published' // Key change: explicitly set status to published
      };

      // Use updateJob to change the draft to published status
      const updatedJob = await updateJob(jobId, updatedJobData);
      
      if (updatedJob) {
        // Update local status to reflect the published state
        setJobStatus('published');
        
        // Navigate back to my jobs after successful publish (delayed for user to see toast)
        setTimeout(() => {
          navigate('/my-jobs');
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to publish draft:', error);
    } finally {
      // Always reset publishing state regardless of hook's loading state
      setIsPublishing(false);
    }
  };

  const handleGoBack = () => {
    navigate('/my-jobs');
  };

  const closeSuccessToast = () => {
    setShowSuccessToast(false);
    clearMessages();
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!jobId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">Invalid job ID</p>
          <button 
            onClick={handleGoBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Toast Notification - Enhanced */}
      {showSuccessToast && success && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-green-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-lg border border-green-400">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-100 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-xs sm:text-sm">Success!</p>
                <p className="text-xs sm:text-sm text-green-50 mt-0.5 break-words">{success}</p>
              </div>
              <button
                onClick={closeSuccessToast}
                className="text-green-100 hover:text-white transition-colors flex-shrink-0 cursor-pointer"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header - Improved responsive design */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={handleGoBack}
                className="p-2 sm:p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">Edit Job</h1>
                  {jobStatus === 'draft' && (
                    <p className="text-xs sm:text-sm text-amber-600 font-medium">Draft Job</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Action Buttons - Better responsive layout */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {jobStatus === 'draft' && (
                <button
                  onClick={handlePublishDraft}
                  disabled={isLoading || isPublishing}
                  className="px-3 py-2 sm:px-4 bg-green-600 text-white text-xs sm:text-sm font-medium rounded-2xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 sm:space-x-2 cursor-pointer shadow-sm"
                >
                  {isPublishing ? (
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {isPublishing ? 'Publishing...' : 'Publish Job'}
                  </span>
                  <span className="sm:hidden">
                    {isPublishing ? 'Publishing...' : 'Publish'}
                  </span>
                </button>
              )}
              
              <button
                onClick={handleUpdateJob}
                disabled={isLoading && !isPublishing}
                className="px-3 py-2 sm:px-6 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 sm:space-x-2 cursor-pointer shadow-sm"
              >
                {(isLoading && !isPublishing) && (
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{(isLoading && !isPublishing) ? 'Updating...' : 'Update Job'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Better responsive layout */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Error Message Only - Success messages are shown as toast only */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl mb-6 sm:mb-8 flex items-center justify-between">
            <p className="text-sm font-medium">{error}</p>
            <button 
              onClick={clearMessages}
              className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 cursor-pointer flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Draft Status Banner - Enhanced */}
        {jobStatus === 'draft' && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                <p className="text-sm sm:text-base text-amber-800">
                  <span className="font-medium">Draft Job:</span> This job is not yet published and won't be visible to candidates.
                </p>
              </div>
              <button
                onClick={handlePublishDraft}
                disabled={isPublishing}
                className="text-amber-700 hover:text-amber-900 font-medium text-sm underline disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer self-start sm:self-center flex-shrink-0"
              >
                Publish Now
              </button>
            </div>
          </div>
        )}

        <form className="space-y-6 sm:space-y-8">
          {/* Job Title & Company - Enhanced responsive design */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Job Title & Company</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2 cursor-default">
                  Job Title *
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-text transition-all"
                  placeholder="e.g. Software Engineer"
                  required
                />
              </div>

              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2 cursor-default">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-text transition-all"
                  placeholder="e.g. Tech Company Inc."
                  required
                />
              </div>
            </div>

            <div className="mt-4 sm:mt-6">
              <label htmlFor="aboutCompany" className="block text-sm font-medium text-gray-700 mb-2 cursor-default">
                About Company
              </label>
              <textarea
                id="aboutCompany"
                name="aboutCompany"
                value={formData.aboutCompany}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none cursor-text transition-all"
                placeholder="Tell us about your company..."
              />
            </div>
          </div>

          {/* Job Basic Information - Enhanced grid layout */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Job Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label htmlFor="workplaceType" className="block text-sm font-medium text-gray-700 mb-2 cursor-default">
                  Workplace Type *
                </label>
                <select
                  id="workplaceType"
                  name="workplaceType"
                  value={formData.workplaceType}
                  onChange={handleInputChange}
                  className="cursor-pointer w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                >
                  <option value="">Select workplace type</option>
                  <option value="remote">Remote</option>
                  <option value="onsite">On-site</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-2 cursor-default">
                  Job Type *
                </label>
                <select
                  id="jobType"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleInputChange}
                  className="cursor-pointer w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                >
                  <option value="">Select job type</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-1">
                <label htmlFor="jobLocation" className="block text-sm font-medium text-gray-700 mb-2 cursor-default">
                  Job Location *
                </label>
                <input
                  type="text"
                  id="jobLocation"
                  name="jobLocation"
                  value={formData.jobLocation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-text transition-all"
                  placeholder="e.g. San Francisco, CA"
                  required
                />
              </div>
            </div>
          </div>

          {/* Job Description - Enhanced textarea design */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Job Description</h2>
            
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2 cursor-default">
                  Job Description
                </label>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none cursor-text transition-all"
                  placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                />
              </div>

              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2 cursor-default">
                  Requirements
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none cursor-text transition-all"
                  placeholder="List the required skills, experience, education, etc..."
                />
              </div>
            </div>
          </div>

          {/* Document Upload - Enhanced design */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Additional Document</h2>
            
            <div>
              <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-2 cursor-default">
                Upload Document
              </label>
              {currentDocumentName && (
                <div className="mb-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                  <div className="text-xs sm:text-sm text-blue-800">
                    <span className="font-medium">Current document:</span> 
                    <span className="break-all ml-1">{currentDocumentName}</span>
                  </div>
                </div>
              )}
              <input
                type="file"
                id="document"
                name="document"
                onChange={handleFileChange}
                className="cursor-pointer w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                accept=".pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.ppt,.pptx"
              />
              <p className="mt-2 text-xs sm:text-sm text-gray-500">
                {currentDocumentName ? 'Upload a new file to replace the current document' : 'Accepted formats: PDF, DOC, DOCX, etc. (Max 10MB)'}
              </p>
            </div>
          </div>

          {/* Privacy & Style Options - Enhanced grid */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Privacy & Style</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="privacyOption" className="block text-sm font-medium text-gray-700 mb-2 cursor-default">
                  Privacy Option
                </label>
                <select
                  id="privacyOption"
                  name="privacyOption"
                  value={privacyOption}
                  onChange={(e) => setPrivacyOption(e.target.value)}
                  className="cursor-pointer w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">Select privacy option</option>
                  <option value="anyone">Anyone</option>
                  <option value="connections">Connections Only</option>
                  <option value="unlisted">Unlisted</option>
                </select>
              </div>

              <div>
                <label htmlFor="selectedStyle" className="block text-sm font-medium text-gray-700 mb-2 cursor-default">
                  Display Style
                </label>
                <select
                  id="selectedStyle"
                  name="selectedStyle"
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="cursor-pointer w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">Select display style</option>
                  <option value="ai">AI Assisted</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons - Enhanced responsive layout */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center space-y-3 sm:space-y-0">
              <button
                type="button"
                onClick={handleGoBack}
                className="cursor-pointer px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 text-gray-700 font-medium rounded-2xl hover:bg-gray-50 transition-colors text-sm sm:text-base order-2 sm:order-1"
              >
                Cancel
              </button>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 order-1 sm:order-2">
                {jobStatus === 'draft' && (
                  <button
                    type="button"
                    onClick={handlePublishDraft}
                    disabled={isPublishing}
                    className="cursor-pointer px-4 py-2 sm:px-6 sm:py-3 bg-green-600 text-white text-sm sm:text-base font-medium rounded-2xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm"
                  >
                    {isPublishing ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>{isPublishing ? 'Publishing Job...' : 'Publish Job'}</span>
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={handleUpdateJob}
                  disabled={isLoading && !isPublishing}
                  className="cursor-pointer px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-sm"
                >
                  {(isLoading && !isPublishing) && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>{(isLoading && !isPublishing) ? 'Updating Job...' : 'Update Job'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditJob;