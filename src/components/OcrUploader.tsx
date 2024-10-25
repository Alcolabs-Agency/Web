import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import './tableStyles.css';

const OcrUploader = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [tableData, setTableData] = useState<string[][]>([]);
  const [mappedColumns, setMappedColumns] = useState<string[]>([]);
  const [documentColumns, setDocumentColumns] = useState<string[]>([]);
  const [columnMappingData, setColumnMappingData] = useState<any>({});

  
  const attributesOfSquare = [
    "Nombre del artículo",
    "Tipo de artículo",
    "Descripción",
    "SKU",
    "Precio",
    "Cantidad"
  ];

  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imgSrc = URL.createObjectURL(file);
      setImage(imgSrc);
    } else {
      setError('Por favor selecciona un archivo de imagen.');
    }
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);

    if (image) {
      try {
        const result = await Tesseract.recognize(image, 'eng', {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(Math.round(m.progress * 100));
            }
          },
        });

        const { text } = result.data;
        setText(text);

        // Transfor texto estructura tabular
        const rows = text.split('\n').map(row => row.split(/\s+/));
        setTableData(rows);
        setDocumentColumns(rows[0]); 
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
    const newDocumentColumns = [...documentColumns, `Columna ${documentColumns.length + 1}`];
    const newTableData = tableData.map(row => [...row, '']);
    setDocumentColumns(newDocumentColumns);
    setTableData(newTableData);
  };

  const handleDeleteColumn = (colIndex: number) => {
    const newDocumentColumns = documentColumns.filter((_, index) => index !== colIndex);
    const newTableData = tableData.map(row => row.filter((_, index) => index !== colIndex));
    setDocumentColumns(newDocumentColumns);
    setTableData(newTableData);
  };

  
  const handleColumnNameChange = (colIndex: number, value: string) => {
    const newDocumentColumns = [...documentColumns];
    newDocumentColumns[colIndex] = value;
    setDocumentColumns(newDocumentColumns);
  };

  
  const resetForm = () => {
    setImage(null);
    setText('');
    setTableData([]);
    setDocumentColumns([]);
    setMappedColumns([]);
    setColumnMappingData({});
    setProgress(0);
    setError(null);
  };

  return (

    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Subir Imagen o Capturar con Cámara</h1>

      <p className="text-gray-600 mb-6">
        Cargue una imagen o use la cámara del dispositivo para capturar una nueva.
      </p>

      <div className="flex space-x-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
        />
      </div>

      {image && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Imagen seleccionada:</h3>
          <img src={image} alt="Imagen seleccionada" className="w-full h-auto rounded-lg shadow-lg mt-2" />
        </div>
      )}

      <div className="mt-6 flex space-x-4">
        <button
          onClick={handleSubmit}
          disabled={!image || loading}
          className={`w-auto py-2 px-4 rounded-md text-white font-bold ${loading ? 'bg-indigo-400' : 'bg-indigo-600'} transition-colors duration-300`}
        >
          {loading ? `Procesando... ${progress}%` : 'Subir Imagen'}
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
      </div>

      {loading && (
        <div className="mt-4">
          <p className="text-center mb-2">Procesando la imagen... {progress}%</p>
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

    
      {tableData.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <h3 className="text-lg font-bold">Datos extraídos (editable):</h3>
          <table className="table-auto w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-500">
              <tr>
                {documentColumns.map((colName, colIndex) => (
                  <th key={colIndex} className="border px-20 py-4 text-left text-sm font-bold">
                    <input
                      type="text"
                      value={colName}
                      onChange={(e) => handleColumnNameChange(colIndex, e.target.value)}
                      className="w-full bg-gray-100 p-2 rounded text-black"
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
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}>
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

      {/* Segunda tabla aqui */}
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

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default OcrUploader;
