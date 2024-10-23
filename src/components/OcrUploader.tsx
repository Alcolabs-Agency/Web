import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import './tableStyles.css';



const OcrUploader = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ocrText') || '';
    }
    return '';
  })
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null); 
  const [isChecked, setIsChecked] = useState<boolean>(false); 
  const [tableData, setTableData] = useState<string[][]>([]); 
  const [mappedColumns, setMappedColumns] = useState<string[]>([]); 
  const [documentColumns, setDocumentColumns] = useState<string[]>([]); 


  const attributesOfSquare = [
    "Nombre del artículo",
    "Tipo de artículo",
    "Descripción",
    "SKU",
    "Precio",
    "Cantidad"

    // Otros 
  ];


   // aqui vamos la localStorage en el lado del cliente
   useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedText = localStorage.getItem('ocrText');
      if (storedText) {
        setText(storedText);
      }
    }
  }, []);


    //  aqui guarda cambio en localStorage
    useEffect(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('ocrText', text);
      }
    }, [text]);
  
  


  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo no debe superar los 5MB.');
        return;
      }
      setImage(URL.createObjectURL(file));
      setError(null);
    } else {
      setError('Por favor selecciona un archivo de imagen.');
    }
  };

  

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
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
      })
        const { text } = result.data;
          setText(text); 
          const rows = text.split('\n').map(row => row.split(/\s+/));
          setTableData(rows); 
          setDocumentColumns(rows[0]); 
        } catch (err) {

          console.error('Error en el procesamiento de imagen:', err);
          setError('No se pudo procesar la imagen.');
        } finally {
          setLoading(false);
        }
    }
  };

  
  const handleCellChange = (e: ChangeEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
   const newTableData = [...tableData];
   newTableData[rowIndex][colIndex] = e.target.value;
   setTableData(newTableData);
   localStorage.setItem('tableData', JSON.stringify(newTableData)); 
  };


  //Eliminar una columna

  const handleDeleteColumn = (colIndex: number) => {
    const newTableData = tableData.map(row => row.filter((_, index) => index !== colIndex));
    setTableData(newTableData);
    localStorage.setItem('tableData', JSON.stringify(newTableData)); 
  };

  //resetear

  const resetForm = () => {
    setImage(null);
    setText('');
    setTableData([]);
    setProgress(0);
    setError(null);
    setIsChecked(false);
    localStorage.removeItem('ocrText');
    localStorage.removeItem('tableData');
  };

  
  const handleColumnMapping = (value: string, index: number) => {
    const newMappings = [...mappedColumns];
    newMappings[index] = value;
    setMappedColumns(newMappings);
  };




  
const exportToCSV = () => {
  const csvContent = tableData.map(row => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "ocr-table.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


const exportToJSON = () => {
  const jsonContent = JSON.stringify(tableData);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "ocr-table.json");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Subir Imagen para OCR</h1>
      <p className="text-gray-600 mb-6">
        Cargue una imagen y el sistema extraerá automáticamente el texto visible.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
        />
        
        {image && (
          <div className="mt-4">
            <h3 className="text-lg font-bold">Imagen cargada:</h3>
            <img src={image} alt="Imagen seleccionada" className="w-full h-auto rounded-lg shadow-lg mt-2" />
          </div>
        )}

        <div className="flex items-center mt-4">
          <input 
            type="checkbox" 
            id="confirm" 
            checked={isChecked} 
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="confirm" className="ml-2 text-gray-700">
            Confirmo que la imagen es legible
          </label>
        </div>

        <div className="mt-6 flex space-x-4">
          <button 
            type="submit" 
            disabled={!image || loading || !isChecked} 
            className={`w-auto py-2 px-4 rounded-md text-white font-bold ${loading ? 'bg-indigo-400' : 'bg-indigo-600'} transition-colors duration-300`}
          >
            {loading ? `Procesando... ${progress}%` : 'Subir Imagen'}
          </button>
          {image && (
            <button
              type="button"
              onClick={resetForm}
              className="py-2 px-4 bg-red-600 text-white rounded-md font-semibold transition-colors duration-300"
            >
                Reiniciar
            </button>
            )}
            
        </div>
      </form>

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
          



      {tableData.length > 0  && (
        <div className="mt-6 overflow-x-auto">
          <h3 className="text-lg font-bold">Datos extraído (editable):</h3>
          <table className="table-auto editable-table bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-200">

              <tr>
                {tableData[0].map((_, colIndex) => (
                  <th key={colIndex} className="border px-4 py-2 text-left text-sm font-bold min-w[200px] break-all">
                    Columna {colIndex + 1}
                    <button
                    onClick={() => handleDeleteColumn(colIndex)}
                    className="delete-column ml-2 text-red-600 hover:underline"
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
                  {row .map((cell, colIndex) => (
                    <td key={colIndex} className="border px-4 py-2 text-sm">
                      <input
                      type="text"
                      value={cell}
                      onChange={(e) => handleCellChange(e, rowIndex, colIndex)}
                      className="w-full bg-gray-400 p-4 rounded text-black"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
    

          <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Sincronizar los datos</h2>

          <table className="table-auto sync-table w-full bg-white border border-gray-400 rounded-lg text-black">
              <thead className="bg-gray-300">
                <tr>
                  <th className="px-4 py-2 border bg-gray-900">Atributo de Square</th>
                  <th className="px-4 py-2 border bg-gray-900">Columna del Documento</th>
                </tr>
              </thead>
              <tbody>
                {attributesOfSquare.map((attribute, index) => (
                  <tr key={index} className="border">
                    <td className="px-4 py-2 border bg-gray-700">{attribute}</td>
                    <td className="px-4 py-2 border bg-gray-100">
                      <select
                        className="w-full bg-gray-600 p-2 rounded"
                        value={mappedColumns[index]}
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
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-6 flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
            <button
              onClick={exportToCSV}
              className="py-2 px-4 w-full md:w-auto bg-indigo-600 text-white rounded-md font-semibold transition-colors duration-300"
            >
              Exportar a CSV
            </button>
            <button
              onClick={exportToJSON}
              className="py-2 px-4 w-full md:w-auto bg-indigo-600 text-white rounded-md font-semibold transition-colors duration-300"
            >
              Exportar a JSON
            </button>
          </div>
        </div>
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  )}

    </div>
  );
};

export default OcrUploader;
