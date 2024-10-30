import React, { useState, useEffect, ChangeEvent } from 'react';
import { createWorker, Worker, PSM } from 'tesseract.js';
import './tableStyles.css';

let pdfjsLib: any;
if (typeof window !== 'undefined') {
  pdfjsLib = require('pdfjs-dist/legacy/build/pdf');
  pdfjsLib.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.entry');
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
  const [text, setText] = useState<string>('');
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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        processPDF(selectedFile);
      } else if (selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
        setImage(URL.createObjectURL(selectedFile));
        setError(null);
        setThumbnails([URL.createObjectURL(selectedFile)]);
      } else {
        setError('Por favor selecciona una imagen o un archivo PDF.');
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

  const processPDF = async (file: File) => {
    setLoading(true);
    setProgress(0);

    const reader = new FileReader();

    reader.onload = async (e) => {
      if (e.target?.result) {
        const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;

        const numPages = pdf.numPages;
        const tempThumbnails: string[] = new Array(numPages);
        let allTablesData: string[][] = [];
        let documentHeaders: string[] = [];

        // Procesar páginas secuencialmente y actualizar el progreso
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const pageData = await processPage(pdf, pageNum, numPages, tempThumbnails);
          setProgress(Math.round((pageNum / numPages) * 100));

          if (pageData.tableData.length > 0) {
            if (documentHeaders.length === 0 && pageData.headers.length > 0) {
              documentHeaders = pageData.headers;
            }
            allTablesData = allTablesData.concat(pageData.tableData);
          }
        }

        setThumbnails(tempThumbnails); // Establecer las miniaturas en el orden correcto

        if (allTablesData.length > 0 && documentHeaders.length > 0) {
          setDocumentColumns(documentHeaders);
          setTableData(allTablesData);
        } else {
          setError('No se pudo detectar ninguna tabla en el documento.');
        }

        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const processPage = async (
    pdf: any,
    pageNum: number,
    numPages: number,
    tempThumbnails: string[]
  ): Promise<PageData> => {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    let pageData: PageData = { headers: [], tableData: [] };

    if (context) {
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: context, viewport }).promise;

      const imgData = canvas.toDataURL('image/png');
      tempThumbnails[pageNum - 1] = imgData; // Almacenar en el índice correcto

      const worker: Worker = await createWorker();

      await worker.load();
      await worker.loadLanguage('spa');
      await worker.initialize('spa');
      await worker.setParameters({
        tessedit_char_whitelist:
          '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzáéíóúÁÉÍÓÚñÑ,.:-/%$',
        preserve_interword_spaces: '1',
        tessedit_pageseg_mode: PSM.AUTO,
      });

      const { data } = await worker.recognize(imgData);

      await worker.terminate();

      if (data.tsv) {
        pageData = parseTableFromTSV(data.tsv);
      }
    }

    return pageData;
  };

  const parseTableFromTSV = (tsv: string): PageData => {
    const lines = tsv.split('\n');
    const words: Word[] = lines
      .slice(1)
      .map((line) => {
        const [
          level,
          pageNum,
          blockNum,
          parNum,
          lineNum,
          wordNum,
          left,
          top,
          width,
          height,
          conf,
          text,
        ] = line.split('\t');
        return {
          level,
          pageNum,
          blockNum,
          parNum,
          lineNum,
          wordNum,
          left: parseInt(left),
          top: parseInt(top),
          width: parseInt(width),
          height: parseInt(height),
          conf: parseFloat(conf),
          text,
        };
      })
      .filter((word) => word.conf > 0 && word.text.trim() !== '');

    const linesMap = new Map<number, Word[]>();
    words.forEach((word) => {
      const key = Math.round(word.top / 10);
      if (!linesMap.has(key)) {
        linesMap.set(key, []);
      }
      linesMap.get(key)?.push(word);
    });

    const sortedLines = Array.from(linesMap.values()).sort((a, b) => a[0].top - b[0].top);

    let headers: string[] = [];
    const dataRows: string[][] = [];
    let headerDetected = false;

    sortedLines.forEach((lineWords) => {
      const sortedWords = lineWords.sort((a, b) => a.left - b.left);
      const lineText = sortedWords.map((w) => w.text).join(' ').toLowerCase();

      if (
        !headerDetected &&
        /cantidad|descripcion|descripción|sku|clave|unidad|precio|importe/.test(lineText)
      ) {
        headers = sortedWords.map((w) => w.text);
        headerDetected = true;
      } else if (headerDetected) {
        const row = sortedWords.map((w) => w.text);
        const adjustedRow = adjustRowLength(row, headers.length);
        dataRows.push(adjustedRow);
      }
    });

    return { headers, tableData: dataRows };
  };

  const adjustRowLength = (row: string[], targetLength: number): string[] => {
    const adjustedRow = [...row];
    while (adjustedRow.length < targetLength) {
      adjustedRow.push('');
    }
    while (adjustedRow.length > targetLength) {
      adjustedRow[adjustedRow.length - 2] += ' ' + adjustedRow[adjustedRow.length - 1];
      adjustedRow.pop();
    }
    return adjustedRow;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setProgress(0);

    if (file && file.type.startsWith('image/')) {
      try {
        const worker: Worker = await createWorker();

        await worker.load();
        await worker.loadLanguage('spa');
        await worker.initialize('spa');
        await worker.setParameters({
          tessedit_char_whitelist:
            '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzáéíóúÁÉÍÓÚñÑ,.:-/%$',
          preserve_interword_spaces: '1',
          tessedit_pageseg_mode: PSM.AUTO,
        });

        const { data } = await worker.recognize(URL.createObjectURL(file));

        await worker.terminate();

        const { headers, tableData } = parseTableFromTSV(data.tsv);

        if (headers.length > 0 && tableData.length > 0) {
          setDocumentColumns(headers);
          setTableData(tableData);
        } else {
          setError('No se pudo detectar ninguna tabla en la imagen.');
        }
      } catch (err) {
        setError('No se pudo procesar la imagen.');
        console.error('Error OCR:', err);
      } finally {
        setLoading(false);
        setProgress(100);
      }
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
    setText('');
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
