import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { LightRays } from './LightRays';

function RotatingTorus() {
  const meshRef = useRef(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 100, 16]} />
      <meshStandardMaterial color="white" wireframe />
    </mesh>
  );
}

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const variants = {
    hidden: { y: 100, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };

  return (
    <section className="min-h-screen bg-black flex flex-col justify-center relative px-6 pt-24 overflow-hidden">
        <LightRays
          raysOrigin="top-center"
          raysColor="#007BFF"
          raysSpeed={1.5}
          lightSpread={1.2}
          rayLength={1.8}
          followMouse={true}
          mouseInfluence={0.3}
          noiseAmount={0.03}
          distortion={0.08}
        />
        <div className="container mx-auto relative z-10">
            <motion.div style={{ y, opacity }}>
                <h1 className="font-display text-[7vw] text-white text-center leading-[0.85]">
                    {['CHASE', 'THE', 'IMPOSSIBLE'].map((line, i) => (
                        <div key={line} className="overflow-hidden">
                            <motion.div
                                custom={i}
                                initial="hidden"
                                animate="visible"
                                variants={variants}
                            >
                                {line}
                            </motion.div>
                        </div>
                    ))}
                </h1>
            </motion.div>
        </div>

        {/* Hero Divider + Meta Row */}
        <div className="container mx-auto mt-12 relative z-10">
            <div className="border-t-2 border-white"></div>
            <div className="flex items-center justify-between py-8 px-2">
                {/* Left: Location */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="font-mono text-[11px] text-white font-bold uppercase tracking-[-0.02em]"
                >
                    Based in<br/>Dhaka, Bangladesh
                </motion.div>

                {/* Center: 3D Scroll Indicator */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                    className="relative w-36 h-36 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-300"
                >
                    <div className="absolute inset-0 w-full h-full">
                        <Canvas camera={{ position: [0, 0, 3] }}>
                            <ambientLight intensity={2} />
                            <pointLight position={[10, 10, 10]} />
                            <RotatingTorus />
                        </Canvas>
                    </div>
                    <ArrowDown className="w-6 h-6 text-white relative z-10 animate-bounce" />
                </motion.div>

                {/* Right: Title */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="font-mono text-[11px] text-white font-bold uppercase text-right tracking-[-0.02em]"
                >
                    Creative Agency<br/>AI & Digital Marketing
                </motion.div>
            </div>
        </div>
    </section>
  );
}
