import React from 'react';
import { Outlet } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';

export default function ProductDetailsLayout() {
    return (
        <div className="bg-white md:bg-gray-50 min-h-screen">
             <ScrollToTop/>
            {/* ProductDetailsLayout simplified - product page manages its own header, footer, and cart */}
            <main className="w-full">
                <Outlet />
            </main>
        </div>
    )
}