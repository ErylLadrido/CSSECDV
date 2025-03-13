import { z } from "zod";

/**
 *  CONDITIONS:
 *  Name: English letters, allow for '
 *  Password: Length between 10 and 20, ATLEAST 1 uppercase, 1 number, 1 special character
 *  Phone: Valid PH phone number
 */

const nameRegex = /^[A-Z][a-z]+(?:[-'][A-Z][a-z]+)?$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,20}$/
const phoneRegex = /^(09|\+639)\d{9}$/
const fileSizeLimit = 5 * 1024 * 1024; // 5MB

export const emailSchema = z.string({
    required_error: "Field is required.",
    invalid_type_error: "Input is not valid."
})
.email({message: "Invalid email address."});

export const nameSchema = z.string({
    required_error: "Field is required.",
    invalid_type_error: "Input is not valid.",
})
.trim()
.regex(nameRegex, { message: "Invalid name." });

export const passwordSchema = z.string({
    required_error: "Field is required.",
    invalid_type_error: "Input is not valid.",
})
.trim()
.min(10)
.max(20)
.regex(passwordRegex, { message: "Invalid password." });

export const phoneSchema = z.string({
    required_error: "Field is required.",
    invalid_type_error: "Input is not valid.",
})
.trim()
.regex(phoneRegex, { message: "Invalid phone number." });

export const imageSchema = z
    .instanceof(File)
    .refine(
        (file) => [
            "image/jpeg", 
            "image/jpg", 
            "image/png", 
            "image/webp"
        ].includes(file.type),
        { message: "File is invalid."}
    )
    .refine((file) => file.size <= fileSizeLimit, {
        message: "File is too big."
    });

