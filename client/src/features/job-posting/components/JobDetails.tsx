import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useJobPosting } from "../hooks/useJobPosting";
import type { JobResponse } from "../../../lib/types/JobPostingType";

const JobDetails: React.FC = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const { getJobById } = useJobPosting();

  const [job, setJob] = useState<JobResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (!jobId) return;

      setLoading(true);
      try {
        const data = await getJobById(jobId);
        setJob(data);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Loading...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Job not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="p-4 border-b flex items-center">
        <button onClick={() => navigate(-1)} className="mr-2">
          <ArrowLeft size={22} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold">Job Details</h1>
      </div>

      <div className="p-5 flex items-center border-b">
        <img
          src={job.company?.logoUrl || "/default-logo.png"}
          alt={job.companyName}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="ml-3">
          <h2 className="text-lg font-semibold">{job.jobTitle}</h2>
          <p className="text-sm text-gray-500">{job.companyName}</p>
          <div className="flex gap-2 text-xs text-gray-400 mt-1">
            <span>{job.jobLocation}</span>
            <span>{job.jobType}</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-4 flex-1 overflow-y-auto">
        <h2 className="font-semibold text-lg mb-2">Company Description</h2>
        <p className="text-sm text-gray-700 mb-4">
          {job.aboutCompany || job.company?.about}
        </p>

        <h2 className="font-semibold text-lg mb-2">About the job</h2>
        <p className="text-sm text-gray-700 mb-4">{job.jobDescription}</p>

        <h2 className="font-semibold text-lg mb-2">Qualifications</h2>
        <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
          {job.requirements
            ? job.requirements
                .split("\n")
                .map((req, i) => <li key={i}>{req}</li>)
            : null}
        </ul>
        {job.documentFile && (
          <div className="mt-4">
            <h2 className="font-semibold text-lg mb-2">Attachment</h2>
            <a
              href={`${job.documentFile.path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {job.documentFile.originalName || job.documentFile.filename}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;