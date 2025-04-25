'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip } from 'recharts';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function PredictPage() {
    const [form, setForm] = useState({
        temp: '',
        pressure: '',
        temp_x_pressure: '',
        fusion: '',
        transformation: '',
    });

    const [prediction, setPrediction] = useState<number | null>(null);
    const [graphData, setGraphData] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const [tooltipField, setTooltipField] = useState<string | null>(null);
    const [loading, setLoading] = useState(false); // Add loading state

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), (authUser) => {
            if (authUser) {
                setUser(authUser);
            } else {
                setUser(null);
                router.push('/auth');
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true); // Set loading to true when the prediction starts
        if (!user) {
            alert('You must be logged in to make predictions.');
            router.push('/auth');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, uid: user.uid }),
            });

            const data = await res.json();

            if (data.prediction) {
                setPrediction(data.prediction);
                setGraphData([
                    { name: 'Temp', value: parseFloat(form.temp) },
                    { name: 'Pressure', value: parseFloat(form.pressure) },
                    { name: 'Temp x Pressure', value: parseFloat(form.temp_x_pressure) },
                    { name: 'Fusion', value: parseFloat(form.fusion) },
                    { name: 'Transformation', value: parseFloat(form.transformation) },
                    { name: 'Quality Rating', value: data.prediction },
                ]);

                // Store the prediction in Firestore
                const predictionsRef = collection(db, 'predictions');
                await addDoc(predictionsRef, {
                    uid: user.uid,
                    temp: parseFloat(form.temp),
                    pressure: parseFloat(form.pressure),
                    temp_x_pressure: parseFloat(form.temp_x_pressure),
                    fusedMetric: parseFloat(form.fusion),
                    transformedMetric: parseFloat(form.transformation),
                    quality: data.prediction,
                    timestamp: serverTimestamp(),
                });

                // Navigate to the dashboard after successful prediction and save
                router.push('/dashboard');
            }
        } catch (err) {
            console.error(err);
            alert('Prediction failed');
        } finally {
            setLoading(false); // Set loading back to false
        }
    };

    const handleInputClick = (fieldName: string) => {
        setTooltipField(fieldName);
    };

    const handleInputBlur = () => {
        setTooltipField(null);
    };

    return (
        <TooltipProvider>
            <div className="min-h-screen bg-[#e0f2f7] text-black flex flex-col items-center justify-center px-4 py-10">
                <Link href="/">
                    <Button className="absolute left-4 top-4 bg-[#8AAEEB] text-white font-bold py-2 px-4 rounded-md hover:bg-[#a0c1f0] transition-transform">
                        Home
                    </Button>
                </Link>

                <div className="w-full max-w-xl bg-gray-100 text-black p-8 rounded-2xl shadow-xl border border-gray-300">
                    <h1 className="text-3xl font-semibold mb-6 text-[#8AAEEB] text-center">
                        Predict Product Quality Rating
                    </h1>

                    {['temp', 'pressure', 'temp_x_pressure', 'fusion', 'transformation'].map((field) => (
                        <div key={field} className="mb-5">
                            <Tooltip open={tooltipField === field}>
                                <TooltipTrigger asChild>
                                    <Input
                                        type="number"
                                        name={field}
                                        value={form[field as keyof typeof form]}
                                        onChange={handleChange}
                                        placeholder={field.replace(/_/g, ' ')}
                                        className="bg-white border border-[#8AAEEB] text-black placeholder-gray-400 focus:ring-2 focus:ring-[#a0c1f0] focus:outline-none"
                                        onClick={() => handleInputClick(field)}
                                        onBlur={handleInputBlur}
                                    />
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-[#8AAEEB] text-white border border-[#a0c1f0] rounded-md shadow-md p-2">
                                    <p className="text-sm">
                                        {field === 'temp' && 'Temperature (100.0 - 300.0 °C)'}
                                        {field === 'pressure' && 'Pressure (5.0 - 25.0 kPa)'}
                                        {field === 'temp_x_pressure' && 'Temp x Pressure (513.70 - 7365.01)'}
                                        {field === 'fusion' && 'Fusion (10156.97 - 103756.18)'}
                                        {field === 'transformation' && 'Transformation (999946.22 - 26997826.13)'}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    ))}

                    <Button
                        onClick={handleSubmit}
                        className="w-full bg-[#8AAEEB] text-white font-bold py-2 rounded-md hover:bg-[#a0c1f0] transition-transform"
                        disabled={loading}
                    >
                        {loading ? 'Predicting...' : 'Predict Quality Rating'}
                    </Button>

                    {prediction !== null && (
                        <div className="mt-8">
                            <h2 className="text-xl font-bold text-[#8AAEEB] text-center mb-4">
                                📊 Predicted Quality Rating: {prediction.toFixed(4)}
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={graphData}>
                                    <XAxis dataKey="name" stroke="#000000" />
                                    <YAxis stroke="#000000" />
                                    <ReTooltip contentStyle={{ backgroundColor: '#8AAEEB', color: '#ffffff', border: '1px solid #a0c1f0', borderRadius: '4px' }} />
                                    <Bar dataKey="value" fill="#a0c1f0" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>
        </TooltipProvider>
    );
}