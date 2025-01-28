import { verifyAuth } from '@/lib/auth';
import connectToDatabase from '@/lib/db';
import { error } from 'console';
import { cookies } from 'next/headers';
import { z } from 'zod';
import BlogPost from '@/models/Blog';
import { revalidatePath } from 'next/cache';

const blogPostSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    category: z.string().min(1, 'Category is required'),
    coverImage: z.string().min(1, 'Image is required'),
});

export async function createBlogPostAction(data: FormData) {
    const token = (await cookies()).get('token')?.value;
    const user = await verifyAuth(token);

    if (!user) {
        return {
            error: 'Unauthorized user!',
            status: 401,
        };
    }

    const validateFields = blogPostSchema.safeParse(data);
    if (!validateFields.success) {
        return {
            error: validateFields.error.errors[0].message,
        };
    }

    const { title, coverImage, content, category } = validateFields.data;
    try {
        await connectToDatabase();
        const post = new BlogPost({
            title,
            content,
            author: user.userId,
            coverImage,
            category,
            comments: [],
            upvotes: [],
        });
        await post.save();
        revalidatePath('/');
        return {
            success: true,
            post,
        };
    } catch (e) {
        return {
            error: e,
        };
    }
}
