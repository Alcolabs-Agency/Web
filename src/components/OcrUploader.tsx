



import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import './tableStyles.css';

let pdfjsLib: any;
if (typeof window !== 'undefined') {
  pdfjsLib = require('pdfjs-dist/legacy/build/pdf');
  pdfjsLib.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.entry');
}

const OcrUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [tableData, setTableData] = useState<string[][]>([]);
  const [documentColumns, setDocumentColumns] = useState<string[]>([]);
  const [mappedColumns, setMappedColumns] = useState<string[]>([]);
  const [columnMappingData, setColumnMappingData] = useState<any>({});
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState<{ [key: string]: string }>({});

  const attributesOfSquare = [
    "Nombre del artículo",
    "Tipo de artículo",
    "Descripción",
    "SKU",
    "Precio",
    "Cantidad",
    "Unidad de Medida"
  ];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        processPDF(file);
      } else if (file.type.startsWith('image/')) {
        setFile(file);
        setImage(URL.createObjectURL(file));
        setError(null);
        setThumbnails([URL.createObjectURL(file)]);
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

        let fullText = '';
        const numPages = pdf.numPages;
        const tempThumbnails: string[] = new Array(numPages);

        //  páginas en paralelo
        const pagePromises = [];
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          pagePromises.push(processPage(pdf, pageNum, numPages, tempThumbnails));
        }

        const pageTexts = await Promise.all(pagePromises);
        fullText = pageTexts.join('\n');

        setText(fullText);
        setThumbnails(tempThumbnails); // miniaturas en el orden correcto
        processTextToData(fullText);
        setLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const processPage = async (pdf: any, pageNum: number, numPages: number, tempThumbnails: string[]) => {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    let pageText = '';

    if (context) {
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: context, viewport }).promise;

      const imgData = canvas.toDataURL('image/png');
      tempThumbnails[pageNum - 1] = imgData; //  en el índice correcto

      const result = await Tesseract.recognize(imgData, 'spa', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(prevProgress => {
              const newProgress = Math.round(((pageNum - 1 + m.progress) / numPages) * 100);
              return newProgress > prevProgress ? newProgress : prevProgress;
            });
          }
        },
      });

      pageText = result.data.text;
    }

    return pageText;
  };

  const processTextToData = (text: string) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');

    // encabezados y datos de la tabla
    const { headers, dataRows } = extractTableData(lines);

    if (headers.length === 0) {
      setError('No se pudo detectar el encabezado de la tabla. Por favor, ajuste manualmente.');
      setLoading(false);
      return;
    }

    setDocumentColumns(headers);
    setTableData(dataRows);
  };

  const extractTableData = (lines: string[]) => {
    let headers: string[] = [];
    let dataRows: string[][] = [];

    
    const headerRegex = /^(.*?(?:cantidad|descripcion|descripción|sku|clave|unidad|precio|importe).*)$/i;
    const dataRegex = /^[\d\s\w]+$/i;

    let headerIndex = -1;

    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (headerRegex.test(line)) {
        headers = line.split(/\s{2,}|\t|;/).map(cell => cell.trim());
        headerIndex = i;
        break;
      }
    }

    // Si no se encontró encabezadointentar usar palabras clave
    if (headerIndex === -1) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const matches = attributesOfSquare.filter(attr => line.toLowerCase().includes(attr.toLowerCase()));
        if (matches.length >= 2) {
          headers = line.split(/\s{2,}|\t|;/).map(cell => cell.trim());
          headerIndex = i;
          break;
        }
      }
    }

    
    if (headerIndex !== -1) {
      for (let i = headerIndex + 1; i < lines.length; i++) {
        const line = lines[i];

        if (isEndOfTable(line)) {
          break;
        }

        if (dataRegex.test(line)) {
          const row = line.split(/\s{2,}|\t|;/).map(cell => cell.trim());
          const adjustedRow = adjustRowLength(row, headers.length);
          dataRows.push(adjustedRow);
        }
      }
    }

    return { headers, dataRows };
  };

  const isEndOfTable = (line: string): boolean => {
    const endTableKeywords = ["subtotal", "total", "iva", "importe", "pago"];
    return endTableKeywords.some(keyword => line.toLowerCase().includes(keyword));
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);

    if (file && file.type.startsWith('image/')) {
      try {
        const result = await Tesseract.recognize(URL.createObjectURL(file), 'spa', {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          },
        });

        const { text } = result.data;
        setText(text);
        processTextToData(text);
      } catch (err) {
        setError('No se pudo procesar la imagen.');
        console.error('Error OCR:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleColumnMapping = (value: string, index: number) => {
    const newMappings = [...mappedColumns];
    newMappings[index] = value;
    setMappedColumns(newMappings);

    const columnIndex = documentColumns.indexOf(value);
    if (columnIndex >= 0) {
      const selectedData = tableData.map(row => row[columnIndex]);
      const newColumnMappingData = { ...columnMappingData, [index]: selectedData };
      setColumnMappingData(newColumnMappingData);
    }
  };

  const handleAddColumn = () => {
    const newColumnName = prompt('Ingrese el nombre de la nueva columna:');
    if (newColumnName) {
      const newDocumentColumns = [...documentColumns, newColumnName];
      const newTableData = tableData.map(row => [...row, '']);
      setDocumentColumns(newDocumentColumns);
      setTableData(newTableData);
    }
  };

  const handleDeleteColumn = (colIndex: number) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta columna?');
    if (confirmDelete) {
      const newDocumentColumns = documentColumns.filter((_, index) => index !== colIndex);
      const newTableData = tableData.map(row => row.filter((_, index) => index !== colIndex));
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

    tableData.forEach(row => {
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
      <p className="text-gray-600 mb-6">Cargue una imagen o un archivo PDF para extraer texto y procesarlo en una tabla.</p>

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
            <img key={index} src={thumbnail} alt={`Página ${index + 1}`} className="w-full h-auto rounded-lg shadow-md" />
          ))}
        </div>
      )}

      <div className="mt-6 flex space-x-4">
        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className={`w-auto py-2 px-4 rounded-md text-white font-bold ${loading ? 'bg-indigo-400' : 'bg-indigo-600'} transition-colors duration-300`}
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
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-50" : "bg-blue-100"}>
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
                    {columnMappingData[index] ? columnMappingData[index].join(', ') : 'No asignado'}
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
