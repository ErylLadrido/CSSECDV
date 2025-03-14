import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

type Job = {
  idjobs: number;
  title: string;
  company: string;
  location: string;
  status: string;
  expectedSalary: number;
};

export default function UserPanel() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [newJob, setNewJob] = useState({ title: '', company: '', location: '', status: 'Applied', expectedSalary: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatedJob, setUpdatedJob] = useState<Job | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch jobs on component mount
  useEffect(() => {
    axios.get('http://localhost:8080/userpanel', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      console.log("Fetched jobs:", response.data); 
      // setJobs(response.data?.jobs || []); // If null/undefined, fallback to []

      if (!response.data?.jobs || !Array.isArray(response.data.jobs)) {
        console.error("Unexpected response format:", response.data);
        setJobs([]);
        return;
      }
  
      // Convert backend data to match the frontend structure
      const formattedJobs = response.data.jobs.map((job: any) => ({
        idjobs: job.idjobs,
        title: job.JobTitle,
        company: job.JobCompany,
        location: job.JobLocation,
        status: job.JobStatus,
        expectedSalary: job.JobExpectedSalary
      }));
  
      setJobs(formattedJobs);

    })
    .catch(error => {
        console.error("Error fetching jobs:", error);
        setJobs([]); 
    });
  }, []);

  // Calculate the range of jobs to display based on the current page
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  // Handle Next Page
  const nextPage = () => {
    if (indexOfLastJob < jobs.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle Previous Page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle Add Job
  const handleAddJob = () => {
    const formattedJob = {
      jobTitle: newJob.title,
      jobCompany: newJob.company,
      jobLocation: newJob.location,
      jobStatus: newJob.status,
      jobExpectedSalary: newJob.expectedSalary
    };

    axios.post('http://localhost:8080/userpanel', formattedJob, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    // .then(response => {
    //   console.log("Added job:", response.data); 

    //   const addedJob = response.data.job; // Get the job with idjobs from backend

    //   setJobs([...jobs, addedJob]);
    //   setIsModalOpen(false);
    //   setNewJob({ title: '', company: '', location: '', status: 'Applied' }); // Reset form
    // })
    .then(() => {
      console.log("Job added successfully!");

      fetchJobs(); // 🔄 Fetch the latest job list

      setIsModalOpen(false);
      setNewJob({ title: '', company: '', location: '', status: 'Applied', expectedSalary: 0 }); // Reset form
    })
    .catch(error => {
        console.error("Error adding job:", error);
    });
  }

  const fetchJobs = () => {
    axios.get('http://localhost:8080/userpanel', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(response => {
      console.log("Fetched jobs:", response.data); 

      if (!response.data?.jobs || !Array.isArray(response.data.jobs)) {
        console.error("Unexpected response format:", response.data);
        setJobs([]);
        return;
      }
  
      const formattedJobs = response.data.jobs.map((job: any) => ({
        idjobs: job.idjobs,
        title: job.JobTitle,
        company: job.JobCompany,
        location: job.JobLocation,
        status: job.JobStatus,
        expectedSalary: job.JobExpectedSalary
      }));
  
      setJobs(formattedJobs);
    })
    .catch(error => {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    });
  };

  // Fetch jobs on component mount
  useEffect(() => {
      fetchJobs();
  }, []);


  // Handle Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  const handleEditClick = (job: Job) => {
    setSelectedJob(job);
    setUpdatedJob({ 
      idjobs: job.idjobs, 
      title: job.title, 
      company: job.company, 
      location: job.location, 
      status: job.status,
      expectedSalary: job.expectedSalary
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateJob = () => {
    if (!updatedJob) return;

    const formattedJob = {
      idjobs: updatedJob.idjobs, // Ensure idjobs is always included
      jobTitle: updatedJob.title,
      jobCompany: updatedJob.company,
      jobLocation: updatedJob.location,
      jobStatus: updatedJob.status,
      jobExpectedSalary: updatedJob.expectedSalary
    };

    axios.put(`http://localhost:8080/userpanel/updatejob/${updatedJob.idjobs}`, formattedJob, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(() => {
      console.log("Job updated successfully!");

      fetchJobs(); // Fetch the latest job list

      setIsUpdateModalOpen(false);
    })
    .catch(error => console.error("Error updating job:", error));
  };

  const handleDeleteJob = () => {
    if (!selectedJob) return;

    axios.delete(`http://localhost:8080/userpanel/deletejob/${selectedJob.idjobs}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(() => {
      fetchJobs(); // Fetch the latest job list
      setIsDeleteModalOpen(false);
    })
    .catch(error => console.error("Error deleting job:", error));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isLoggedIn={true} />

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Job Applications</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 bg-green-500 text-white font-medium rounded-lg shadow-md hover:bg-green-600 transition-all duration-300 ease-in-out"
            aria-label="Add New Application"
          >
            ➕ Add New Application
          </button>

        </div>

        {/* Job Table */}
        {jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="px-6 py-3 text-left font-medium text-gray-700">#</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Job Title</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Company</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Location</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Expected Salary</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700">Status</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* {jobs.map((job) => ( */}
                {currentJobs.map((job, index) => (
                  <tr
                    key={job.idjobs}
                    className="cursor-pointer hover:bg-gray-100 rounded-lg border-b border-gray-200 transition-all duration-200"
                    onClick={() => setSelectedJob(job)}
                  >
                    <td className="px-6 py-4 text-gray-800">
                      {(index + 1) + (currentPage - 1) * jobsPerPage}
                    </td>
                    <td className="px-6 py-4 text-gray-800">{job.title}</td>
                    <td className="px-6 py-4 text-gray-800">{job.company}</td>
                    <td className="px-6 py-4 text-gray-800">{job.location}</td>
                    <td className="px-6 py-4 text-gray-800">{job.expectedSalary}</td>
                    <td className="px-6 py-4 text-gray-800">{job.status}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 ease-in-out"
                          aria-label="Edit Application"
                          onClick={() => handleEditClick(job)}
                        >
                          ✏️
                        </button>
          
                        <button
                          className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-300 ease-in-out"
                          aria-label="Delete Application"
                          onClick={() => {
                            setSelectedJob(job);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>        
        ) : (
          <p className="text-center p-20 text-gray-500">No jobs added yet. Add one to get started!</p>
        )}

        {/* Pagination Controls */}
        {/* {jobs.length > jobsPerPage && (
          <div className="flex justify-between mt-4">
            <button 
              onClick={prevPage} 
              disabled={currentPage === 1} 
              className={`px-4 py-2 bg-gray-300 rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'}`}
            >
              Previous
            </button>
            <span className="px-4 py-2">Page {currentPage} of {Math.ceil(jobs.length / jobsPerPage)}</span>
            <button 
              onClick={nextPage} 
              disabled={indexOfLastJob >= jobs.length} 
              className={`px-4 py-2 bg-gray-300 rounded ${indexOfLastJob >= jobs.length ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-400'}`}
            >
              Next
            </button>
          </div>
        )} */}
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {Math.ceil(jobs.length / jobsPerPage)}
          </span>
          <button
            disabled={currentPage >= Math.ceil(jobs.length / jobsPerPage)}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded ${currentPage >= Math.ceil(jobs.length / jobsPerPage) ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Add New Job</h2>
            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={newJob.title}
              onChange={handleChange}
              className="border p-2 w-full rounded mb-2"
            />
            <input
              type="text"
              name="company"
              placeholder="Company"
              value={newJob.company}
              onChange={handleChange}
              className="border p-2 w-full rounded mb-2"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={newJob.location}
              onChange={handleChange}
              className="border p-2 w-full rounded mb-2"
            />
            <input
              type="number"
              name="expectedSalary"
              placeholder="Expected Salary"
              value={newJob.expectedSalary}
              onChange={handleChange}
              className="border p-2 w-full rounded mb-2"
            />
            <select
              name="status"
              value={newJob.status}
              onChange={handleChange}
              className="border p-2 w-full rounded mb-4"
            >
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offered">Offered</option>
              <option value="Rejected">Rejected</option>
            </select>
            <div className="flex justify-end space-x-4">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddJob}>Add Job</button>
            </div>
          </div>
        </div>
      )}

      {/* Update Job Modal */}
      {isUpdateModalOpen && updatedJob && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Update Job</h2>
            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={updatedJob?.title || ""}
              onChange={(e) => setUpdatedJob(prev => prev ? { ...prev, title: e.target.value } : null)}
              className="border p-2 w-full rounded mb-2"
            />
            <input
              type="text"
              name="company"
              placeholder="Company"
              value={updatedJob?.company || ""}
              onChange={(e) => setUpdatedJob(prev => prev ? { ...prev, company: e.target.value } : null)}
              className="border p-2 w-full rounded mb-2"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={updatedJob?.location || ""}
              onChange={(e) => setUpdatedJob(prev => prev ? { ...prev, location: e.target.value } : null)}
              className="border p-2 w-full rounded mb-2"
            />
            <input
              type="number"
              name="expectedSalary"
              placeholder="Expected Salary"
              value={updatedJob?.expectedSalary || 0}
              onChange={(e) => setUpdatedJob(prev => prev ? { ...prev, expectedSalary: parseInt(e.target.value) } : null)}
              className="border p-2 w-full rounded mb-2"
            />
            <select
              name="status"
              value={updatedJob?.status || "Applied"}
              onChange={(e) => setUpdatedJob(prev => prev ? { ...prev, status: e.target.value } : null)}
              className="border p-2 w-full rounded mb-4"
            >
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offered">Offered</option>
              <option value="Rejected">Rejected</option>
            </select>
            <div className="flex justify-end space-x-4">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsUpdateModalOpen(false)}>Cancel</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleUpdateJob}>Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Job Modal */}
      {isDeleteModalOpen && selectedJob && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete <strong>{selectedJob.title}</strong> at <strong>{selectedJob.company}</strong>?</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDeleteJob}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
