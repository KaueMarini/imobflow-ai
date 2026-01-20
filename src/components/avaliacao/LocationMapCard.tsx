import { MapPin, Navigation, Waves } from "lucide-react";

interface LocationMapCardProps {
  bairro: string;
  cidade: string;
  estado: string;
  coords: { lat: string; lon: string } | null;
}

export function LocationMapCard({ bairro, cidade, estado, coords }: LocationMapCardProps) {
  // Formatar coordenadas para exibição
  const formatCoord = (coord: string, type: 'lat' | 'lon') => {
    const num = parseFloat(coord);
    const abs = Math.abs(num);
    const degrees = Math.floor(abs);
    const minutes = Math.floor((abs - degrees) * 60);
    const seconds = Math.round(((abs - degrees) * 60 - minutes) * 60);
    const direction = type === 'lat' ? (num < 0 ? 'S' : 'N') : (num < 0 ? 'W' : 'E');
    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  return (
    <div className="relative overflow-hidden rounded-lg" style={{ height: '120px' }}>
      {/* Background gradiente representando o litoral */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 30%, #22c55e 60%, #16a34a 100%)',
        }}
      />
      
      {/* Padrão de ondas do mar */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="waves" x="0" y="0" width="40" height="10" patternUnits="userSpaceOnUse">
              <path 
                d="M0 5 Q10 0 20 5 Q30 10 40 5" 
                stroke="white" 
                strokeWidth="1" 
                fill="none"
              />
            </pattern>
          </defs>
          <rect x="0" y="0" width="40%" height="100%" fill="url(#waves)" />
        </svg>
      </div>

      {/* Grid de ruas estilizado */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect x="40%" y="0" width="60%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Área do bairro destacada */}
      <div 
        className="absolute flex items-center justify-center"
        style={{
          top: '50%',
          left: '60%',
          transform: 'translate(-50%, -50%)',
          width: '80px',
          height: '60px',
        }}
      >
        {/* Círculo pulsante de destaque */}
        <div 
          className="absolute rounded-full animate-ping opacity-30"
          style={{
            width: '50px',
            height: '50px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
          }}
        />
        
        {/* Área do bairro */}
        <div 
          className="absolute rounded-xl border-2 border-white/60 shadow-lg"
          style={{
            width: '70px',
            height: '45px',
            background: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(2px)',
          }}
        />
        
        {/* Pin central */}
        <div className="relative z-10 flex flex-col items-center">
          <div 
            className="rounded-full p-1.5 shadow-lg"
            style={{
              background: 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.5)',
            }}
          >
            <MapPin className="h-3 w-3 text-white" fill="white" />
          </div>
          <div 
            className="w-0.5 h-2 mt-0.5 rounded-full"
            style={{ background: 'rgba(0,0,0,0.2)' }}
          />
        </div>
      </div>

      {/* Label do oceano */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
        <Waves className="h-3 w-3 text-white/70" />
        <span className="text-[8px] text-white/70 uppercase tracking-widest font-medium">
          Oceano Atlântico
        </span>
      </div>

      {/* Card de informação */}
      <div 
        className="absolute bottom-2 right-2 rounded-lg px-3 py-2 text-right"
        style={{
          background: 'rgba(255,255,255,0.95)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
        }}
      >
        <div className="flex items-center justify-end gap-1.5 mb-1">
          <Navigation className="h-2.5 w-2.5 text-sky-600" />
          <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wide">
            {bairro}
          </span>
        </div>
        <p className="text-[8px] text-slate-500 font-medium">
          {cidade}/{estado}
        </p>
        {coords && (
          <p className="text-[7px] text-slate-400 mt-0.5 font-mono">
            {formatCoord(coords.lat, 'lat')} {formatCoord(coords.lon, 'lon')}
          </p>
        )}
      </div>

      {/* Bússola decorativa */}
      <div className="absolute top-2 right-2">
        <div 
          className="rounded-full p-1"
          style={{
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" strokeOpacity="0.6"/>
            <path d="M12 2V6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M12 18V22" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round"/>
            <path d="M2 12H6" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round"/>
            <path d="M18 12H22" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round"/>
            <text x="12" y="5" textAnchor="middle" fill="white" fontSize="4" fontWeight="bold">N</text>
          </svg>
        </div>
      </div>

      {/* Label da cidade sutilmente no fundo */}
      <div className="absolute bottom-2 left-2">
        <span className="text-[7px] text-white/40 uppercase tracking-[0.3em] font-bold">
          {cidade}
        </span>
      </div>
    </div>
  );
}
