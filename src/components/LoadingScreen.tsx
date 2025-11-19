
import React, { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";

const images = [
  'https://www.dropbox.com/scl/fi/hf83ove9og2psj4pvcbh9/Graphics_Design_Box_3D.png?rlkey=2lsj6r2fn7nh8wtahjt29jtc8&st=a9wlt9un&raw=1',
  'https://www.dropbox.com/scl/fi/clxxem3b8jkc956w6v97j/Creative_Suite_3D_Product_Box.png?rlkey=akm5psygop1jv3llov57qyvzp&st=5lrbjwix&raw=1',
  'https://www.dropbox.com/scl/fi/r8lospdkhp2o5pg144gjj/Namibian_Hockey_Action_Close-up.png?rlkey=4nzrner555gcg54htk5cwwf5s&st=cl7h2rqj&raw=1',
  'https://www.dropbox.com/scl/fi/1u4re3uokp3h2ygjmw0p5/1031094_1168.jpg?rlkey=h413dum7eqczz286es4216nc8&st=6686dwhl&raw=1'
];

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => setVisible(false), 500);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 50); // Adjusted interval to fill 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-[#FFF7F0] flex flex-col items-center justify-center z-50 transition-opacity duration-500 overflow-hidden">
      <div className="absolute inset-0">
        {images.map((src, index) => {
          const angle = Math.random() * 360;
          const distance = Math.random() * 500 + 200;
          const rotation = Math.random() * 720 - 360;
          const delay = Math.random() * 1;
          return (
            <img
              key={index}
              src={src}
              className="absolute top-1/2 left-1/2 w-24 h-24 object-contain opacity-0"
              style={{
                transform: 'translate(-50%, -50%)',
                animation: `fly-out 4s ease-out ${delay}s forwards`,
                //@ts-ignore
                '--tx': `${Math.cos(angle) * distance}px`,
                '--ty': `${Math.sin(angle) * distance}px`,
                '--r': `${rotation}deg`,
              }}
            />
          );
        })}
      </div>
      <div className="relative w-32 h-32 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-orange-200"></div>
        <div 
          className="absolute inset-0 rounded-full border-4 border-orange-400" 
          style={{
            clipPath: `inset(0 ${100 - progress}% 0 0)`,
            transform: 'rotate(-90deg)',
          }}
        ></div>
        <div className="absolute inset-2 bg-orange-400 rounded-full flex items-center justify-center">
          <span className="text-white text-4xl font-bold">PW</span>
        </div>
      </div>
      <h1 className="text-2xl font-bold text-orange-500 mb-4">PassionWorld Designs</h1>
      <div className="w-64">
        <Progress value={progress} className="w-full" />
        <p className="text-center text-orange-500 mt-2">{progress}%</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
