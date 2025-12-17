interface FlowerProps {
  progress: number; // 0-100
}

export function Flower({ progress }: FlowerProps) {
  const getOpacity = (threshold: number) => (progress >= threshold ? 1 : 0.3);
  const getScale = (start: number, end: number) => {
    if (progress < start) return 0;
    if (progress > end) return 1;
    return (progress - start) / (end - start);
  };
  
  const rootScale = getScale(0, 20);
  const stemScale = getScale(15, 50);
  const leaf1Scale = getScale(30, 60);
  const leaf2Scale = getScale(40, 70);
  const budScale = getScale(65, 85);
  const petalScale = getScale(80, 100);

  return (
    <div className="w-64 h-64 md:w-80 md:h-80 flex items-center justify-center" aria-label={`Flower growth progress: ${Math.round(progress)}%`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Roots */}
        <g style={{ transformOrigin: 'top center', transform: `scale(${rootScale})`, transition: 'transform 1s ease-out' }} opacity={getOpacity(5)}>
            <path d="M100 130 Q90 140 85 150" stroke="#706c3a" fill="none" strokeWidth="3" strokeLinecap="round" />
            <path d="M100 130 Q110 140 115 150" stroke="#706c3a" fill="none" strokeWidth="3" strokeLinecap="round" />
            <path d="M95 135 Q85 150 80 160" stroke="#706c3a" fill="none" strokeWidth="2" strokeLinecap="round" />
            <path d="M105 135 Q115 150 120 160" stroke="#706c3a" fill="none" strokeWidth="2" strokeLinecap="round" />
            <path d="M100 130 Q95 145 90 155" stroke="#706c3a" fill="none" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M100 130 Q105 145 110 155" stroke="#706c3a" fill="none" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        
        {/* Stem */}
        <g style={{ transformOrigin: 'bottom center', transform: `scaleY(${stemScale})`, transition: 'transform 1s ease-out' }}>
          <path d="M100 130 C 102 100, 98 70, 100 40" stroke="#706c3a" fill="none" strokeWidth="5" strokeLinecap="round" />
        </g>
        
        {/* Leaves */}
        <g style={{ transformOrigin: 'bottom left', transform: `scale(${leaf1Scale})`, transition: 'transform 1s ease-out' }} opacity={getOpacity(30)}>
          <path d="M100 100 C 80 95, 85 70, 100 80" fill="#706c3a" />
        </g>
        <g style={{ transformOrigin: 'bottom right', transform: `scale(${leaf2Scale})`, transition: 'transform 1s ease-out' }} opacity={getOpacity(40)}>
          <path d="M100 90 C 120 85, 115 60, 100 70" fill="#706c3a" />
        </g>
        
        {/* Bud/Center */}
        <g style={{ transformOrigin: 'center', transform: `scale(${budScale})`, transition: 'transform 1s ease-out' }} opacity={getOpacity(65)}>
            <path d="M90 45 C 90 30, 110 30, 110 45 Z" fill="#706c3a" />
        </g>

        {/* Petals */}
        <g style={{ transformOrigin: '50% 45px', transform: `scale(${petalScale})`, transition: 'transform 1s ease-out'}} opacity={getOpacity(80)}>
            <path d="M100 35 L85 40 C 90 20, 110 20, 115 40 Z" fill="#E53B89" />
            <path d="M100 35 L88 38 C 90 25, 100 20, 100 35 Z" fill="#D12F7A" />
            <path d="M100 35 L112 38 C 110 25, 100 20, 100 35 Z" fill="#D12F7A" />
        </g>


        {/* Fully Bloomed Sparkle */}
        {progress >= 100 && (
           <g style={{ animation: 'pulse 2s infinite' }}>
              <path d="M100 10 L103 23 L115 25 L103 27 L100 40 L97 27 L85 25 L97 23 Z" fill="rgba(229, 59, 137, 0.7)"/>
           </g>
        )}
        <style>{`
          @keyframes pulse {
            0% { transform: scale(0.9) rotate(0deg); opacity: 0.7; }
            50% { transform: scale(1.1) rotate(5deg); opacity: 1; }
            100% { transform: scale(0.9) rotate(0deg); opacity: 0.7; }
          }
        `}</style>
      </svg>
    </div>
  );
}
