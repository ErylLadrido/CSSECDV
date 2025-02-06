import React from 'react'

type Props = {
    jobTitle: string,
    companyName: string,
    location: string,
    status: string
}

export default function JobTable({ jobTitle, companyName, location, status }: Props) {
    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{jobTitle}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{companyName}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{location}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {status}
                </span>
            </td>
        </tr>
    )
}