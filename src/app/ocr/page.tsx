"use client";
import OcrUploader from "@/components/OcrUploader";


export default function OcrPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#5232A1] via-[#4007b9] to-[#000000] p-6">
      <h1 className="text-4xl font-bold text-center text-white mb-8">
        OCR Preprocessing Page
      </h1>
      <div className="space-y-8">
        <OcrUploader />
        
      </div>
    </div>
  );
}
