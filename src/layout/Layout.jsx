    import { useEffect, useState } from "react";
    import Navbar from "../components/Navbar";
    import Sidebar from "../components/Sidebar";

    export default function Layout({ children }) {
        const [sidebarOpen, setSidebarOpen] = useState(true)
        
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call once to set initial state

        return () => window.removeEventListener('resize', handleResize);
    }, []);

        return (
            <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* <div className="absolute top-0   left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div> */}
                    {/* <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div> */}
                    {/* <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div> */}
                </div>

                <Navbar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
                <div className="flex">
                    
                    <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    
                    <main className="flex-1 p-4">
                        {children}
                    </main>
                </div>
            </div>
        );
    }
