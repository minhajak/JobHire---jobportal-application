export interface JobFormData {
  jobTitle: string;
  companyName: string;
  aboutCompany: string;
  workplaceType: string;
  jobLocation: string;
  jobType: string;
  jobDescription: string;
  requirements: string;
  documentTitle?: string;
}

export interface JobPostingData extends JobFormData {
  privacyOption: string;
  selectedStyle: string;
  document?: File | null;
}

// Updated to match backend response structure
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  job?: T; // Added for create/update responses
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalJobs: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Updated to match backend Job model
export interface JobResponse {
  _id: string;
  jobTitle: string;
  companyName: string;
  aboutCompany?: string;
  workplaceType: string;
  jobLocation: string;
  jobType: string;
  jobDescription?: string;
  requirements?: string;
  documentTitle?: string;
  documentFile?: {
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    path: string;
  };
  privacyOption?: string;
  selectedStyle?: string;
  status: 'draft' | 'published' | 'closed';
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  views?: number;
  applicants?: number;
  company?: {
    _id: string;
    name: string;
    about?: string;
    industry?: string;
    logoUrl?: string;
  };
}

// src/features/job-posting/types/index.ts

export interface FormData {
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

export type PrivacyOption = "anyone" | "connections";
export type CreationStyle = "ai" | "manual";

export interface ModalState {
  isOpen: boolean;
  type: 'success' | 'error' | 'validation';
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
}

export interface JobFormSectionsProps {
  formData: FormData;
  privacyOption: PrivacyOption;
  selectedStyle: CreationStyle;
  selectedFile: File | null;
  isLoading: boolean;
  onInputChange: (field: keyof FormData, value: string) => void;
  onPrivacyChange: (value: PrivacyOption) => void;
  onStyleChange: (style: CreationStyle) => void;
  onFileSelect: (file: File | null) => void;
  onSaveDraft: () => Promise<void>;
  onPublishJob: () => Promise<void>;
}

export interface JobPreviewProps {
  formData: FormData;
  privacyOption: PrivacyOption;
  selectedStyle: CreationStyle;
  selectedFile: File | null;
  onBackToEdit: () => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export interface JobPreviewProps {
  formData: FormData;
  privacyOption: PrivacyOption;
  selectedStyle: CreationStyle;
  selectedFile: File | null;
  onBackToEdit: () => void;
}

export interface FormsData {
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
export interface ModalState {
  isOpen: boolean;
  type: 'success' | 'error' | 'validation';
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
}

export interface JobFormSectionsProps {
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
