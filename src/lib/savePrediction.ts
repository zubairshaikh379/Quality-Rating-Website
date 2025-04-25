import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

interface PredictionData {
  uid: string;
  email: string;
  temperature: number;
  pressure: number;
  temp_x_pressure: number;
  fusedMetric: number;
  transformedMetric: number;
  quality: number;
}

export async function savePrediction(data: PredictionData) {
  try {
    await addDoc(collection(db, 'predictions'), {
      ...data,
      timestamp: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error saving prediction:", error);
  }
}
