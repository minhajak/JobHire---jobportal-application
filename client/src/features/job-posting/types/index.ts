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