import { useEffect, useState, useRef } from 'react';

export default function PDFViewer({ base64Data }) {
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [errorDetails, setErrorDetails] = useState('');

  useEffect(() => {
    const loadPDF = async () => {
      if (!base64Data) {
         setErrorDetails('Aucune donnée PDF fournie');
         return;
      }
      try {
        if (!window.pdfjsLib) {
          throw new Error('La librairie PDF.js n\'a pas pu être chargée depuis internet. Vérifiez votre connexion.');
        }

        const base64Str = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
        
        let binaryStr;
        try {
           binaryStr = window.atob(base64Str);
        } catch (e) {
           throw new Error('Le format du fichier est corrompu ou illisible (Erreur Base64).');
        }

        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }

        const loadingTask = window.pdfjsLib.getDocument({ data: bytes });
        const loadedPdf = await loadingTask.promise;
        setPdf(loadedPdf);
        setNumPages(loadedPdf.numPages);
      } catch (err) {
        console.error('Erreur chargement PDF:', err);
        setErrorDetails(err.message || 'Erreur inconnue');
      }
    };
    loadPDF();
  }, [base64Data]);

  if (errorDetails) {
     return (
       <div className="w-full p-4 bg-red-50 text-red-500 font-bold rounded-2xl text-center border-2 border-red-200 shadow-sm text-sm">
          Erreur: {errorDetails}
       </div>
     );
  }

  if (!pdf) {
    return (
      <div className="w-full h-40 flex items-center justify-center text-gray-400 font-bold italic animate-pulse">
        Traitement du document en cours...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {Array.from(new Array(numPages), (el, index) => (
        <PDFPage key={`page_${index + 1}`} pdf={pdf} pageNumber={index + 1} />
      ))}
    </div>
  );
}

function PDFPage({ pdf, pageNumber }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    let renderTask = null;

    const renderPage = async () => {
      try {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.5 }); // Echelle pour meilleure qualité mobile
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (err) {
        if (err.name !== 'RenderingCancelledException') {
          console.error(`Erreur rendu page ${pageNumber}:`, err);
        }
      }
    };

    renderPage();

    return () => {
      if (renderTask) {
        renderTask.cancel();
      }
    };
  }, [pdf, pageNumber]);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-auto bg-white rounded-2xl shadow-md border border-gray-100" 
      style={{ display: 'block' }}
    />
  );
}
