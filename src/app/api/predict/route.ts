// src/app/api/predict/route.ts
import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // ✅ Input Validation
        const requiredFields = ['temp', 'pressure', 'temp_x_pressure', 'fusion', 'transformation', 'uid'];
        for (const field of requiredFields) {
            if (body[field] === undefined || body[field] === null || isNaN(parseFloat(body[field]))) {
                return NextResponse.json({ error: `Missing or invalid field: ${field}` }, { status: 400 });
            }
        }

        const input = JSON.stringify({
            temp: parseFloat(body.temp),
            pressure: parseFloat(body.pressure),
            temp_x_pressure: parseFloat(body.temp_x_pressure),
            fusion: parseFloat(body.fusion),
            transformation: parseFloat(body.transformation),
        });

        return new Promise((resolve) => {
            const process = spawn('python', ['src/app/ml/predict.py', input]);

            let result = '';
            let error = '';

            process.stdout.on('data', (data) => {
                result += data.toString();
            });

            process.stderr.on('data', (data) => {
                error += data.toString();
            });

            process.on('close', async (code) => {
                if (code === 0) {
                    const predictionValue = parseFloat(result.trim());

                    try {
                        await addDoc(collection(db, 'predictions'), {
                            uid: body.uid, // Use the uid from the request body
                            temp: parseFloat(body.temp),
                            pressure: parseFloat(body.pressure),
                            temp_x_pressure: parseFloat(body.temp_x_pressure),
                            fusion: parseFloat(body.fusion),
                            transformation: parseFloat(body.transformation),
                            prediction: predictionValue,
                            createdAt: Timestamp.now(),
                        });
                    } catch (e) {
                        console.error("Error saving to Firestore:", e);
                    }

                    resolve(NextResponse.json({ prediction: predictionValue }));
                } else {
                    console.error('Prediction error:', error);
                    resolve(
                        NextResponse.json({ error: 'Failed to predict. Check backend.' }, { status: 500 })
                    );
                }
            });
        });
    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }
}