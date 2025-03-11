import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

type Job = {
  idjobs: number;
  title: string;
  company: string;
  location: string;
  status: string;
};

export default function UserPanel() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [newJob, setNewJob] = useState({ title: '', company: '', location: '', status: 'Applied' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar username="John Doe" isLoggedIn={true} />

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Job Applications</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add New Application
          </button>
        </div>

        {/* Show message if no jobs */}
        {jobs.length === 0 ? (
          <p className="text-center p-20 text-gray-500">No Job Applications Found Here</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-4 py-2 text-left">Job Title</th>
                  <th className="px-4 py-2 text-left">Company</th>
                  <th className="px-4 py-2 text-left">Location</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr
                    key={job.idjobs}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => setSelectedJob(job)}
                  >
                    <td className="px-6 py-4">{job.title}</td>
                    <td className="px-6 py-4">{job.company}</td>
                    <td className="px-6 py-4">{job.location}</td>
                    <td className="px-6 py-4">{job.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
              // onChange={handleChange}
              className="border p-2 w-full rounded mb-2"
            />
            <input
              type="text"
              name="company"
              placeholder="Company"
              value={newJob.company}
              // onChange={handleChange}
              className="border p-2 w-full rounded mb-2"
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={newJob.location}
              // onChange={handleChange}
              className="border p-2 w-full rounded mb-2"
            />
            <select
              name="status"
              value={newJob.status}
              // onChange={handleChange}
              className="border p-2 w-full rounded mb-4"
            >
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offered">Offered</option>
              <option value="Rejected">Rejected</option>
            </select>
            <div className="flex justify-end space-x-4">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setIsModalOpen(false)}>Cancel</button>
              {/* <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddJob}>Add Job</button> */}
              <button className="bg-blue-500 text-white px-4 py-2 rounded">Add Job</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
