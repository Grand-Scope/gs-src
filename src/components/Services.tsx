import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

const services = [
    {
        id: '01',
        title: 'MARKETING & STRATEGY',
        tags: ['Branding', 'Social', 'Content', 'Lead Gen']
    },
    {
        id: '02',
        title: 'TECHNICAL ENGINEERING',
        tags: ['Web Dev', 'Automation', 'Data Viz', 'App Logic']
    },
    {
        id: '03',
        title: 'AI INTEGRATION',
        tags: ['LLM Tuning', 'AI Sales', 'Workflows', 'Neural Sync']
    },
    {
        id: '04',
        title: 'CONTENT & PRODUCTION',
        tags: ['Video', 'Motion', 'Copywriting', 'Photo']
    }
];

export default function Services() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });
    
    const pathLength = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <section id="services" className="bg-black text-white py-40 px-6 relative z-10">
            <div className="container mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-24"
                >
                    <span className="font-mono text-[11px] font-bold uppercase text-white/40 block mb-4">[ 002 — SERVICES ]</span>
                    <h3 className="font-display text-[7vw] md:text-[5vw] text-white">WHAT WE DO</h3>
                </motion.div>

                <div ref={containerRef} className="relative">
                    {/* Animated Line */}
                    <div className="absolute left-0 top-0 bottom-0 w-[1px] hidden md:block">
                        <svg className="h-full w-[20px] -ml-[10px] overflow-visible" preserveAspectRatio="none">
                            <motion.line
                                x1="10" y1="0" x2="10" y2="100%"
                                stroke="rgba(255, 255, 255, 0.2)"
                                strokeWidth="1"
                            />
                            <motion.line
                                x1="10" y1="0" x2="10" y2="100%"
                                stroke="#007BFF" // Brand Color (blue-500 from config)
                                strokeWidth="2"
                                style={{ pathLength }}
                            />
                        </svg>
                    </div>

                    {services.map((service, index) => (
                        <motion.div 
                            key={service.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group border-t border-white/20 last:border-b py-10 px-4 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors duration-300 relative z-10 pl-8 md:pl-16"
                        >
                            {/* Dot on the line for each item */}
                            <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-black border border-white/20 hidden md:block group-hover:border-brand-500 group-hover:bg-brand-500 transition-colors duration-300" />

                            <div className="flex items-center gap-8 md:gap-12 flex-1">
                                <span className="font-mono text-[13px] font-bold text-brand-500 w-12 shrink-0">{service.id}</span>
                                <div className="flex-1">
                                    <h4 className="font-display text-[7vw] md:text-[4.5vw] text-white leading-[0.9] transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-4">
                                        {service.title}
                                    </h4>
                                    <div className="flex flex-wrap gap-3 mt-4">
                                        {service.tags.map(tag => (
                                            <span key={tag} className="font-mono text-[10px] text-white/50 border border-white/20 rounded-full px-4 py-1.5 uppercase font-bold">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="text-brand-500 shrink-0 ml-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 group-hover:-rotate-45 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]">
                                <ArrowUpRight className="w-12 h-12 md:w-16 md:h-16" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
