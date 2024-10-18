// import React, { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
// import Image from 'next/image';

// declare const cv: any;

// const OcrWithPreprocessing = () => {
//   const [image, setImage] = useState<string | null>(null);
//   const [text, setText] = useState<string>(''); 
//   const [loading, setLoading] = useState<boolean>(false);
//   const [progress, setProgress] = useState<number>(0);
//   const [error, setError] = useState<string | null>(null); 
//   const [isChecked, setIsChecked] = useState<boolean>(false);
//   const [isOpenCVLoaded, setIsOpenCVLoaded] = useState<boolean>(false);

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
//         setIsOpenCVLoaded(true);
//       };
//       script.onerror = () => {
//         console.error('Error al cargar OpenCV');
//         setError('Error al cargar OpenCV. Intente recargar la página.');
//       };
//       document.body.appendChild(script);
//     } else {
//       setIsOpenCVLoaded(true); // Ya está cargado
//     }
//   }, []);
  
//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setImage(imageUrl);
//       setError(null);
//     }
//   };


  
// };

// export default OcrWithPreprocessing;
