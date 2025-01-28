import CreateBlogForm from '@/components/blog/CreateBlog';
import { verifyAuth } from '@/lib/auth';
import { cookies } from 'next/headers';

export default async function CreateBlogPage() {
    const token = (await cookies()).get('token')?.value;
    const user = await verifyAuth(token);

    if (!user) {
        // Handle cases where the user is not authenticated
        return (
            <div className="flex items-center justify-center h-screen">
                <p>You must be logged in to create a blog.</p>
            </div>
        );
    }

    return <CreateBlogForm user={user} />;
}
