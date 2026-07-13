import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { PostcardConfig } from './types';
import { PRESET_IMAGES } from './data';
import PostcardPreview from './components/PostcardPreview';
import PostcardControls from './components/PostcardControls';
import { Sparkles, Heart, HelpCircle, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_CONFIG: PostcardConfig = {
  imageSrc: PRESET_IMAGES[0].url,
  note: "A peaceful afternoon listening to the ocean breeze at Cliff House. Watching the seals bask in the warm California sun. Sending you love from San Francisco.",
  size: 'story', // default taller size is extremely aesthetic
  layout: 'split',
  paletteId: 'warm-sand',
  fontFamily: 'script-casual',
  title: 'POST CARD',
  location: 'SEAL ROCKS, SAN FRANCISCO',
  date: 'July 13, 2026',
  sender: 'Mruga',
  recipient: 'Dearest Friend',
  showStamp: true,
  stampIcon: 'flower',
  filter: 'warm-vintage',
  imageZoom: 1.1,
  imageX: 0,
  imageY: -15
};

export default function App() {
  const [config, setConfig] = useState<PostcardConfig>(INITIAL_CONFIG);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showToast, setShowToast] = useState<'success' | 'error' | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  
  const postcardRef = useRef<HTMLDivElement | null>(null);

  // Partial update config state helper
  const handleUpdateConfig = (newConfig: Partial<PostcardConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  };

  // Reset config back to default template
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your postcard to the curated starter template?")) {
      setConfig(INITIAL_CONFIG);
      triggerToast('success', 'Restored curated starter template');
    }
  };

  // Helper to show a temporary elegant status banner
  const triggerToast = (type: 'success' | 'error', message: string) => {
    setToastMessage(message);
    setShowToast(type);
    setTimeout(() => {
      setShowToast(null);
    }, 4500);
  };

  // Capture the DOM node and download as high-definition image
  const handleDownload = async () => {
    if (!postcardRef.current) return;
    setIsDownloading(true);

    try {
      // Small timeout to allow active states to clear
      await new Promise(resolve => setTimeout(resolve, 300));

      // Capture options for gorgeous, production-quality exports
      const dataUrl = await toPng(postcardRef.current, {
        cacheBust: true,
        pixelRatio: 3, // Premium high-density image
        style: {
          transform: 'scale(1)',
          boxShadow: 'none',
          borderRadius: '0px'
        },
      });

      // Create download anchor and trigger save
      const link = document.createElement('a');
      link.download = `aesthetic-postcard-${config.layout}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      triggerToast('success', 'Your aesthetic postcard was successfully crafted and downloaded!');
    } catch (error) {
      console.error('Capture failed:', error);
      triggerToast('error', 'Failed to compile postcard. For uploaded images, try a different photo format.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F5F1] text-zinc-800 flex flex-col font-sans relative selection:bg-zinc-800 selection:text-white">
      
      {/* GLOWING AMBIENCE TO SUBTLY LIGHT THE PAGE (Minimalist & Muted) */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[#EFEDE6] to-transparent opacity-60 pointer-events-none" />

      {/* TOAST NOTIFICATION CONTAINER */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md"
          >
            <div className={`p-4 rounded-md shadow-xl border flex items-start space-x-3 backdrop-blur-md ${
              showToast === 'success' 
                ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900' 
                : 'bg-rose-50/95 border-rose-200 text-rose-900'
            }`}>
              {showToast === 'success' ? (
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-serif-lux font-semibold text-sm leading-tight">
                  {showToast === 'success' ? 'Postcard Compiled' : 'Crafting Interrupted'}
                </p>
                <p className="text-xs mt-1 opacity-90 leading-relaxed font-sans">{toastMessage}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:py-10 flex flex-col lg:flex-row gap-8 lg:gap-12 relative z-10">
        
        {/* LEFT COLUMN: INTERACTIVE PREVIEW PANEL */}
        <div className="w-full lg:w-[50%] flex flex-col justify-start lg:sticky lg:top-8 self-start">
          
          {/* Studio stage background with visual guides */}
          <div className="bg-[#EFEDE6]/60 rounded-xl p-6 border border-zinc-200/80 flex flex-col items-center justify-center relative min-h-[450px] md:min-h-[580px] shadow-sm">
            
            {/* Subtle paper-textured background inside the studio canvas */}
            <div className="absolute inset-0 bg-radial-gradient opacity-[0.03] pointer-events-none rounded-xl" />
            
            {/* Size indicator label */}
            <div className="absolute top-4 left-4 bg-zinc-800/5 px-2.5 py-1 rounded-[4px] border border-zinc-800/5 text-[9px] uppercase tracking-[0.2em] font-sans font-bold text-zinc-500">
              {config.size === 'instagram' ? '1080 × 1080 (Square)' : '1080 × 1320 (Aesthetic Story)'}
            </div>

            {/* Preview component */}
            <PostcardPreview 
              config={config} 
              onChangeConfig={handleUpdateConfig} 
              exportRef={postcardRef}
            />

            {/* Direct Interaction instruction help */}
            {config.imageSrc && (
              <p className="text-[10px] text-zinc-400 font-sans tracking-wide text-center mt-3 max-w-xs leading-normal">
                💡 **Aesthetic Tip**: Click and drag your photo in the preview above to pan it horizontally or vertically!
              </p>
            )}
          </div>

          {/* Quick instructions/credits row */}
          <div className="flex justify-between items-center px-2 mt-4 text-[10px] text-zinc-400 font-sans font-medium">
            <span className="flex items-center tracking-widest font-semibold text-zinc-500 uppercase">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-zinc-300 stroke-[1.5]" /> mrugaonthego
            </span>
            <span className="flex items-center tracking-wide text-zinc-400">
              made with <Heart className="w-3 h-3 mx-1 text-rose-400 fill-rose-400 animate-pulse" /> for wanderers.
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTROLS & SIDEBAR */}
        <div className="w-full lg:w-[50%] bg-zinc-50/50 backdrop-blur-sm border border-zinc-200/60 p-6 md:p-8 rounded-xl shadow-inner overflow-y-auto lg:max-h-[calc(100vh-80px)]">
          <PostcardControls 
            config={config} 
            onChangeConfig={handleUpdateConfig}
            onDownload={handleDownload}
            isDownloading={isDownloading}
            onReset={handleReset}
          />
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full border-t border-zinc-200/60 py-6 text-center text-xs text-zinc-400 relative z-10 font-sans mt-auto">
        <p>© 2026 Aesthetic Postcard Creator. Handcrafted with precision, serif typography, and muted palettes.</p>
      </footer>
    </div>
  );
}
