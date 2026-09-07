
import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

const LoadingScreen = ({ onLoaded }: { onLoaded: () => void }) => {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          onLoaded();
          return 100;
        }
        return prevProgress + 1;
      });
    }, 60); // Adjust interval for loading speed

    return () => clearInterval(timer);
  }, [onLoaded]);
  
  // Background animation elements
    const circles = Array.from({ length: 15 });

  return (
    <div className="fixed inset-0 bg-cream flex flex-col items-center justify-center z-[100] overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
            {circles.map((_, i) => {
            const size = (i + 1) * 2;
            const duration = 50 + Math.random() * 50;
            const delay = Math.random() * 20;

            return (
                <motion.div
                key={i}
                className="absolute rounded-full bg-orange-200/30"
                initial={{ 
                    x: `${Math.random() * 100}vw`, 
                    y: `${Math.random() * 100}vh`,
                    width: `${size}rem`,
                    height: `${size}rem`,
                    opacity: 0,
                }}
                animate={{
                    x: `${Math.random() * 100}vw`,
                    y: `${Math.random() * 100}vh`,
                    opacity: [0, 1, 0],
                }}
                transition={{
                    duration: duration,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: delay,
                    ease: "easeInOut"
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
            <div className="absolute inset-2 bg-orange-400 rounded-full flex items-center justify-center overflow-hidden">
              <img src="https://www.dropbox.com/scl/fi/yjuwodkxly06dkijyf1qt/Lion-Impact.png?rlkey=v6kjupp615w60imu3cdtaimr8&st=ora4loqt&raw=1" alt="PassionWorld Designs Logo" className="w-full h-full object-cover" />
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
