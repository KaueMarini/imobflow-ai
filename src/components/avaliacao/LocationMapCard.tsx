import { MapPin } from "lucide-react";
import { useState } from "react";

interface LocationMapCardProps {
  bairro: string;
  cidade: string;
  estado: string;
  coords: { lat: string; lon: string } | null;
}

export function LocationMapCard({ bairro, cidade, estado, coords }: LocationMapCardProps) {
  const [imgError, setImgError] = useState(false);

  if (!coords || imgError) {
    return (
      <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
        <div className="bg-white p-3 rounded-full shadow-sm mb-2">
            <MapPin className="h-6 w-6 text-primary" />
        </div>
        <span className="text-[10px] font-bold uppercase text-slate-500">
            {bairro}
        </span>
        <span className="text-[8px] uppercase text-slate-400">
            {cidade} - {estado}
        </span>
      </div>
    );
  }

  // URL do OpenStreetMap Estático (Mais estável para PDF)
  // Zoom 14 mostra o bairro bem.
  const staticMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${coords.lat},${coords.lon}&zoom=14&size=600x600&maptype=mapnik&markers=${coords.lat},${coords.lon},red-pushpin`;

  return (
    <div className="relative w-full h-full bg-slate-200">
      <img 
        src={staticMapUrl} 
        alt={`Mapa de ${bairro}`} 
        className="w-full h-full object-cover"
        crossOrigin="anonymous"
        onError={() => setImgError(true)}
      />
      
      {/* Overlay para dar acabamento profissional */}
      <div className="absolute inset-0 ring-1 ring-black/5 rounded-full" />
    </div>
  );
}