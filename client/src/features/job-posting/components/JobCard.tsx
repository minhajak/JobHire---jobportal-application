// src/features/job-posting/components/JobCard.tsx

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Briefcase,
  Users,
  Calendar,
  MoreVertical,
  Edit3,
  Trash2,
  X
} from 'lucide-react';
import type { JobResponse } from '../../../lib/types/JobPostingType';
import { Link } from 'react-router-dom';


// Action Menu Component
interface ActionMenuProps {
  isOpen: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

const ActionMenu: React.FC<ActionMenuProps> = ({ isOpen, onEdit, onDelete, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-10 z-20 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 w-40 overflow-hidden">
      <button
        onClick={() => {
          onEdit();
          onClose();
        }}
        className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center space-x-3 transition-colors cursor-pointer"
      >
        <Edit3 className="w-4 h-4 text-blue-500" />
        <span className="font-medium">Edit</span>
      </button>
      <div className="h-px bg-gray-100 mx-2"></div>
      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 transition-colors cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
        <span className="font-medium">Delete</span>
      </button>
    </div>
  );
};

// Confirm Delete Modal Component
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  loading 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Delete Job?
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6 text-sm">
          This action cannot be undone. The job will be permanently removed.
        </p>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-xl transition-colors disabled:opacity-50 font-medium text-sm cursor-pointer disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50 font-medium text-sm flex items-center justify-center space-x-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main JobCard Component
interface JobCardProps {
  job: JobResponse;
  onEdit: (jobId: string) => void;
  onDelete: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete }) => {
  const [openActionMenu, setOpenActionMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenActionMenu(false);
    };

    if (openActionMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openActionMenu]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'draft':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return 'Live';
      case 'draft':
        return 'Draft';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const handleEdit = () => {
    onEdit(job._id);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    await onDelete(job._id);
    setIsDeleting(false);
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-all duration-200 cursor-default">
        <div className="flex items-start justify-between mb-4 sm:mb-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-3">
              <Link to={`/jobs/job-details/${job._id}`} className="text-lg sm:text-xl font-semibold text-gray-900 truncate flex-1">
                {job.jobTitle}
              </Link>
              <span
                className={`px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold rounded-full border ${getStatusColor(
                  job.status
                )}`}
              >
                {getStatusLabel(job.status)}
              </span>
            </div>

            <p className="text-gray-600 mb-3 sm:mb-4 font-medium text-sm sm:text-base">
              {job.companyName}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-5">
              <div className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base text-gray-600">
                <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 flex-shrink-0" />
                <span className="truncate">{job.jobLocation}</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 text-sm sm:text-base text-gray-600">
                <Briefcase className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 flex-shrink-0" />
                <span className="capitalize truncate">
                  {job.jobType} • {job.workplaceType}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 sm:space-x-6 text-sm sm:text-base text-gray-500">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Users className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span className="font-medium">{job.applicants || 0}<span className="hidden sm:inline"> applicants</span></span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Calendar className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span><span className="hidden sm:inline">Posted </span>{formatDate(job.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="ml-3 sm:ml-6 relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenActionMenu(!openActionMenu);
              }}
              className="p-2 sm:p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>

            <ActionMenu
              isOpen={openActionMenu}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onClose={() => setOpenActionMenu(false)}
            />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        loading={isDeleting}
      />
    </>
  );
};

export default JobCard;