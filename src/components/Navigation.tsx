import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { Instagram, Twitter, Linkedin, Menu, X } from 'lucide-react';

export default function Navigation() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-[100] px-4 py-3 md:px-6 md:py-5 flex items-center justify-between"
      >
        {/* Logo */}
        <a href="#" className="block z-50">
          <img src="/logo-dark.png" alt="GrandScope" className="h-16 md:h-20 w-auto" />
        </a>

        {/* Center Pill - Desktop */}
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

        {/* Social Icons - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <a href="#" className="text-white hover:scale-110 transition-transform"><Instagram size={20} /></a>
          <a href="#" className="text-white hover:scale-110 transition-transform"><Twitter size={20} /></a>
          <a href="#" className="text-white hover:scale-110 transition-transform"><Linkedin size={20} /></a>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white z-50 p-2"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-black flex flex-col items-center justify-center space-y-8 md:hidden"
          >
            <div className="flex flex-col items-center space-y-6">
              {['Mission', 'Services', 'Work', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="font-mono text-xl text-white font-bold uppercase hover:text-blue-500 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
            
            <div className="flex items-center gap-6 mt-8">
              <a href="#" className="text-white hover:scale-110 transition-transform"><Instagram size={24} /></a>
              <a href="#" className="text-white hover:scale-110 transition-transform"><Twitter size={24} /></a>
              <a href="#" className="text-white hover:scale-110 transition-transform"><Linkedin size={24} /></a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
