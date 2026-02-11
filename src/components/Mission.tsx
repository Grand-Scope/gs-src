import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const Stat = ({ value, label }: { value: string, label: string }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    
    return (
        <div ref={ref}>
            <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="font-display text-5xl md:text-6xl text-black block"
            >
                {value}
            </motion.span>
            <motion.span 
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-mono text-[10px] text-black/50 block mt-1 uppercase font-bold"
            >
                {label}
            </motion.span>
        </div>
    );
}

export default function Mission() {
    const ref = useRef(null);
    
    return (
        <section id="mission" ref={ref} className="bg-orange py-40 px-6 relative z-10">
            <div className="container mx-auto">
                <div className="grid lg:grid-cols-2 gap-20 items-start">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className="font-mono text-[11px] font-bold uppercase text-black/50 block mb-6">[ 001 — MANIFESTO ]</span>
                        <h2 className="font-display text-[7vw] md:text-[5vw] text-black leading-[0.88]">
                            ENGINEERING DIGITAL ECOSYSTEMS
                        </h2>
                    </motion.div>
                    
                    <motion.div
                         initial={{ opacity: 0, y: 50 }}
                         whileInView={{ opacity: 1, y: 0 }}
                         viewport={{ once: true, margin: "-100px" }}
                         transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <p className="text-lg md:text-xl text-black/80 leading-relaxed mb-12 max-w-lg">
                            We reject the ordinary. We build architectures that grow, adapt, and dominate through intentional chaos and AI-driven precision.
                        </p>
                        <div className="flex gap-16 border-t-2 border-black pt-8">
                            <Stat value="15Y" label="Uptime" />
                            <Stat value="500+" label="Projects" />
                            <Stat value="99.9%" label="Precision" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
