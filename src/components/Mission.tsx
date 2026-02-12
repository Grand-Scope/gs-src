import { useRef, useLayoutEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Lightning } from './Lightning';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Stats ──────────────────────────────────────────────────── */

const Stat = ({ value, label }: { value: string; label: string }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    return (
        <div ref={ref}>
            <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="font-display text-3xl md:text-5xl text-brand-100 block"
            >
                {value}
            </motion.span>
            <motion.span
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-mono text-[10px] text-brand-400 block mt-1 uppercase font-bold"
            >
                {label}
            </motion.span>
        </div>
    );
};

/* ── Inline SVG Decorations ─────────────────────────────────── */

const WavyCurve = () => (
    <svg viewBox="0 0 200 80" fill="none" className="inline-block h-[8vw] w-auto shrink-0 self-center">
        <path
            d="M10 40 C 40 10, 60 70, 90 40 S 140 10, 170 40 S 200 70, 200 40"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="text-brand-300/50"
        />
    </svg>
);

const Sparkle = () => (
    <svg viewBox="0 0 80 80" fill="none" className="inline-block h-[6vw] w-auto shrink-0 self-center">
        <path
            d="M40 5 L45 30 L70 25 L50 40 L75 55 L45 50 L40 75 L35 50 L5 55 L30 40 L10 25 L35 30 Z"
            fill="currentColor"
            className="text-brand-200/50"
        />
    </svg>
);

const StarBurst = () => (
    <svg viewBox="0 0 100 100" fill="none" className="inline-block h-[10vw] w-auto shrink-0 self-center">
        <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="2" className="text-brand-200/50" />
        <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="1.5" className="text-brand-300/40" />
        <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="1.5" className="text-brand-300/40" />
        <line x1="15" y1="15" x2="85" y2="85" stroke="currentColor" strokeWidth="1.5" className="text-brand-300/40" />
        <line x1="85" y1="15" x2="15" y2="85" stroke="currentColor" strokeWidth="1.5" className="text-brand-300/40" />
    </svg>
);

const Swoosh = () => (
    <svg viewBox="0 0 240 60" fill="none" className="inline-block h-[5vw] w-auto shrink-0 self-center">
        <path
            d="M5 50 Q 60 -10, 120 30 T 235 10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            className="text-brand-300/50"
        />
    </svg>
);

const DiamondDot = () => (
    <svg viewBox="0 0 40 40" fill="none" className="inline-block h-[3vw] w-auto shrink-0 self-center mx-[1vw]">
        <rect x="12" y="12" width="16" height="16" rx="2" transform="rotate(45 20 20)" fill="currentColor" className="text-brand-300/50" />
    </svg>
);

/* ── Component ──────────────────────────────────────────────── */

export default function Mission() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const section = sectionRef.current;
        const track = trackRef.current;
        if (!section || !track) return;

        const ctx = gsap.context(() => {
            const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

            gsap.to(track, {
                x: getScrollAmount,
                ease: 'none',
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: () => `+=${track.scrollWidth - window.innerWidth}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    anticipatePin: 1,
                },
            });
        }, section);

        return () => ctx.revert();
    }, []);

    return (
        <div id="mission" ref={sectionRef} className="relative z-10 bg-black overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Lightning hue={220} speed={0.5} intensity={1.5} size={0.8} />
            </div>
            
            <div className="h-screen flex items-center overflow-hidden relative z-10">
                <div
                    ref={trackRef}
                    className="flex items-center gap-0 flex-nowrap will-change-transform"
                    style={{ whiteSpace: 'nowrap' }}
                >
                    {/* ── Opening panel: Manifesto heading + description + stats ── */}
                    <div
                        className="shrink-0 flex flex-col justify-center px-[6vw] gap-8"
                        style={{ width: '100vw', whiteSpace: 'normal' }}
                    >
                        <div className="grid lg:grid-cols-2 gap-10 md:gap-20 items-start">
                            <div>
                                <span className="font-mono text-[11px] font-bold uppercase text-brand-300 block mb-6">
                                    [ 001 — MANIFESTO ]
                                </span>
                                <h2 className="font-display text-[7vw] md:text-[4vw] text-white leading-[0.88]">
                                    ENGINEERING DIGITAL ECOSYSTEMS
                                </h2>
                            </div>
                            <div>
                                <p className="text-base md:text-lg text-brand-100 leading-relaxed mb-12 max-w-lg">
                                    We reject the ordinary. We build architectures that grow, adapt, and dominate
                                    through intentional chaos and AI-driven precision.
                                </p>
                                <div className="flex gap-8 md:gap-16 border-t-2 border-white/10 pt-8">
                                    <Stat value="15Y" label="Uptime" />
                                    <Stat value="500+" label="Projects" />
                                    <Stat value="99.9%" label="Precision" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Separator ── */}
                    <span className="inline-block w-[6vw] shrink-0" />
                    <WavyCurve />
                    <span className="inline-block w-[6vw] shrink-0" />

                    {/* ── Horizontal ticker-tape sentence ── */}
                    <span className="font-display text-[14vw] md:text-[10vw] text-white uppercase leading-none tracking-tighter shrink-0 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        Transcending
                    </span>
                    <span className="inline-block w-[4vw] shrink-0" />
                    <Sparkle />
                    <span className="inline-block w-[4vw] shrink-0" />
                    <span className="font-display text-[11vw] md:text-[8vw] text-white uppercase leading-none tracking-tight shrink-0 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        the
                    </span>
                    <span className="inline-block w-[4vw] shrink-0" />
                    <span className="font-display text-[12vw] md:text-[9vw] text-white uppercase leading-none tracking-tight shrink-0 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        typical,
                    </span>
                    <span className="inline-block w-[4vw] shrink-0" />
                    <WavyCurve />
                    <span className="inline-block w-[4vw] shrink-0" />
                    <span className="font-display text-[14vw] md:text-[10vw] text-white uppercase leading-none tracking-tighter shrink-0 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        chasing
                    </span>
                    <span className="inline-block w-[4vw] shrink-0" />
                    <StarBurst />
                    <span className="inline-block w-[4vw] shrink-0" />
                    <span className="font-display text-[11vw] md:text-[8vw] text-white uppercase leading-none tracking-tight shrink-0 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        the
                    </span>
                    <span className="inline-block w-[4vw] shrink-0" />
                    <Swoosh />
                    <span className="inline-block w-[4vw] shrink-0" />
                    <span className="font-display text-[14vw] md:text-[10vw] text-white uppercase leading-none tracking-tighter shrink-0 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        impossible
                    </span>

                    {/* End padding */}
                    <span className="inline-block w-[10vw] shrink-0" />
                </div>
            </div>
        </div>
    );
}
