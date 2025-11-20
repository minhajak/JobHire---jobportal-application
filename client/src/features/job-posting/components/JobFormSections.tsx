// src/features/job-posting/components/JobFormSections.tsx - Updated with repositioned buttons

import React, { type ChangeEvent } from "react";
import { Briefcase } from "lucide-react";
import type { FormData, PrivacyOption, CreationStyle } from "../types";
import { formatFileSize, getFileIconConfig } from "../utils/helpers";

interface JobFormSectionsProps {
  formData: FormData;
  privacyOption: PrivacyOption;
  selectedStyle: CreationStyle;
  selectedFile: File | null;
  isPublishing: boolean;
  isDraftSaving?: boolean;
  onInputChange: (field: keyof FormData, value: string) => void;
  onPrivacyChange: (value: PrivacyOption) => void;
  onStyleChange: (style: CreationStyle) => void;
  onFileSelect: (file: File | null) => void;
  onSaveDraft: () => Promise<void>;
  onPublishJob: () => Promise<void>;
  // NEW: Add optional navigation callback
  onNavigateAfterAction?: () => void;
}

const JobFormSections: React.FC<JobFormSectionsProps> = ({
  formData,
  privacyOption,
  selectedStyle,
  selectedFile,
  isPublishing,
  isDraftSaving = false,
  onInputChange,
  onPrivacyChange,
  onStyleChange,
  onFileSelect,
  onSaveDraft,
  onPublishJob,
  onNavigateAfterAction,
}) => {
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    onFileSelect(file || null);
  };

  const removeFile = (): void => {
    onFileSelect(null);
    const fileInput = document.getElementById(
      "file-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // NEW: Enhanced save draft handler that triggers navigation after success
  const handleSaveDraft = async () => {
    try {
      await onSaveDraft();
      // Navigate after successful draft save if callback provided
      if (onNavigateAfterAction) {
        onNavigateAfterAction();
      }
    } catch (error) {
      // Error handling - don't navigate if save failed
      console.error("Failed to save draft:", error);
    }
  };

  // NEW: Enhanced publish handler that triggers navigation after success
  const handlePublishJob = async () => {
    try {
      await onPublishJob();
      // Navigate after successful publish if callback provided
      if (onNavigateAfterAction) {
        onNavigateAfterAction();
      }
    } catch (error) {
      // Error handling - don't navigate if publish failed
      console.error("Failed to publish job:", error);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-8 mb-10">
      {/* Privacy & Title Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        {/* Privacy Toggle */}
        <div className="mb-4 sm:mb-6">
          <label className="text-sm font-medium text-gray-700 mb-2 sm:mb-3 block cursor-default">
            Who can see this job?
          </label>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="privacy"
                value="anyone"
                checked={privacyOption === "anyone"}
                onChange={(e) => onPrivacyChange(e.target.value as any)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700">Anyone</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="privacy"
                value="connections"
                checked={privacyOption === "connections"}
                onChange={(e) => onPrivacyChange(e.target.value as any)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700">
                Connections Only
              </span>
            </label>
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              Post a Job
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Increase the quality of your hire
          </p>
        </div>

        {/* Job Title */}
        <div>
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) => onInputChange("jobTitle", e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base cursor-text"
            placeholder="Job Title *"
          />
        </div>
      </div>

      {/* Content Creation Style */}
      <div className="max-w-md mx-auto p-4 sm:p-6">
        <div className="mb-3 sm:mb-4">
          <p className="text-gray-600 text-xs sm:text-sm">
            Choose your path style for create menu Details of Hiring
          </p>
        </div>

        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => onStyleChange("ai")}
            className={`px-3 py-2 sm:px-4 rounded-lg border transition-all text-xs sm:text-sm cursor-pointer ${
              selectedStyle === "ai"
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            Write with AI
          </button>

          <button
            onClick={() => onStyleChange("manual")}
            className={`px-4 py-2 sm:px-6 rounded-lg transition-all text-xs sm:text-sm font-medium cursor-pointer ${
              selectedStyle === "manual"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Write on my own
          </button>
        </div>
      </div>

      {/* Company Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          Company Information
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2 cursor-default">
              Company Name *
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => onInputChange("companyName", e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base cursor-text"
              placeholder="Enter your company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2 cursor-default">
              About Company *
            </label>
            <textarea
              rows={3}
              value={formData.aboutCompany}
              onChange={(e) => onInputChange("aboutCompany", e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm sm:text-base cursor-text"
              placeholder="Tell us about your company..."
            />
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          Job Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2 cursor-default">
              Workplace Type *
            </label>
            <select
              value={formData.workplaceType}
              onChange={(e) => onInputChange("workplaceType", e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base cursor-pointer"
            >
              <option value="">Select workplace type</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2 cursor-default">
              Job Type *
            </label>
            <select
              value={formData.jobType}
              onChange={(e) => onInputChange("jobType", e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base cursor-pointer"
            >
              <option value="">Select job type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2 cursor-default">
              Job Location *
            </label>
            <input
              type="text"
              value={formData.jobLocation}
              onChange={(e) => onInputChange("jobLocation", e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base cursor-text"
              placeholder="e.g. New York, NY or Remote"
            />
          </div>
        </div>
      </div>

      {/* Job Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          Job Content
        </h3>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2 cursor-default">
              Job Description *
            </label>
            <textarea
              rows={5}
              value={formData.jobDescription}
              onChange={(e) => onInputChange("jobDescription", e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm sm:text-base cursor-text"
              placeholder="Describe the role, responsibilities, and what the candidate will be working on..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2 cursor-default">
              Requirements & Qualifications *
            </label>
            <textarea
              rows={4}
              value={formData.requirements}
              onChange={(e) => onInputChange("requirements", e.target.value)}
              className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm sm:text-base cursor-text"
              placeholder="List the required skills, experience, education, and qualifications..."
            />
          </div>
        </div>
      </div>

      {/* Share a Document - Optional */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          Share a Document
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
          Add a Descriptive Title for your Document
        </p>

        <div className="space-y-3 sm:space-y-4">
          <input
            type="text"
            value={formData.documentTitle}
            onChange={(e) => onInputChange("documentTitle", e.target.value)}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base cursor-text"
            placeholder="Document description..."
          />

          <p className="text-xs text-gray-500">
            Adding a title helps your document get discovered more easily
          </p>

          {selectedFile && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {(() => {
                      const config = getFileIconConfig(selectedFile.type);
                      return (
                        <svg
                          className={config.className}
                          fill={config.fill}
                          stroke={config.stroke}
                          viewBox={config.viewBox}
                          strokeLinecap={config.strokeLinecap}
                          strokeLinejoin={config.strokeLinejoin}
                          strokeWidth={config.strokeWidth}
                        >
                          <path d={config.path} />
                        </svg>
                      );
                    })()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-green-800 truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-green-600">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeFile}
                  className="text-green-600 hover:text-green-800 text-xs sm:text-sm font-medium transition-colors flex-shrink-0 ml-2 cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.ppt,.pptx"
            />
            <label
              htmlFor="file-upload"
              className="px-4 py-2 sm:px-6 bg-blue-50 text-blue-600 text-xs sm:text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
            >
              {selectedFile ? "Change File" : "Choose a File"}
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons - UPDATED: Repositioned to center with smaller size */}
      <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3 sticky bottom-4 bg-gray-50 p-4 -mx-4 sm:-mx-6 lg:-mx-8 rounded-lg sm:bg-transparent sm:p-0 sm:static">
        <button
          onClick={handleSaveDraft}
          className="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 text-gray-700 text-xs sm:text-sm font-medium rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-2 sm:order-1 flex items-center justify-center space-x-1.5 cursor-pointer"
          disabled={isDraftSaving || isPublishing}
        >
          {isDraftSaving ? (
            <>
              <div className="w-3 h-3 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Saving Draft...</span>
            </>
          ) : (
            <span>Save as Draft</span>
          )}
        </button>
        <button
          onClick={handlePublishJob}
          className="w-full sm:w-auto px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-1.5 order-1 sm:order-2"
          disabled={isPublishing || isDraftSaving}
        >
          {isPublishing ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Publishing...</span>
            </>
          ) : (
            <span>Publish Job</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default JobFormSections;
