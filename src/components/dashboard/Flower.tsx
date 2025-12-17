interface FlowerProps {
  progress: number; // 0-100
}

export function Flower({ progress }: FlowerProps) {
  const getOpacity = (threshold: number) => (progress >= threshold ? 1 : 0);
  const getScale = (start: number, end: number) => {
    if (progress < start) return 0;
    if (progress > end) return 1;
    return (progress - start) / (end - start);
  };
  
  const stemScale = getScale(10, 40);
  const leaf1Scale = getScale(30, 50);
  const leaf2Scale = getScale(35, 55);
  const budScale = getScale(50, 70);
  const petalScale = getScale(70, 95);

  return (
    <div className="w-64 h-64 md:w-80 md:h-80 flex items-center justify-center" aria-label={`Flower growth progress: ${Math.round(progress)}%`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Pot */}
        <path d="M60 180 h80 v-20 a10,10 0 0 0 -10,-10 h-60 a10,10 0 0 0 -10,10 v20 z" fill="hsl(var(--secondary))" />
        <path d="M55 150 h90 v-5 h-90 z" fill="hsl(var(--secondary))" />

        {/* Soil */}
        <ellipse cx="100" cy="150" rx="42" ry="8" fill="hsl(var(--foreground))" style={{ opacity: 0.2, transition: 'opacity 0.5s' }} opacity={getOpacity(5)} />
        
        {/* Stem */}
        <g style={{ transformOrigin: 'bottom center', transform: `scaleY(${stemScale})`, transition: 'transform 1s ease-out' }}>
          <rect x="97" y="50" width="6" height="100" fill="#A9DFBF" rx="3" />
        </g>
        
        {/* Leaves */}
        <g style={{ transformOrigin: 'bottom left', transform: `scale(${leaf1Scale})`, transition: 'transform 1s ease-out' }} opacity={getOpacity(30)}>
          <path d="M97 120 C 60 110, 70 70, 97 90" fill="#A9DFBF" />
        </g>
        <g style={{ transformOrigin: 'bottom right', transform: `scale(${leaf2Scale})`, transition: 'transform 1s ease-out' }} opacity={getOpacity(35)}>
          <path d="M103 110 C 140 100, 130 60, 103 80" fill="#A9DFBF" />
        </g>
        
        {/* Bud/Center */}
        <circle cx="100" cy="50" r="15" fill="#F4D03F" style={{ transformOrigin: 'center', transform: `scale(${budScale})`, transition: 'transform 1s ease-out' }} opacity={getOpacity(50)} />

        {/* Petals */}
        {[0, 60, 120, 180, 240, 300].map(angle => (
          <g key={angle} transform={`rotate(${angle} 100 50)`} style={{ transformOrigin: 'center', transform: `rotate(${angle}deg) scale(${petalScale})`, transition: 'transform 1s ease-out' }} opacity={getOpacity(70)}>
            <ellipse cx="100" cy="20" rx="10" ry="20" fill="hsl(var(--primary))" />
          </g>
        ))}

        {/* Fully Bloomed Sparkle */}
        {progress >= 100 && (
           <g style={{ animation: 'pulse 2s infinite' }}>
              <path d="M100 0 L105 15 L120 20 L105 25 L100 40 L95 25 L80 20 L95 15 Z" fill="rgba(252, 244, 3, 0.8)"/>
           </g>
        )}
        <style>{`
          @keyframes pulse {
            0% { transform: scale(0.9); opacity: 0.7; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(0.9); opacity: 0.7; }
          }
        `}</style>
      </svg>
    </div>
  );
}
