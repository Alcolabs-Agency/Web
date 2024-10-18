// import React, { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';

// declare const cv: any;

// const ImagePreprocessor = () => {
//   const [image, setImage] = useState<string | null>(null); 
//   const [text, setText] = useState<string>(''); 
//   const [loading, setLoading] = useState<boolean>(false); 
//   const [progress] = useState<number>(0); 
//   const [error, setError] = useState<string | null>(null); 
//   const [isChecked, setIsChecked] = useState<boolean>(false); 

//   const imageRef = useRef<HTMLImageElement>(null); 
//   const canvasRef = useRef<HTMLCanvasElement>(null); 

//   useEffect(() => {
//     const existingScript = document.querySelector('script[src="https://docs.opencv.org/4.x/opencv.js"]');
//     if (!existingScript && typeof cv === 'undefined') {
//       const script = document.createElement('script');
//       script.src = 'https://docs.opencv.org/4.x/opencv.js';
//       script.async = true;
//       script.onload = () => {
//         console.log('OpenCV loaded');
//       };
//       script.onerror = () => {
//         console.error('Error al cargar OpenCV');
//         setError('Error al cargar OpenCV. Intente recargar la página.');
//       };
//       document.body.appendChild(script);
//     }
//   }, []);


//   
//   
// };

// export default ImagePreprocessor;
