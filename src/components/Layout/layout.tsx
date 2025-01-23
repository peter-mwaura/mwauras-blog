import { ReactNode } from 'react';
import Header from './header';
import { commonLayoutActions } from '@/actions/commonLayout';

type CommonLayoutProps = {
    children: ReactNode;
};

export default async function CommonLayout({ children }: CommonLayoutProps) {
    const user = await commonLayoutActions();
    return (
        <div className="min-h-screen bg-white">
            {user && <Header />}
            {children}
        </div>
    );
}
