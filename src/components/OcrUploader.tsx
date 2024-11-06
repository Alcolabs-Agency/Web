/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect,  ChangeEvent} from 'react';
import Tesseract, {  PSM } from 'tesseract.js';
import './tableStyles.css';
let pdfjsLib: any;
if (typeof window !== 'undefined') {
  pdfjsLib = require('pdfjs-dist/legacy/build/pdf');
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.min.js';
}

interface Word {
  level: string;
  pageNum: string;
  blockNum: string;
  parNum: string;
  lineNum: string;
  wordNum: string;
  left: number;
  top: number;
  width: number;
  height: number;
  conf: number;
  text: string;
}

interface PageData {
  headers: string[];
  tableData: string[][];
}

const OcrUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [tableData, setTableData] = useState<string[][]>([]);
  const [documentColumns, setDocumentColumns] = useState<string[]>([]);
  const [mappedColumns, setMappedColumns] = useState<string[]>([]);
  const [columnMappingData, setColumnMappingData] = useState<{ [key: number]: string[] }>({});
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState<{ [key: string]: string }>({});

  const attributesOfSquare = [
    'Nombre del artículo',
    'Tipo de artículo',
    'Descripción',
    'SKU',
    'Precio',
    'Cantidad',
    'Unidad de Medida',
  ];

  const parseTableFromWords = (words: Word[]): PageData => {
    
    words.sort((a, b) => a.top - b.top);
  
    const rows: Word[][] = [];
    let currentRowTop = -1;
    const rowTolerance = 16; 
  
    
    words.forEach((word) => {
      if (currentRowTop < 0 || Math.abs(word.top - currentRowTop) > rowTolerance) {
        rows.push([]);
        currentRowTop = word.top;
      }
      rows[rows.length - 1].push(word);
    });
  
   
    const tableRows: string[][] = rows.map((rowWords) => {
      rowWords.sort((a, b) => a.left - b.left);
      return rowWords.map((word) => word.text);
    });
  
    const headers = tableRows.shift() || [];
    const tableData = tableRows;
  
    return { headers, tableData };
  };


  const parseTableFromLines = (lines: any[]): PageData => {
    const tableData: string[][] = [];
  
    lines.forEach((line) => {
      const row = line.words.map((word: any) => word.text);
      tableData.push(row);
    });
  
    const maxColumns = Math.max(...tableData.map(row => row.length));
    const headers = [];
    for (let i = 0; i < maxColumns; i++) {
      headers.push(`Columna ${i + 1}`);
    }
  
    return { headers, tableData };
  };
  
  
  // Función cambio de archivo
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
        setError(null);

        if (selectedFile.type.startsWith('image/')) {
          setImage(URL.createObjectURL(selectedFile));
        } else {
          setImage(null);
          setThumbnails([]);
        }
      } else {
        setError('Por favor selecciona una imagen o un archivo PDF.');
        setFile(null);
        setImage(null);
        setThumbnails([]);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
      thumbnails.forEach((thumbnail) => URL.revokeObjectURL(thumbnail));
    };
  }, [image, thumbnails]);

  
  const preprocessImage = async (imageSrc: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageSrc;
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
  
          // Convertir a escala de grises
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = data[i + 1] = data[i + 2] = avg;
          }
          ctx.putImageData(imageData, 0, 0);
  
          resolve(canvas.toDataURL());
        } else {
          resolve(imageSrc);
        }
      };
      img.onerror = () => {
        resolve(imageSrc);
      };
    });
  };
  

  const processImage = async (file: File) => {
    try {
      setLoading(true);
      setProgress(0);

      const imageSrc = await preprocessImage(URL.createObjectURL(file));

      const { data } = await Tesseract.recognize(imageSrc, 'spa', {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.floor(m.progress * 100));
          }
        },
      });

      console.log('Resultados de Tesseract:', data);

      const { headers, tableData } = parseTableFromLines(data.lines);

      if (headers.length > 0 && tableData.length > 0) {
        setDocumentColumns(headers);
        setTableData(tableData);
        setProgress(100);
      } else {
        setError('No se pudo detectar ninguna tabla en la imagen.');
      }
    } catch (err) {
      setError('No se pudo procesar la imagen.');
      console.error('Error OCR:', err);
    } finally {
      setLoading(false);
    }
  };



  const processPDF = async (file: File) => {
    try {
      setLoading(true);
      setProgress(0);
  
      const typedarray = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
  
      const numPages = pdf.numPages;
      const tempThumbnails: string[] = new Array(numPages);
      let allTablesData: string[][] = [];
  
      for (let currentPage = 1; currentPage <= numPages; currentPage++) {
        const page = await pdf.getPage(currentPage);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
  
        await page.render({ canvasContext: context!, viewport }).promise;
  
        const imgData = canvas.toDataURL('image/png');
        tempThumbnails[currentPage - 1] = imgData;
  
        // Preprocesar la imagen
        const preprocessedImage = await preprocessImage(imgData);
  
        const { data } = await Tesseract.recognize(preprocessedImage, 'spa', {
          logger: (m: any) => {
            if (m.status === 'recognizing text') {
              setProgress(
                Math.floor(((currentPage - 1 + m.progress) / numPages) * 100)
              );
            }
          },
        });
  
        console.log(`Resultados de Tesseract para la página ${currentPage}:`, data);
  
        const pageData = parseTableFromLines(data.lines);
        allTablesData = allTablesData.concat(pageData.tableData);
      }
  
      setThumbnails(tempThumbnails);
  
      if (allTablesData.length > 0) {
        // Generar encabezados basados en el número máximo de columnas
        const maxColumns = Math.max(...allTablesData.map(row => row.length));
        const headers = [];
        for (let i = 0; i < maxColumns; i++) {
          headers.push(`Columna ${i + 1}`);
        }
  
        setDocumentColumns(headers);
        setTableData(allTablesData);
        setProgress(100);
      } else {
        setError('No se pudo extraer texto del documento.');
      }
    } catch (error) {
      console.error('Error al procesar el PDF:', error);
      setError('Error al procesar el PDF.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmit = async () => {
    if (file) {
      setError(null);

      if (file.type.startsWith('image/')) {
        await processImage(file);
      } else if (file.type === 'application/pdf') {
        await processPDF(file);
      } else {
        setError('Tipo de archivo no soportado.');
      }
    } else {
      setError('No se ha seleccionado ningún archivo.');
    }
  };

  const handleColumnMapping = (value: string, index: number) => {
    const newMappings = [...mappedColumns];
    newMappings[index] = value;
    setMappedColumns(newMappings);

    const columnIndex = documentColumns.indexOf(value);
    if (columnIndex >= 0) {
      const selectedData = tableData.map((row) => row[columnIndex]);
      const newColumnMappingData = { ...columnMappingData, [index]: selectedData };
      setColumnMappingData(newColumnMappingData);
    }
  };

  const handleAddColumn = () => {
    const newColumnName = prompt('Ingrese el nombre de la nueva columna:');
    if (newColumnName) {
      const newDocumentColumns = [...documentColumns, newColumnName];
      const newTableData = tableData.map((row) => [...row, '']);
      setDocumentColumns(newDocumentColumns);
      setTableData(newTableData);
    }
  };

  const handleDeleteColumn = (colIndex: number) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta columna?');
    if (confirmDelete) {
      const newDocumentColumns = documentColumns.filter((_, index) => index !== colIndex);
      const newTableData = tableData.map((row) => row.filter((_, index) => index !== colIndex));
      setDocumentColumns(newDocumentColumns);
      setTableData(newTableData);
    }
  };

  const handleColumnNameChange = (colIndex: number, value: string) => {
    const newDocumentColumns = [...documentColumns];
    newDocumentColumns[colIndex] = value;
    setDocumentColumns(newDocumentColumns);
  };

  const resetForm = () => {
    setFile(null);
    setImage(null);
    setTableData([]);
    setDocumentColumns([]);
    setMappedColumns([]);
    setColumnMappingData({});
    setProgress(0);
    setError(null);
    setThumbnails([]);
    setLoading(false);
    setAdditionalInfo({});
  };

  const exportToCSV = () => {
    const csvRows = [];
    const headers = documentColumns.join(',');
    csvRows.push(headers);

    tableData.forEach((row) => {
      csvRows.push(row.join(','));
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
          <p className="text-gray-600 mb-6">
            Cargue una imagen o un archivo PDF para extraer texto y procesarlo en una tabla.
          </p>
    
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
        <img
          src={image}
          alt="Imagen subida"
          className="w-full h-auto rounded-lg shadow-md mt-4"
        />
      </div>
    )}
    
          {thumbnails.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-4">
              {thumbnails.map((thumbnail, index) => (
                <img
                  key={index}
                  src={thumbnail}
                  alt={`Página ${index + 1}`}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              ))}
            </div>
          )}
    
          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleSubmit}
              disabled={!file || loading}
              className={`w-auto py-2 px-4 rounded-md text-white font-bold ${
                loading ? 'bg-indigo-400' : 'bg-indigo-600'
              } transition-colors duration-300`}
            >
              {loading ? `Procesando... ${progress}%` : 'Procesar Documento'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="py-2 px-4 bg-red-600 text-white rounded-md font-semibold"
            >
              Reiniciar
            </button>
            <button
              type="button"
              onClick={handleAddColumn}
              className="py-2 px-4 bg-green-600 text-white rounded-md font-semibold"
            >
              Agregar Columna
            </button>
            <button
              type="button"
              onClick={exportToCSV}
              className="py-2 px-4 bg-blue-600 text-white rounded-md font-semibold"
            >
              Exportar a CSV
            </button>
          </div>
    
          {loading && (
            <div className="mt-4">
              <p className="text-center mb-2">Procesando el archivo... {progress}%</p>
              <div className="w-full bg-gray-300 rounded-full">
                <div
                  className="bg-indigo-600 text-xs font-medium text-indigo-100 text-center p-0.5 leading-none rounded-full"
                  style={{ width: `${progress}%` }}
                >
                  {progress}%
                </div>
              </div>
            </div>
          )}
    
          {error && <p className="text-red-600 mt-4">{error}</p>}
    
          {tableData.length > 0 && (
            <div className="mt-6 overflow-x-auto">
              <h3 className="text-lg font-bold">Detalles de Productos</h3>
              <table className="table-auto w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    {documentColumns.map((colName, colIndex) => (
                      <th key={colIndex} className="border px-4 py-4 text-left text-sm font-bold">
                        <input
                          type="text"
                          value={colName}
                          onChange={(e) => handleColumnNameChange(colIndex, e.target.value)}
                          className="w-full bg-blue-100 p-2 rounded text-black"
                        />
                        <button
                          onClick={() => handleDeleteColumn(colIndex)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          Eliminar
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {tableData.map((row, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-blue-100'}>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex} className="border px-4 py-2">
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) => {
                              const newTableData = [...tableData];
                              newTableData[rowIndex][colIndex] = e.target.value;
                              setTableData(newTableData);
                            }}
                            className="w-full bg-gray-200 p-2 rounded text-black"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
    
          {tableData.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">Sincronizar los datos</h2>
              <table className="table-auto w-full bg-white border border-gray-400 rounded-lg text-black">
                <thead className="bg-gray-300">
                  <tr>
                    <th className="px-4 py-2 border bg-gray-600">Atributo de Square</th>
                    <th className="px-4 py-2 border bg-gray-600">Columna del Documento</th>
                    <th className="px-4 py-2 border bg-gray-600">Datos Asignados</th>
                  </tr>
                </thead>
                <tbody>
                  {attributesOfSquare.map((attribute, index) => (
                    <tr key={index} className="border">
                      <td className="px-4 py-2 border bg-gray-400">{attribute}</td>
                      <td className="px-4 py-2 border bg-gray-100">
                        <select
                          className="w-full bg-gray-400 p-2 rounded"
                          value={mappedColumns[index] || ''}
                          onChange={(e) => handleColumnMapping(e.target.value, index)}
                        >
                          <option value="">Seleccionar columna</option>
                          {documentColumns.map((column, i) => (
                            <option key={i} value={column}>
                              {column}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2 border bg-gray-100">
                        {columnMappingData[index]
                          ? columnMappingData[index].join(', ')
                          : 'No asignado'}
                      </td>
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