import { useState, ChangeEvent, FormEvent } from 'react';
import Tesseract from 'tesseract.js';

const OcrUploader = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState<string>(''); 
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null); 
  const [isChecked, setIsChecked] = useState<boolean>(false); 

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };


  const resetForm = () => {
    setImage(null);
    setText('');
    setProgress(0);
    setError(null);
    setIsChecked(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);

    if (image) {
      Tesseract.recognize(image, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      })
        .then(({ data: { text } }) => {
          setText(text);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error en el procesamiento de imagen:', err);
          setError('No se pudo procesar la imagen.');
          setLoading(false);
        });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Subir Imagen para OCR</h1>
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
            <h3 className="text-lg font-semibold">Imagen cargada:</h3>
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
            className={`w-auto py-2 px-4 rounded-md text-white font-semibold ${loading ? 'bg-indigo-400' : 'bg-indigo-600'} transition-colors duration-300`}
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
          <div className="w-full bg-gray-200 rounded-full">
            <div
              className="bg-indigo-600 text-xs font-medium text-indigo-100 text-center p-0.5 leading-none rounded-full"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>
        </div>
      )}

      {text && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Texto extraído:</h3>
          <p className="mt-2 text-gray-700 p-3 bg-gray-100 rounded-lg">{text}</p>
        </div>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default OcrUploader;
