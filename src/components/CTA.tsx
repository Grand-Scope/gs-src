import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import GradientBlinds from './GradientBlinds';

export default function CTA() {
    return (
        <section id="contact" className="relative py-24 md:py-48 px-6 text-center overflow-hidden bg-black">
            <div className="absolute inset-0 z-0 opacity-80">
                <GradientBlinds
                    gradientColors={['#007BFF', '#004A99', '#3396FF']} // Brand blue -> Darker Blue -> Lighter Blue
                    angle={-15}
                    noise={0.2}
                    blindCount={20}
                    blindMinWidth={40}
                    spotlightRadius={0.6}
                    spotlightSoftness={0.8}
                    spotlightOpacity={0.9}
                    mouseDampening={0.12}
                    distortAmount={2}
                    shineDirection="left"
                    mixBlendMode="normal"
                />
            </div>

            <div className="container mx-auto relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="font-mono text-[11px] font-bold uppercase text-white/50 block mb-8">[ 003 — LET'S BUILD ]</span>
                    <h2 className="font-display text-[clamp(1.8rem,7vw,6rem)] md:text-[clamp(2.5rem,8vw,8rem)] text-white leading-[0.9] mb-12 md:mb-16">
                        TRANSFORM<br/>EVERYTHING
                    </h2>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <a 
                        href="#" 
                        className="inline-flex items-center gap-4 bg-white text-black font-display text-base md:text-2xl px-8 md:px-16 py-4 md:py-6 rounded-full tracking-[-0.02em] hover:scale-105 hover:shadow-2xl hover:bg-brand-50 transition-all duration-300"
                    >
                        START A PROJECT
                        <ArrowRight className="w-5 h-5 md:w-7 md:h-7" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
