'use server';

import connectToDatabase from '@/lib/db';
import User, { IUser } from '@/models/User';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const schema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 charcater long' }),
});

export async function loginUserActions(formData: FormData) {
    // Extract form data values
    const email = formData.get('email') as string | null;
    const password = formData.get('password') as string | null;

    // Validate required fields
    if (!email || !password) {
        return {
            error: 'Missing required fields',
            status: 400,
        };
    }

    // Validate data
    // const validatedFields = schema.safeParse({ email, password });

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
        // Connect to database
        await connectToDatabase();
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return {
                error: 'Invalid credentials',
                status: 401,
            };
        }

        if (user.password) {
            const isPasswordMatch = await bcrypt.compare(
                password,
                user.password
            );
            if (!isPasswordMatch) {
                return {
                    error: 'Invalid credentials',
                    status: 401,
                };
            }
        }

        //token
        // const userToken = await new SignJWT({
        //     userId: user._id.toString(),
        //     email: user.email,
        // })
        //     .setProtectedHeader({ alg: 'HS256' })
        //     .setIssuedAt()
        //     .setExpirationTime('2h')
        //     .sign(new TextEncoder().encode(process.env.JWT_SECRET));

        // (await cookies()).set('token', userToken, {
        //     httpOnly: true,
        //     secure: false,
        //     sameSite: 'strict',
        //     maxAge: 7200,
        //     path: '/',
        // });

        return {
            success: 'Logged in successfully',
            status: 200,
        };
    } catch (e) {
        //'Login error'
        return {
            error: 'Internal server error',
            status: 500,
        };
    }
}
