import React, { useState } from 'react'
import { ZodString } from 'zod'

type Props = {
    type: string,
    name: string,
    schema: ZodString,
    setValue: React.Dispatch<React.SetStateAction<string>>
}

export default function FormInput({type, name, schema, setValue}: Props) {
    const [error, setError] = useState("")
    
    const validateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = schema.safeParse(e.target.value)

        if(!input.success){
            setError("*" + input.error.issues[0].message)
            setValue("")
        }
        else{
            setError("")
            setValue(input.data)
        }
    }

    return (
    <div>
        <label 
            htmlFor={name} 
            className="block text-gray-700 text-sm font-bold mb-2"
        >
            {name}
        </label>

        <input
            className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            type={type}
            onChange={validateInput} 
            placeholder={name}
        />
        <p className='min-h-6 text-red-500 italic'>{error}</p>
    </div>
    )
}