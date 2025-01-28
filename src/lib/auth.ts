import { jwtVerify } from 'jose';

// Define the shape of the user object
export interface User {
    userId: string;
    email: string;
    userName: string;
}

export async function verifyAuth(
    token: string | undefined
): Promise<User | null> {
    if (!token) {
        return null;
    }

    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(process.env.JWT_SECRET)
        );
        return {
            userId: payload.userId as string,
            email: payload.email as string,
            userName: payload.userName as string,
        };
    } catch (e) {
        console.error(e, 'Error fetching token');
        return null;
    }
}
