// src/types/prediction.ts

import { Timestamp } from 'firebase/firestore';

export interface Prediction {
  temp: number;
  pressure: number;
  temp_x_pressure: number;
  fusedMetric: number;
  transformedMetric: number;
  quality: number;
  timestamp: Timestamp;
}