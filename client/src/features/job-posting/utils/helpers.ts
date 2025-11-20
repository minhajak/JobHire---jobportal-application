// src/features/job-posting/utils/helpers.ts

import type { FormData } from '../types';

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIconConfig = (fileType: string) => {
  if (fileType?.includes('pdf')) {
    return {
      className: "w-5 h-5 sm:w-6 sm:h-6 text-red-600",
      fill: "currentColor",
      viewBox: "0 0 24 24",
      path: "M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
    };
  } else if (fileType?.includes('word') || fileType?.includes('document')) {
    return {
      className: "w-5 h-5 sm:w-6 sm:h-6 text-blue-600",
      fill: "currentColor",
      viewBox: "0 0 24 24",
      path: "M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
    };
  } else {
    return {
      className: "w-5 h-5 sm:w-6 sm:h-6 text-gray-600",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const,
      strokeWidth: 2,
      path: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    };
  }
};

export const validateForm = (formData: FormData): string | null => {
  const requiredFields: (keyof FormData)[] = ['jobTitle', 'companyName', 'jobLocation', 'workplaceType', 'jobType'];
  const missingFields = requiredFields.filter(field => !formData[field].trim());
  
  if (missingFields.length > 0) {
    return `Please fill in the following required fields: ${missingFields.join(', ')}`;
  }
  
  return null;
};

export const getModalIconType = (type: 'success' | 'error' | 'validation') => {
  switch (type) {
    case 'success':
      return {
        icon: 'CheckCircle',
        className: 'w-5 h-5 sm:w-6 sm:h-6 text-green-600'
      };
    case 'error':
      return {
        icon: 'AlertCircle',
        className: 'w-5 h-5 sm:w-6 sm:h-6 text-red-600'
      };
    case 'validation':
      return {
        icon: 'AlertCircle',
        className: 'w-5 h-5 sm:w-6 sm:h-6 text-orange-600'
      };
    default:
      return {
        icon: 'AlertCircle',
        className: 'w-5 h-5 sm:w-6 sm:h-6 text-blue-600'
      };
  }
};

export const getModalColors = (type: 'success' | 'error' | 'validation') => {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        button: 'bg-green-600 hover:bg-green-700'
      };
    case 'error':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        button: 'bg-red-600 hover:bg-red-700'
      };
    case 'validation':
      return {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        button: 'bg-orange-600 hover:bg-orange-700'
      };
    default:
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        button: 'bg-blue-600 hover:bg-blue-700'
      };
  }
};