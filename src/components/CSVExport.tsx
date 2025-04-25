'use client';

import { saveAs } from 'file-saver';
import { Timestamp } from 'firebase/firestore';

interface CSVExportProps {
  data: any[];
  filename?: string;
}

export default function CSVExport({ data, filename = 'predictions.csv' }: CSVExportProps) {
  const exportToCSV = () => {
    if (!data || data.length === 0) {
      alert('No data to export.');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];

        if (value instanceof Timestamp) {
          return `"${value.toDate().toLocaleString()}"`;
        }

        if (typeof value === 'number') {
          return value.toFixed(2);
        }

        return `"${value}"`;
      });

      csvRows.push(values.join(','));
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, filename);
  };

  if (!data.length) return null;

  return (
    <button
      onClick={exportToCSV}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mt-4"
    >
      📥 Export CSV
    </button>
  );
}
