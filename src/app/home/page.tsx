'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { Button } from "@/components/ui/button";
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent } from "@/components/ui/card"; // Using Shadcn UI for cards
import { Separator } from "@/components/ui/separator"; // Using Shadcn UI for visual separation

// Define the color palette (consistent with the image)
const colorWhite = '#FFFFFF';
const colorBlue = '#8AAAE5';
const colorBlueLight = '#AABEE8';

const navigationLinks = [
    { href: '/predict', label: 'Go to Prediction' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/contact', label: 'Contact Us' },
];

const HomePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const pathname = usePathname(); // Hook to get the current path

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            alert('👋 Logged out!');
            router.push('/');
        } catch (error) {
            console.error("Logout failed:", error);
            alert('❌ Logout failed.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-blue-100 text-gray-800"> {/* Light blue background, dark text */}
            {/* Navigation */}
            <motion.div
                className="flex flex-wrap gap-4 justify-center mt-8 p-4 bg-white shadow-md rounded-lg" // White background for navigation
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {navigationLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                        <Button
                            className={`px-6 py-3 rounded-md ${
                                pathname === link.href
                                    ? 'bg-blue-500 text-white hover:bg-blue-600' // Highlight active link
                                    : 'bg-white text-blue-500 hover:bg-blue-200'
                            }`}
                        >
                            {link.label}
                        </Button>
                    </Link>
                ))}
            </motion.div>

            {/* Auth Button */}
            <div className="flex justify-end px-6 py-4">
                {!user ? (
                    <Link href="/auth" className="bg-white text-blue-500 hover:bg-blue-100 px-4 py-2 rounded-md text-sm shadow-sm">
                        Login / Register
                    </Link>
                ) : (
                    <button
                        onClick={handleLogout}
                        className="bg-white text-red-500 hover:bg-red-100 px-4 py-2 rounded-md text-sm shadow-sm"
                    >
                        Logout ({user.email})
                    </button>
                )}
            </div>

            <main className="flex-grow px-6 md:px-12 py-8">
                {/* Heading */}
                <motion.h1
                    className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-blue-700" // Darker blue heading
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99] }}
                >
                    Welcome to the Manufacturing Quality Rating Predictor
                </motion.h1>

                {/* Overview */}
                <motion.p
                    className="text-center text-gray-700 opacity-80 max-w-3xl mx-auto mb-12" // Darker gray text
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    Use AI to predict product quality using metrics like temperature, pressure & fusion. This helps reduce defects and streamline manufacturing.
                </motion.p>

                {/* Sections as Animated Cards */}
                <div className="space-y-8">
                    <EnhancedCardSection title="🎯 Website Motive">
                        Our mission is to empower industries with AI-driven predictions that reduce errors and enhance product quality.
                    </EnhancedCardSection>

                    <EnhancedCardSection title="👨‍💻 About the Developers">
                        <ul className="list-disc list-inside opacity-80">
                            <li><strong>Zubair Shaikh</strong> – Lead Developer, UI/UX Designer</li>
                            <li><strong>Zayan Khan</strong> – Backend Developer, API Architect</li>
                        </ul>
                    </EnhancedCardSection>

                    <EnhancedCardSection title="🎯 Targeted Users">
                        <ul className="list-disc list-inside opacity-80">
                            <li>Manufacturing quality inspectors</li>
                            <li>Production engineers</li>
                            <li>Students & researchers in industrial AI</li>
                            <li>Factory owners & supervisors</li>
                            <li>AI/ML enthusiasts</li>
                        </ul>
                    </EnhancedCardSection>

                    <EnhancedCardSection title="🧪 Input Parameters Explained">
                        <ul className="list-disc list-inside opacity-80">
                            <li><strong>1️⃣ Temperature (°C):</strong> The heat applied during manufacturing. Ideal: <span className="font-semibold text-blue-500">100–300°C</span>.</li>
                            <li><strong>2️⃣ Pressure (kPa):</strong> The force used to shape the product. Ideal: <span className="font-semibold text-blue-500">5–25 kPa</span>.</li>
                            <li><strong>3️⃣ Temp × Pressure:</strong> A calculated metric = Temp × Pressure (e.g., 200×10=2000). Range: <span className="font-semibold text-blue-500">513–7365</span>.</li>
                            <li><strong>4️⃣ Material Fusion Metric:</strong> Quality of how materials bonded. Range: <span className="font-semibold text-blue-500">10,157 – 103,756</span>.</li>
                            <li><strong>5️⃣ Transformation Metric:</strong> Score showing reshaping success. Range: <span className="font-semibold text-blue-500">999,946 – 26,997,826</span>.</li>
                        </ul>
                    </EnhancedCardSection>

                    <EnhancedCardSection title="📘 Beginner's Guide">
                        <p className="mb-2 opacity-80">
                            Don’t worry if you're new! Here's how you use the platform:
                        </p>
                        <ul className="list-disc list-inside opacity-80 mb-4">
                            <li>Click on <strong>Predict</strong> from the navbar</li>
                            <li>Enter the 5 input values from your manufacturing batch</li>
                            <li>Click the "Predict" button to see your product quality score instantly</li>
                            <li>Login to track your past predictions</li>
                            <li>Go to Dashboard → View History → Download PDF</li>
                        </ul>
                        <div className="text-sm font-medium text-blue-500">
                            💡 <strong>Pro Tip:</strong> Think of the process like baking a cake:
                            <ul className="list-disc list-inside ml-4 mt-1 opacity-80">
                                <li>🔥 Temp = Oven Heat</li>
                                <li>💪 Pressure = Mixing Power</li>
                                <li>✖️ Temp × Pressure = Total Baking Energy</li>
                                <li>🧪 Fusion = How well it’s mixed</li>
                                <li>🍰 Transformation = How perfect the cake looks!</li>
                            </ul>
                        </div>
                        <p className="mt-4 text-sm opacity-60 italic">
                            📌 Note: The value ranges mentioned above represent the lowest and highest observed values
                            from the original dataset on which our Machine Learning model was trained. They serve as
                            guidance to ensure reliable predictions.
                        </p>
                    </EnhancedCardSection>
                </div>
            </main>

            <footer className="text-center py-4 text-sm opacity-60 border-t border-gray-300 bg-white"> {/* White footer */}
                &copy; 2025 Quality AI. Built with  by Zubair & Zayan.
            </footer>
        </div>
    );
};

// Enhanced Card Section component
const EnhancedCardSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ threshold: 0.2 });

    useEffect(() => {
        if (inView) {
            controls.start({ opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } });
        } else {
            controls.start({ opacity: 0, y: 50, transition: { duration: 0.6, ease: "easeOut" } });
        }
    }, [controls, inView]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
        >
            <Card className="bg-white shadow-md rounded-lg overflow-hidden"> {/* Using Card component */}
                <CardContent className="p-6"> {/* Using CardContent */}
                    <h2 className="text-xl font-semibold mb-4 text-blue-600">{title}</h2> {/* Darker blue title */}
                    <Separator className="w-1/4 mb-4 bg-gray-300" /> {/* Visual separator */}
                    <div>{children}</div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default HomePage;