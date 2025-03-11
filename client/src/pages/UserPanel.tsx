import React, { useState } from 'react';
import Navbar from '../components/Navbar';

type Props = {
  title: string;
  company: string;
  location: string;
  status: string;
};

export default function UserPanel() {
  const [selectedJob, setSelectedJob] = useState<Props | null>(null); // state to store selected job
  const [jobs, setJobs] = useState([
    { title: 'Software Engineer', company: 'Google', location: 'Mountain View, CA', status: 'Applied' },
    { title: 'Product Manager', company: 'Facebook', location: 'Menlo Park, CA', status: 'Interviewing' },
    { title: 'Data Scientist', company: 'Amazon', location: 'Seattle, WA', status: 'Offer' },
    { title: 'UX Designer', company: 'Apple', location: 'Cupertino, CA', status: 'Rejected' },
  ]);

  const handleRowClick = (job: Props) => {
    setSelectedJob(job); // set selected job on row click
  };

  const handleDeleteJob = (index: number) => {
    const updatedJobs = jobs.filter((_, i) => i !== index); // remove the job at the specified index
    setJobs(updatedJobs);
  };

  const handleAddNewApplication = () => {
    // Logic to add a new application
    alert('Add New Application functionality to be implemented.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar username="John Doe" isLoggedIn={true} />

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Job Applications</h2>
          <button
            onClick={handleAddNewApplication}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add New Application
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2 text-left">Job Title</th>
                <th className="px-4 py-2 text-left">Company</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Application Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => (
                <tr
                  key={index}
                  className={`cursor-pointer hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}
                  onClick={() => handleRowClick(job)} // Trigger panel on row click
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{job.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{job.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{job.status}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click from triggering
                        setSelectedJob(job);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click from triggering
                        handleDeleteJob(index);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Panel to Edit Job Details */}
      {selectedJob && (
        <div
          style={{ backgroundColor: 'rgba(241, 245, 249, 0.8)' }}
          className="fixed inset-0 flex items-center justify-center"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Edit Job Details</h2>

            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Job Title</label>
              <input type="text" value={selectedJob.title} className="border p-2 w-full rounded" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Company</label>
              <input type="text" value={selectedJob.company} className="border p-2 w-full rounded" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Location</label>
              <input type="text" value={selectedJob.location} className="border p-2 w-full rounded" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Application Status</label>
              <input type="text" value={selectedJob.status} className="border p-2 w-full rounded" />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                onClick={() => setSelectedJob(null)} // Close the panel
              >
                Close
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Save Changes</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">Delete Job</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}