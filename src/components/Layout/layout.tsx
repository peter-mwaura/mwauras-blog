import { ReactNode } from 'react';
import Header from './header';

type CommonLayoutProps = {
    children: ReactNode;
};

export default function CommonLayout({ children }: CommonLayoutProps) {
    const isAuth = false;
    return (
        <div className="min-h-screen bg-white">
            {isAuth && <Header />}
            {children}
        </div>
    );
}
