// src/features/job-posting/components/JobPostingForm.tsx - Updated with navigation support

import React, { useState } from "react";
import { ArrowLeft, User, X, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useJobPosting } from "../hooks/useJobPosting";
import { validateForm, getModalIconType, getModalColors } from '../utils/helpers';
import JobFormSections from './JobFormSections';
import JobPreview from './JobPreview';

// Move types directly into this file to avoid import issues
interface FormData {
  jobTitle: string;
  companyName: string;
  aboutCompany: string;
  workplaceType: string;
  jobLocation: string;
  jobType: string;
  jobDescription: string;
  requirements: string;
  documentTitle: string;
}

type PrivacyOption = "anyone" | "connections";
type CreationStyle = "ai" | "manual";

interface ModalState {
  isOpen: boolean;
  type: 'success' | 'error' | 'validation';
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
}

const JobPostingForm: React.FC = () => {
  const navigate = useNavigate();
  const { publishJob, saveDraft } = useJobPosting();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    jobTitle: "",
    companyName: "",
    aboutCompany: "",
    workplaceType: "",
    jobLocation: "",
    jobType: "",
    jobDescription: "",
    requirements: "",
    documentTitle: ""
  });

  const [privacyOption, setPrivacyOption] = useState<PrivacyOption>("anyone");
  const [selectedStyle, setSelectedStyle] = useState<CreationStyle>("ai");
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDraftSaving, setIsDraftSaving] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // Modal state
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  // Handlers
  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const navigateToMyJobs = () => {
    navigate('/my-jobs');
  };

  const showModal = (
    type: 'success' | 'error' | 'validation', 
    title: string, 
    message: string, 
    onConfirm?: () => void, 
    confirmText?: string
  ) => {
    setModal({
      isOpen: true,
      type,
      title,
      message,
      onConfirm,
      confirmText
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  // UPDATED: Modified to work with JobFormSections navigation
  const handlePublishJob = async (): Promise<void> => {
    const validationError = validateForm(formData);
    if (validationError) {
      showModal('validation', 'Missing Required Fields', validationError);
      throw new Error(validationError); // Throw error to prevent navigation
    }

    try {
      setIsPublishing(true);
      const jobData = {
        ...formData,
        privacyOption,
        selectedStyle,
        document: selectedFile
      };

      console.log('Submitting job data for publish:', jobData);
      const result = await publishJob(jobData);
      
      if (result) {
        // Success - let JobFormSections handle navigation
        console.log('Job published successfully');
      } else {
        showModal('error', 'Publication Failed', 'There was an error publishing your job. Please check your connection and try again.');
        throw new Error('Publication failed');
      }
    } catch (error) {
      console.error('Publish job error:', error);
      showModal('error', 'Publication Failed', 'An unexpected error occurred while publishing your job. Please try again.');
      throw error; // Re-throw to prevent navigation
    } finally {
      setIsPublishing(false);
    }
  };

  // UPDATED: Modified to work with JobFormSections navigation
  const handleSaveDraft = async (): Promise<void> => {
    try {
      setIsDraftSaving(true);
      
      const draftData = {
        ...formData,
        privacyOption,
        selectedStyle,
        document: selectedFile
      };

      console.log('Submitting draft data with file:', draftData);
      console.log('Selected file in draft:', selectedFile);
      
      const result = await saveDraft(draftData);
      
      if (result) {
        // Success - let JobFormSections handle navigation
        console.log('Draft saved successfully');
      } else {
        showModal('error', 'Save Failed', 'There was an error saving your draft. Please try again.');
        throw new Error('Save failed');
      }
    } catch (error) {
      console.error('Save draft error:', error);
      showModal('error', 'Save Failed', 'An unexpected error occurred while saving your draft. Please try again.');
      throw error; // Re-throw to prevent navigation
    } finally {
      setIsDraftSaving(false);
    }
  };

  // Modal Component
  const Modal = () => {
    if (!modal.isOpen) return null;

    const colors = getModalColors(modal.type);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                {(() => {
                  const iconConfig = getModalIconType(modal.type);
                  const IconComponent = iconConfig.icon === 'CheckCircle' ? CheckCircle : AlertCircle;
                  return <IconComponent className={iconConfig.className} />;
                })()}
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">{modal.title}</h3>
              </div>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            
            <div className={`p-3 sm:p-4 rounded-lg ${colors.bg} ${colors.border} border mb-4 sm:mb-6`}>
              <p className="text-gray-700 text-sm sm:text-base">{modal.message}</p>
            </div>
            
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3">
              <button
                onClick={modal.onConfirm || closeModal}
                className={`px-4 sm:px-6 py-2 text-white font-medium rounded-lg transition-colors text-sm sm:text-base cursor-pointer ${colors.button}`}
              >
                {modal.confirmText || 'OK'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Modal />

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                onClick={navigateToMyJobs}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h2 className="text-sm font-medium text-gray-900">Create Job Posting</h2>
                  <p className="text-xs text-gray-500">Fill in the details below</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button 
                onClick={() => setShowPreview(!showPreview)}
                className="px-3 py-2 sm:px-6 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                {showPreview ? 'Edit' : 'Preview'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {showPreview ? (
          <JobPreview
            formData={formData}
            privacyOption={privacyOption}
            selectedStyle={selectedStyle}
            selectedFile={selectedFile}
            onBackToEdit={() => setShowPreview(false)}
          />
        ) : (
          <JobFormSections
            formData={formData}
            privacyOption={privacyOption}
            selectedStyle={selectedStyle}
            selectedFile={selectedFile}
            isPublishing={isPublishing}
            isDraftSaving={isDraftSaving}
            onInputChange={handleInputChange}
            onPrivacyChange={setPrivacyOption}
            onStyleChange={setSelectedStyle}
            onFileSelect={setSelectedFile}
            onSaveDraft={handleSaveDraft}
            onPublishJob={handlePublishJob}
            onNavigateAfterAction={navigateToMyJobs}
          />
        )}
      </main>
    </div>
  );
};

export default JobPostingForm;