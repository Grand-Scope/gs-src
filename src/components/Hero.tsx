import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { Hyperspeed, hyperspeedPresets } from './Hyperspeed';

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  const [isSpeeding, setIsSpeeding] = useState(false);

  const variants = {
    hidden: { y: 100, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] as any
      }
    })
  };

  return (
    <section className="min-h-screen bg-black flex flex-col justify-center relative px-6 pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
            <Hyperspeed 
                effectOptions={{
                    ...(hyperspeedPresets.one as any),
                    onSpeedUp: () => setIsSpeeding(true),
                    onSlowDown: () => setIsSpeeding(false),
                }}
            />
        </div>

        <div className="container mx-auto relative z-10 pointer-events-none">
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

                {/* Center: Press & Hold Interaction */}
                <div className="relative w-36 h-36 flex items-center justify-center pointer-events-auto">
                    <AnimatePresence mode="wait">
                        {!isSpeeding && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onMouseDown={() => setIsSpeeding(true)}
                                onMouseUp={() => setIsSpeeding(false)}
                                onMouseLeave={() => setIsSpeeding(false)}
                                onTouchStart={() => setIsSpeeding(true)}
                                onTouchEnd={() => setIsSpeeding(false)}
                                className="flex flex-col items-center gap-3 cursor-pointer group"
                            >
                                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                    <Play size={20} fill="white" className="ml-1" />
                                </div>
                                <p className="text-[10px] font-mono font-bold text-white uppercase tracking-widest text-center">
                                    Press & Hold<br/>to Warp
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

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
