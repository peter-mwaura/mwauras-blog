import { verifyAuth } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function commonLayoutActions() {
    const token = (await cookies()).get('token')?.value;
    const user = await verifyAuth(token);
    return user;
}
