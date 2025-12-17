interface FlowerProps {
  progress: number; // 0-100
  subject: string;
}

const subjectStyles: Record<string, Record<string, string>> = {
  "Mathematics": {
    stem: "#6A8A82",
    leaf: "#6A8A82",
    bud: "#3B82F6",
    petal: "#60A5FA",
    petalAccent: "#3B82F6",
  },
  "Science": {
    stem: "#706c3a",
    leaf: "#706c3a",
    bud: "#7E57C2",
    petal: "#9575CD",
    petalAccent: "#7E57C2",
  },
  "Social Studies": {
    stem: "#5C6B73",
    leaf: "#5C6B73",
    bud: "#EC4899",
    petal: "#F472B6",
    petalAccent: "#EC4899",
  },
  "English": {
    stem: "#8a6c3a",
    leaf: "#8a6c3a",
    bud: "#FBBF24",
    petal: "#FCD34D",
    petalAccent: "#FBBF24",
  }
}

const DefaultStyle = {
  stem: "#706c3a",
  leaf: "#706c3a",
  bud: "#E53B89",
  petal: "#E53B89",
  petalAccent: "#D12F7A",
}

const PetalShapes: Record<string, React.FC<{ style: typeof DefaultStyle }>> = {
  "Mathematics": ({ style }) => (
    <>
      <path d="M100 35 L85 40 C 90 20, 110 20, 115 40 Z" fill={style.petal} />
      <path d="M100 35 L88 38 C 90 25, 100 20, 100 35 Z" fill={style.petalAccent} />
      <path d="M100 35 L112 38 C 110 25, 100 20, 100 35 Z" fill={style.petalAccent} />
    </>
  ),
  "Science": ({ style }) => (
    <>
      <circle cx="100" cy="25" r="15" fill={style.petal} />
      <circle cx="85" cy="40" r="15" fill={style.petal} />
      <circle cx="115" cy="40" r="15" fill={style.petal} />
      <circle cx="90" cy="55" r="15" fill={style.petalAccent} />
      <circle cx="110" cy="55" r="15" fill={style.petalAccent} />
    </>
  ),
  "Social Studies": ({ style }) => (
    <>
      <path d="M100,45 C70,45 70,15 100,15 C130,15 130,45 100,45" fill={style.petalAccent} />
      <path d="M100,45 C80,45 80,25 100,25 C120,25 120,45 100,45" fill={style.petal} />
    </>
  ),
  "English": ({ style }) => (
    <>
      {[0, 60, 120, 180, 240, 300].map(angle => (
        <path key={angle} transform={`rotate(${angle} 100 45)`} d="M100 45 C 90 20, 110 20, 100 45" fill={style.petal} />
      ))}
    </>
  ),
};


export function Flower({ progress, subject }: FlowerProps) {
  const getOpacity = (threshold: number) => (progress >= threshold ? 1 : 0.3);
  const getScale = (start: number, end: number) => {
    if (progress < start) return 0;
    if (progress > end) return 1;
    return (progress - start) / (end - start);
  };
  
  const style = subjectStyles[subject] || DefaultStyle;
  const PetalComponent = PetalShapes[subject] || PetalShapes["Mathematics"];

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
            <path d="M100 130 Q90 140 85 150" stroke={style.stem} fill="none" strokeWidth="3" strokeLinecap="round" />
            <path d="M100 130 Q110 140 115 150" stroke={style.stem} fill="none" strokeWidth="3" strokeLinecap="round" />
            <path d="M95 135 Q85 150 80 160" stroke={style.stem} fill="none" strokeWidth="2" strokeLinecap="round" />
            <path d="M105 135 Q115 150 120 160" stroke={style.stem} fill="none" strokeWidth="2" strokeLinecap="round" />
            <path d="M100 130 Q95 145 90 155" stroke={style.stem} fill="none" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M100 130 Q105 145 110 155" stroke={style.stem} fill="none" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        
        {/* Stem */}
        <g style={{ transformOrigin: 'bottom center', transform: `scaleY(${stemScale})`, transition: 'transform 1s ease-out' }}>
          <path d="M100 130 C 102 100, 98 70, 100 40" stroke={style.stem} fill="none" strokeWidth="5" strokeLinecap="round" />
        </g>
        
        {/* Leaves */}
        <g style={{ transformOrigin: 'bottom left', transform: `scale(${leaf1Scale})`, transition: 'transform 1s ease-out' }} opacity={getOpacity(30)}>
          <path d="M100 100 C 80 95, 85 70, 100 80" fill={style.leaf} />
        </g>
        <g style={{ transformOrigin: 'bottom right', transform: `scale(${leaf2Scale})`, transition: 'transform 1s ease-out' }} opacity={getOpacity(40)}>
          <path d="M100 90 C 120 85, 115 60, 100 70" fill={style.leaf} />
        </g>
        
        {/* Bud/Center */}
        <g style={{ transformOrigin: 'center', transform: `scale(${budScale})`, transition: 'transform 1s ease-out' }} opacity={getOpacity(65)}>
            <path d="M90 45 C 90 30, 110 30, 110 45 Z" fill={style.bud} />
             <circle cx="100" cy="40" r="10" fill={style.petalAccent} />
        </g>

        {/* Petals */}
        <g style={{ transformOrigin: '50% 45px', transform: `scale(${petalScale})`, transition: 'transform 1s ease-out'}} opacity={getOpacity(80)}>
           <PetalComponent style={style} />
        </g>


        {/* Fully Bloomed Sparkle */}
        {progress >= 100 && (
           <g style={{ animation: 'pulse 2s infinite' }}>
              <path d="M100 10 L103 23 L115 25 L103 27 L100 40 L97 27 L85 25 L97 23 Z" fill={style.petalAccent} opacity="0.7"/>
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
