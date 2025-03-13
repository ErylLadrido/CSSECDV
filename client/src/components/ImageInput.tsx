import React, { useState } from 'react'

type Props = {
    type: string,
    name: string,
    schema: any,
    setValue: React.Dispatch<React.SetStateAction<File | null>>
}

export default function ImageInput({type, name, schema, setValue}: Props) {
    const [error, setError] = useState("")
        
    const validateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (!file) {
            setError("*No file selected");
            setValue(null);
            return;
        }

        const input = schema.safeParse(file)

        if(!input.success){
            setError("Invalid file.")
            setValue(null)
        }
        else{
            setError("")
            setValue(file)
           
        }
    }

    return (
    <div>
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
            {name}
        </label>
        <input
            className="border rounded w-full py-2 px-3 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-white file:bg-blue-500 hover:file:bg-blue-700 cursor-pointer"
            id={name}
            type={type}
            accept="image/jpeg, image/jpg, image/png, image/webp"
            onChange={validateInput}
        />
        <p className='min-h-6 text-red-500 italic'>{error}</p>
    </div>
  )
}