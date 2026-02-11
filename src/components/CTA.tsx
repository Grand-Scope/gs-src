import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
    return (
        <section id="contact" className="bg-orange py-48 md:py-64 px-6 text-center relative z-10">
            <div className="container mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="font-mono text-[11px] font-bold uppercase text-black/50 block mb-8">[ 003 — LET'S BUILD ]</span>
                    <h2 className="font-display text-[14vw] text-black leading-[0.85] mb-16">
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
                        className="inline-flex items-center gap-4 bg-black text-white font-display text-2xl md:text-3xl px-16 md:px-20 py-6 md:py-8 rounded-full tracking-[-0.02em] hover:scale-105 hover:shadow-2xl transition-all duration-300"
                    >
                        START A PROJECT
                        <ArrowRight className="w-7 h-7" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
