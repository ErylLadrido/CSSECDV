import React from 'react'
import Navbar from '../components/Navbar'
import JobTable from '../components/JobTable'

type Props = {}

export default function UserPanel({}: Props) {
    const jobs = [
        { title: 'Software Engineer', company: 'Google', location: 'Mountain View, CA', status: 'Applied' },
        { title: 'Product Manager', company: 'Facebook', location: 'Menlo Park, CA', status: 'Interviewing' },
        { title: 'Data Scientist', company: 'Amazon', location: 'Seattle, WA', status: 'Offer' },
        { title: 'UX Designer', company: 'Apple', location: 'Cupertino, CA', status: 'Rejected' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar username="John Doe" />

            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Job Applications</h2>

                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left">Job Title</th>
                                <th className="px-4 py-2 text-left">Company</th>
                                <th className="px-4 py-2 text-left">Location</th>
                                <th className="px-4 py-2 text-left">Application Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map((job, index) => (
                                <JobTable
                                    key={index}
                                    jobTitle={job.title}
                                    companyName={job.company}
                                    location={job.location}
                                    status={job.status}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}