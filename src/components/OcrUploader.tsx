/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, ChangeEvent } from 'react';
import './tableStyles.css';

let pdfjsLib: any;
if (typeof window !== 'undefined') {
  pdfjsLib = require('pdfjs-dist/legacy/build/pdf');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.min.js';
  pdfjsLib.GlobalWorkerOptions.isEvalSupported = false;
}

// Defini interfaz para las filas procesadas
interface ExtractedRow {
  bbox: string;
  class: string;
  text: string;
  confidence: number;
}

const OcrUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [tableData, setTableData] = useState<ExtractedRow[]>([]); // Cambiado para usar ExtractedRow
  const [documentColumns] = useState<string[]>(['bbox', 'class', 'text', 'confidence']);
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  // Función para manejar el cambio de archivo
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);

      if (selectedFile.type.startsWith('image/')) {
        setImage(URL.createObjectURL(selectedFile));
        setThumbnails([]);
      } else if (selectedFile.type === 'application/pdf') {
        setImage(null);
        generatePDFThumbnails(selectedFile);
      } else {
        setError('Por favor selecciona una imagen o un archivo PDF.');
        setFile(null);
        setImage(null);
        setThumbnails([]);
      }
    }
  };

  // Generar miniaturas para archivos PDF  proximamente para poner a funcionar
  const generatePDFThumbnails = async (file: File) => {
    try {
      const typedarray = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;

      const numPages = pdf.numPages;
      const tempThumbnails: string[] = [];

      for (let currentPage = 1; currentPage <= numPages; currentPage++) {
        const page = await pdf.getPage(currentPage);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context!, viewport }).promise;

        const imgData = canvas.toDataURL('image/png');
        tempThumbnails.push(imgData);
      }

      setThumbnails(tempThumbnails);
    } catch (error) {
      console.error('Error al generar miniaturas del PDF:', error);
      setError('Error al generar miniaturas del PDF.');
    }
  };

  // aqui envia a archivo  backend
  const handleSubmit = async () => {
    if (!file) {
      setError('No se ha seleccionado ningún archivo.');
      return;
    }

    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/process-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al procesar el documento.');
      }

      const result = await response.json();
      const rows: ExtractedRow[] = result.data;

      if (rows && Array.isArray(rows)) {
        setTableData(rows);
      } else {
        setError('No se pudieron extraer datos estructurados del documento.');
      }

      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el documento.');
      console.error('Error al procesar el documento:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setImage(null);
    setTableData([]);
    setThumbnails([]);
    setProgress(0);
    setError(null);
    setLoading(false);
  };

  const exportToCSV = () => {
    const csvRows = [];
    const headers = documentColumns.join(',');
    csvRows.push(headers);

    tableData.forEach((row) => {
      csvRows.push(`${row.bbox},${row.class},${row.text},${row.confidence}`);
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = csvUrl;
    link.setAttribute('download', 'datos_extraidos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Subir Imagen o Archivo PDF para OCR</h1>
      <p className="text-gray-600 mb-6">Cargue una imagen o un archivo PDF para extraer texto y procesarlo en una tabla.</p>

      <div className="flex space-x-6">
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
        />
      </div>

      {image && (
        <div className="mt-6">
          <h3 className="text-lg font-bold">Imagen Subida:</h3>
          <img src={image} alt="Imagen subida" className="w-full h-auto rounded-lg shadow-md mt-4" />
        </div>
      )}

      {thumbnails.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          {thumbnails.map((thumbnail, index) => (
            <img key={index} src={thumbnail} alt={`Página ${index + 1}`} className="w-full h-auto rounded-lg shadow-md" />
          ))}
        </div>
      )}

      <div className="mt-6 flex space-x-4">
        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className={`py-2 px-4 rounded-md text-white font-bold ${loading ? 'bg-indigo-400' : 'bg-indigo-600'}`}
        >
          {loading ? `Procesando... ${progress}%` : 'Procesar Documento'}
        </button>
        <button onClick={resetForm} className="py-2 px-4 bg-red-600 text-white rounded-md font-semibold">
          Reiniciar
        </button>
        <button onClick={exportToCSV} className="py-2 px-4 bg-green-600 text-white rounded-md font-semibold">
          Exportar a CSV
        </button>
      </div>

      {loading && (
        <div className="mt-4">
          <p className="text-center mb-2">Procesando el archivo... {progress}%</p>
          <div className="w-full bg-gray-500 rounded-full">
            <div className="bg-indigo-600 text-xs font-medium text-indigo-500 text-center p-0.5 leading-none rounded-full" style={{ width: `${progress}%` }}>
              {progress}%
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {tableData.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <h3 className="text-lg font-bold text-gray-400">Datos Extraídos</h3>
          <table className="table-auto w-full bg-gray-500 border border-gray-700 rounded-lg shadow-lg text-black">
            <thead className="bg-blue-700 text-white">
              <tr>
                {documentColumns.map((col) => (
                  <th key={col} className="border px-4 py-2 text-left text-sm font-bold">
                    {col.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-600' : 'bg-gray-900'} hover:bg-blue-600`}>
                  <td className="border px-4 py-2 text-center">{row.bbox}</td>
                  <td className="border px-4 py-2 text-center">{row.class}</td>
                  <td className="border px-4 py-2 text-center">{row.text || 'No disponible'}</td>
                  <td className="border px-4 py-2 text-center">{row.confidence.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OcrUploader;

