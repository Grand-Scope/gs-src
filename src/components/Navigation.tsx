import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Navigation() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-[100] px-6 py-5 flex items-center justify-between"
    >
      {/* Logo */}
      <a href="#" className="font-display text-2xl text-black tracking-[-0.04em]">GRANDSCOPE</a>

      {/* Center Pill */}
      <div className="hidden md:flex items-center bg-black rounded-full px-2 py-1.5 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        {['Mission', 'Services', 'Work', 'Contact'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="font-mono text-[11px] text-white font-bold uppercase px-5 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-200"
          >
            {item}
          </a>
        ))}
      </div>

      {/* Social Icons */}
      <div className="hidden md:flex items-center gap-4">
        <a href="#" className="text-black hover:scale-110 transition-transform"><Instagram size={20} /></a>
        <a href="#" className="text-black hover:scale-110 transition-transform"><Twitter size={20} /></a>
        <a href="#" className="text-black hover:scale-110 transition-transform"><Linkedin size={20} /></a>
      </div>
    </motion.nav>
  );
}
