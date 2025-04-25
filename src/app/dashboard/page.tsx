'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ChartComponent from '@/components/ChartComponent'; // Assuming this exists
import CSVExport from '@/components/CSVExport';

interface Prediction {
    temp: number;
    pressure: number;
    temp_x_pressure: number;
    fusedMetric: number;
    transformedMetric: number;
    quality: number;
    timestamp: Timestamp;
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const predRef = collection(db, 'predictions');
                const q = query(predRef, where('uid', '==', currentUser.uid));
                const snapshot = await getDocs(q);
                const now = Date.now();
                const data: Prediction[] = [];
                snapshot.forEach(doc => {
                    const d = doc.data();
                    if (now - d.timestamp.seconds * 1000 <= 30 * 24 * 60 * 60 * 1000) {
                        data.push(d as Prediction);
                    }
                });
                setPredictions(data.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds));
            } else {
                router.push('/auth');
            }
        });
        return () => unsubscribe();
    }, [router]);

    const downloadPDF = async () => {
        if (!user || predictions.length === 0) return;

        const doc = new jsPDF('p', 'mm', 'a4');
        const margin = { top: 20, bottom: 20, left: 15, right: 15 };
        let y = margin.top;

        // Add Title
        doc.setFontSize(18);
        doc.setTextColor('#000000');
        doc.text('Quality Prediction Report', margin.left, y);
        y += 10;

        // Add User Info
        doc.setFontSize(12);
        doc.setTextColor('#000000');
        doc.text(`User: ${user.email}`, margin.left, y);
        y += 5;
        doc.text(`UID: ${user.uid}`, margin.left, y);
        y += 10;

        // Capture Table with html2canvas
        const table = document.getElementById('prediction-table');
        if (table) {
            try {
                const canvas = await html2canvas(table, {
                    scale: 4, // Increased scale for even higher resolution
                    useCORS: true,
                    backgroundColor: '#ffffff', // Ensure white background
                });
                const imgData = canvas.toDataURL('image/png');

                const pageWidth = doc.internal.pageSize.getWidth();
                const imgWidth = pageWidth - (margin.left + margin.right);
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                doc.addImage(imgData, 'PNG', margin.left, y, imgWidth, imgHeight);
                y += imgHeight + 10;
            } catch (error) {
                console.error('Error capturing table:', error);
                doc.text('Error: Could not render table.', margin.left, y);
                y += 10;
            }
        } else {
            doc.text('Error: Table not found.', margin.left, y);
            y += 10;
        }

        // Add Chart (Placeholder - Replace with your logic)
        doc.setFontSize(14);
        doc.setTextColor('#000000');
        doc.text('Prediction Trends', margin.left, y);
        y += 10;

        // Placeholder for Chart - Adapt to your charting library
        doc.rect(margin.left, y, doc.internal.pageSize.getWidth() - (margin.left + margin.right), 80);
        doc.text('Chart Placeholder', margin.left + 5, y + 10);

        doc.save('prediction_report.pdf');
    };

    if (!user) return <div className="text-white p-10 bg-[#e0f2f7]">🔄 Loading your dashboard...</div>;

    return (
        <div className="min-h-screen bg-[#e0f2f7] text-black">
            <header className="bg-[#f0f9ff] p-6 border-b border-gray-200 shadow-md flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#8AAEEB]">
                    <span className="text-[#8AAEEB] mr-2">📊</span> Quality Dashboard
                </h1>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={downloadPDF}
                        className="bg-[#8AAEEB] hover:bg-[#a0c1f0] transition px-4 py-2 rounded-md font-semibold text-white shadow-lg text-sm"
                    >
                        📄 Download Report
                    </button>
                    <button
                        onClick={() => router.push('/home')}
                        className="bg-[#8AAEEB] hover:bg-[#a0c1f0] transition px-3 py-2 rounded-md font-semibold text-white shadow-md text-sm"
                    >
                        ⬅ Back to Home
                    </button>
                </div>
            </header>

            <div className="container mx-auto p-8 flex">
                <aside className="w-1/4 bg-[#f0f9ff] p-6 border-r border-gray-200 shadow-xl rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 text-[#8AAEEB]">👤 User Information</h2>
                    <div className="space-y-3 text-gray-700 text-sm">
                        <div className="flex items-center space-x-2">
                            <span className="text-[#8AAEEB]">📧</span>
                            <p>
                                <strong>Email:</strong> <span className="text-[#8AAEEB]">{user.email}</span>
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-[#8AAEEB]">🔑</span>
                            <p>
                                <strong>UID:</strong> <span className="text-[#8AAEEB]">{user.uid}</span>
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-[#8AAEEB]">🛡️</span>
                            <p>
                                <strong>Role:</strong> <span className="text-[#8AAEEB]">Industrial User</span>
                            </p>
                        </div>
                    </div>
                </aside>

                <main className="flex-1 ml-8 space-y-8">
                    <section className="bg-[#f0f9ff] p-6 rounded-lg border border-gray-200 shadow-md">
                        <h2 className="text-xl font-semibold text-[#8AAEEB] mb-4">
                            <span className="text-[#8AAEEB] mr-2">📜</span> Recent Prediction History (Last 30 Days)
                        </h2>
                        {predictions.length === 0 ? (
                            <p className="text-sm text-gray-600">No prediction history found.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table id="prediction-table" className="min-w-full bg-white shadow-md rounded-lg border-collapse">
                                    <thead className="bg-[#0056b3] text-white">
                                        <tr>
                                            <th className="py-2 px-4 text-left border-b border-white">Date</th>
                                            <th className="py-2 px-4 text-left border-b border-white">Temp</th>
                                            <th className="py-2 px-4 text-left border-b border-white">Pressure</th>
                                            <th className="py-2 px-4 text-left border-b border-white">Temp x Pressure</th>
                                            <th className="py-2 px-4 text-left border-b border-white">Fusion</th>
                                            <th className="py-2 px-4 text-left border-b border-white">Transformation</th>
                                            <th className="py-2 px-4 text-left border-b border-white">Rating</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {predictions.map((p, i) => (
                                            <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                                                <td className="py-2 px-4 border-b border-gray-300">
                                                    {new Date(p.timestamp.seconds * 1000).toLocaleDateString()}
                                                </td>
                                                <td className="py-2 px-4 border-b border-gray-300">{p.temp}</td>
                                                <td className="py-2 px-4 border-b border-gray-300">{p.pressure}</td>
                                                <td className="py-2 px-4 border-b border-gray-300">{p.temp_x_pressure}</td>
                                                <td className="py-2 px-4 border-b border-gray-300">{p.fusedMetric}</td>
                                                <td className="py-2 px-4 border-b border-gray-300">{p.transformedMetric}</td>
                                                <td className="py-2 px-4 border-b border-gray-300">{p.quality.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    <section className="bg-[#f0f9ff] p-6 rounded-lg border border-gray-200 shadow-md">
                        <h2 className="text-xl font-semibold text-[#8AAEEB] mb-4">
                            <span className="text-[#8AAEEB] mr-2">📈</span> Prediction Trends
                        </h2>
                        <div className="rounded-lg">
                            <ChartComponent predictions={predictions} />
                        </div>
                                                {predictions.length > 0 && (
                                                    <div className="mt-6 text-center">
                                                        <CSVExport data={predictions} filename="quality_predictions.csv" />
                                                    </div>
                                                )}

                    </section>
                </main>
            </div>
        </div>
    );
}