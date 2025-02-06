import React from 'react'
import Navbar from '../components/Navbar'

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
            
        </div>
    )
}