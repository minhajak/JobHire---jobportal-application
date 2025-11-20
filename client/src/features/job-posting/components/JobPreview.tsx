// src/features/job-posting/components/JobPreview.tsx - Updated with cursor styles

import React from 'react';
import { ArrowLeft } from "lucide-react";
import type { FormData, PrivacyOption, CreationStyle } from '../types';
import { formatFileSize, getFileIconConfig } from '../utils/helpers';

interface JobPreviewProps {
  formData: FormData;
  privacyOption: PrivacyOption;
  selectedStyle: CreationStyle;
  selectedFile: File | null;
  onBackToEdit: () => void;
}

const JobPreview: React.FC<JobPreviewProps> = ({
  formData,
  privacyOption,
  selectedStyle,
  selectedFile,
  onBackToEdit
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Job Preview</h2>
        <button 
          onClick={onBackToEdit}
          className="px-3 py-2 sm:px-4 text-gray-600 hover:text-gray-800 transition-colors flex items-center space-x-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Edit</span>
          <span className="sm:hidden">Edit</span>
        </button>
      </div>
      
      <div className="space-y-4 sm:space-y-6">
        <div className="border-l-4 border-blue-500 pl-4 sm:pl-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {formData.jobTitle || "Job Title"}
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-1">
            {formData.companyName || "Company Name"}
          </p>
          <p className="text-sm sm:text-base text-gray-600">
            {formData.jobLocation || "Location"} • {formData.workplaceType || "Workplace Type"} • {formData.jobType || "Job Type"}
          </p>
        </div>

        {formData.aboutCompany && (
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">About the Company</h3>
            <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">{formData.aboutCompany}</p>
          </div>
        )}

        {formData.jobDescription && (
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Job Description</h3>
            <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">{formData.jobDescription}</p>
          </div>
        )}

        {formData.requirements && (
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Requirements & Qualifications</h3>
            <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">{formData.requirements}</p>
          </div>
        )}

        {(formData.documentTitle || selectedFile) && (
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Attached Document</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-blue-800 font-medium mb-2 text-sm sm:text-base">
                    {formData.documentTitle || "Untitled Document"}
                  </p>
                  {selectedFile && (
                    <div className="text-blue-600 text-xs sm:text-sm space-y-1">
                      <p><span className="font-medium">File:</span> <span className="break-all">{selectedFile.name}</span></p>
                      <p><span className="font-medium">Size:</span> {formatFileSize(selectedFile.size)}</p>
                    </div>
                  )}
                  {!selectedFile && (
                    <p className="text-blue-600 text-xs sm:text-sm">Document title specified (no file selected)</p>
                  )}
                </div>
                {selectedFile && (
                  <div className="ml-2 sm:ml-4 flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
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
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Job Details</h3>
          <div className="text-xs sm:text-sm text-gray-600 space-y-1">
            <div>Privacy: <span className="capitalize">{privacyOption}</span></div>
            <div>Creation Style: {selectedStyle === "ai" ? "AI Assisted" : "Manual"}</div>
            {selectedFile && <div className="break-all">Document: {selectedFile.name} ({formatFileSize(selectedFile.size)})</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPreview;