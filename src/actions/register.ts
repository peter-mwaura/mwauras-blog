'use server';

import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const schema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 charcater long' }),
});

export async function registerUserActions(formData: FormData) {
    // Extract data values
    const name = formData.get('name') as string | null;
    const email = formData.get('email') as string | null;
    const password = formData.get('password') as string | null;

    // Validate required fields
    if (!name || !email || !password) {
        return {
            error: 'Missing required fields',
            status: 400,
        };
    }

    // Validate data
    // const validatedFields = schema.safeParse({ name, email, password });

    // if (!validatedFields.success) {
    //     // Safeguard against missing or unexpected error structure
    //     const errorMessage =
    //         validatedFields.error.errors?.[0]?.message ||
    //         'Unknown validation error';
    //     console.error('Validation error:', errorMessage);
    //     return {
    //         error: errorMessage,
    //         status: 400,
    //     };
    // }

    // const { data } = validatedFields;
    try {
        // Database connection
        await connectToDatabase();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return {
                error: 'User already exists!',
                status: 400,
            };
        }

        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(password, salt);
        const result = new User({
            name,
            email,
            password: hashed_password,
        });
        await result.save();
        if (result) {
            console.log('User added successfully!');
            return {
                success: 'User registered successfully!',
                status: 201,
            };
        } else {
            return {
                error: 'Internal server error',
                status: 500,
            };
        }

        return {
            success: true,
            message: 'User registered successfully!',
        };
    } catch (e) {
        //'Registration error'
        return {
            error: 'Internal server error',
            status: 500,
        };
    }
}
