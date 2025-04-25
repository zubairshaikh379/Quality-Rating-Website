'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Define the color palette (assuming you have these defined)
const colorWhite = '#FFFFFF';
const colorBlue = '#8AAAE5';

export default function LandingPage() {
    const router = useRouter();

    const handleStart = () => {
        router.push('/home');
    };

    return (
        <div className="relative min-h-screen" style={{ backgroundColor: colorBlue, color: colorWhite, overflow: 'hidden', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {/* 🎨 Custom Animated Blobs (Monochromatic Blue with varying opacity) */}
            <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none overflow-hidden">
                {/* Blob 1 */}
                <div className="absolute top-10 left-10 w-60 h-60 rounded-full mix-blend-multiply filter blur-2xl animate-blob" style={{ backgroundColor: colorWhite, opacity: 0.2 }} />
                {/* Blob 2 */}
                <div className="absolute top-40 right-16 w-72 h-72 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-2000" style={{ backgroundColor: colorWhite, opacity: 0.15 }} />
                {/* Blob 3 */}
                <div className="absolute bottom-16 left-20 w-64 h-64 rounded-full mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000" style={{ backgroundColor: colorWhite, opacity: 0.25 }} />
            </div>

            {/* 🎉 Animated Text */}
            <motion.h1
                className="text-5xl md:text-6xl font-extrabold mb-4 text-center z-20"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                style={{ color: colorWhite }}
            >
                Welcome to <span style={{ color: colorWhite }}>Quality Rating Predictor</span>
            </motion.h1>

            <motion.p
                className="text-lg mb-8 text-center max-w-xl z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                style={{ color: colorWhite, opacity: 0.8 }}
            >
                Smart Predictions for Manufacturing Excellence
            </motion.p>

            <motion.button
                onClick={handleStart}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full font-semibold text-lg transition z-20 hover:bg-[#AABEE8]"
                style={{ backgroundColor: colorWhite, color: colorBlue }}
            >
                Get Started
            </motion.button>
        </div>
    );
}