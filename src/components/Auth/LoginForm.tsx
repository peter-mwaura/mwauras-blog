'use client';

import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';
import { Input } from '../ui/input';
import { Key, Mail, User } from 'lucide-react';
import { Button } from '../ui/button';
import { loginUserActions } from '@/actions/login';
// import { cookies } from 'next/headers';

const schema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' }),
});

type LoginFormFieldsType = z.infer<typeof schema>;

export default function LoginForm() {
    // const token = (await cookies()).get('token')?.value;
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormFieldsType>({
        resolver: zodResolver(schema),
    });

    const { toast } = useToast();
    const router = useRouter();

    const onSubmit: SubmitHandler<LoginFormFieldsType> = async (data) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            (Object.keys(data) as (keyof LoginFormFieldsType)[]).forEach(
                (key) => {
                    formData.append(key, data[key] as string);
                }
            );
            const result = await loginUserActions(formData);
            if (result.success) {
                toast({
                    title: 'Login successful',
                    description: result.success,
                });
                router.push('/');
            } else {
                throw new Error(result.error || 'Something went wrong!');
            }
        } catch (e) {
            const errorMessage =
                e instanceof Error ? e.message : 'An unexpected error occurred'; // Fallback message
            toast({
                title: 'Registration failed',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
                <div className="relative">
                    <Mail className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                    <Input
                        {...register('email')}
                        placeholder="Email"
                        disabled={isLoading}
                        className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.email && (
                        <div className="text-red-600 text-sm">
                            {errors.email.message}
                        </div>
                    )}
                </div>
                <div className="relative">
                    <Key className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                    <Input
                        type="password"
                        {...register('password')}
                        placeholder="Password"
                        disabled={isLoading}
                        className="pl-10 bg-gray-50 border border-gray-300 text-gray-900 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {errors.password && (
                        <div className="text-red-600 text-sm">
                            {errors.password.message}
                        </div>
                    )}
                </div>
            </div>
            <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-3 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
            >
                Login
            </Button>
        </form>
    );
}
