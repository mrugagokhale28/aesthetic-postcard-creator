import React, { useRef, useState, useEffect } from 'react';
import { PostcardConfig, ColorPalette, PostcardFilter } from '../types';
import { COLOR_PALETTES } from '../data';
import { 
  Heart, 
  Sun, 
  Anchor, 
  Flower, 
  Compass, 
  MapPin, 
  Calendar 
} from 'lucide-react';

// Compress image on the fly to prevent Safari/iOS canvas blank issues
const compressImage = (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.85): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string); // fallback to original
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        // Export to highly compressed but clear JPEG
        try {
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        } catch (e) {
          resolve(event.target?.result as string); // fallback on exception
        }
      };
      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

interface PostcardPreviewProps {
  config: PostcardConfig;
  onChangeConfig: (newConfig: Partial<PostcardConfig>) => void;
  exportRef: React.RefObject<HTMLDivElement | null>;
}

export default function PostcardPreview({
  config,
  onChangeConfig,
  exportRef,
}: PostcardPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialOffset, setInitialOffset] = useState({ x: 0, y: 0 });

  // Get active color palette
  const palette = COLOR_PALETTES.find(p => p.id === config.paletteId) || COLOR_PALETTES[0];

  // Map font class name
  const getFontFamilyClass = () => {
    switch (config.fontFamily) {
      case 'serif-lux': return 'font-serif-lux';
      case 'serif-edit': return 'font-serif-edit';
      case 'script-formal': return 'font-script-formal text-[2.5rem] leading-[0.8]';
      case 'script-casual': return 'font-script-casual text-2xl leading-relaxed';
      default: return 'font-serif-lux';
    }
  };

  // Build image CSS filter string based on choice
  const getImageFilter = (filter: PostcardFilter) => {
    switch (filter) {
      case 'warm-vintage': 
        return 'sepia(0.28) saturate(1.15) contrast(0.92) brightness(1.02) hue-rotate(-4deg)';
      case 'faded-muted': 
        return 'contrast(0.85) saturate(0.75) brightness(1.04) sepia(0.08) grayscale(0.1)';
      case 'noir': 
        return 'grayscale(1) contrast(1.18) brightness(0.96)';
      case 'chrome': 
        return 'saturate(1.4) contrast(1.08) brightness(0.96)';
      case 'sepia': 
        return 'sepia(0.8) saturate(0.85) contrast(0.92) brightness(0.98)';
      case 'original':
      default: 
        return 'none';
    }
  };

  // Handle Drag / Pan of the background photo
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!config.imageSrc) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialOffset({ x: config.imageX, y: config.imageY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !config.imageSrc) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    
    // Calculate movement responsive to zoom
    const sensitivity = 0.5; 
    onChangeConfig({
      imageX: initialOffset.x + dx * sensitivity,
      imageY: initialOffset.y + dy * sensitivity
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile pan
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!config.imageSrc || e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    setInitialOffset({ x: config.imageX, y: config.imageY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !config.imageSrc || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStart.x;
    const dy = e.touches[0].clientY - dragStart.y;
    const sensitivity = 0.5;
    onChangeConfig({
      imageX: initialOffset.x + dx * sensitivity,
      imageY: initialOffset.y + dy * sensitivity
    });
  };

  // Stamp stamp Icon Renderer
  const renderStampIcon = () => {
    const sizeClass = "w-6 h-6 stroke-[1.25]";
    const props = { className: sizeClass, style: { color: palette.textPrimary } };
    switch (config.stampIcon) {
      case 'flower': return <Flower {...props} />;
      case 'sailboat': return <Anchor {...props} />;
      case 'sun': return <Sun {...props} />;
      case 'heart': return <Heart {...props} />;
      case 'postmark': return <Compass {...props} />;
      default: return null;
    }
  };

  // Postmark stamp visual component
  const PostmarkStamp = () => (
    <div 
      className="absolute top-6 right-6 flex flex-col items-center justify-center select-none"
      style={{ color: palette.textPrimary }}
    >
      {/* Postage Outer box */}
      {config.stampIcon !== 'none' && (
        <div 
          className="w-16 h-20 border-2 border-dashed flex flex-col items-center justify-between p-2 rounded relative bg-white/20 backdrop-blur-[1px] shadow-sm animate-fade-in"
          style={{ borderColor: palette.textMuted }}
        >
          <span className="text-[7px] uppercase font-mono tracking-widest leading-none" style={{ color: palette.textMuted }}>Postage</span>
          <div className="my-1">{renderStampIcon()}</div>
          <span className="text-[6px] font-serif tracking-normal leading-none italic" style={{ color: palette.textPrimary }}>
            USA 32¢
          </span>
          
          {/* Subtle design lines */}
          <div className="absolute inset-0.5 border border-dotted pointer-events-none rounded-[1px]" style={{ borderColor: palette.textMuted + '40' }} />
        </div>
      )}

      {/* Classic Ink postmark overlay offset */}
      {config.stampIcon !== 'none' && (
        <div 
          className="absolute -top-3 -right-3 w-16 h-16 border border-dashed rounded-full flex flex-col items-center justify-center rotate-12 opacity-80 pointer-events-none scale-105"
          style={{ borderColor: palette.accent, color: palette.accent }}
        >
          <div className="text-[5px] uppercase tracking-[0.2em] font-serif leading-none font-semibold">AESTHETIC MAIL</div>
          <div className="w-10 border-t border-dotted my-0.5" style={{ borderColor: palette.accent }} />
          <div className="text-[6px] font-mono leading-none">{config.date || '13.07.2026'}</div>
          <div className="text-[5px] uppercase tracking-[0.1em] font-serif mt-0.5">POSTED</div>
        </div>
      )}
    </div>
  );
  // Default placeholder content if no image uploaded (Interactive upload trigger)
  const renderEmptyImagePlaceholder = () => {
    return (
      <div 
        onClick={(e) => {
          e.stopPropagation();
          fileInputRef.current?.click();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className="w-full h-full flex flex-col items-center justify-center bg-zinc-50 hover:bg-zinc-100/90 cursor-pointer p-6 text-center border-2 border-dashed border-zinc-300 rounded-sm transition-all duration-300 group/upload relative"
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              try {
                const compressedBase64 = await compressImage(file);
                onChangeConfig({ 
                  imageSrc: compressedBase64,
                  imageZoom: 1.1,
                  imageX: 0,
                  imageY: 0
                });
              } catch (err) {
                console.error("Compression failed, fallback to standard FileReader", err);
                const reader = new FileReader();
                reader.onload = (event) => {
                  if (event.target?.result) {
                    onChangeConfig({ 
                      imageSrc: event.target.result as string,
                      imageZoom: 1.1,
                      imageX: 0,
                      imageY: 0
                    });
                  }
                };
                reader.readAsDataURL(file);
              }
            }
          }} 
          accept="image/*" 
          className="hidden" 
        />
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-zinc-400 mb-3 border border-zinc-200 group-hover/upload:scale-105 transition-transform duration-300">
          <MapPin className="w-5 h-5 stroke-[1.5] text-amber-600/80" />
        </div>
        <h4 className="font-serif-lux text-sm text-zinc-800 font-semibold mb-1">Add a Photograph</h4>
        <p className="text-zinc-500 text-[10px] max-w-[200px] leading-relaxed font-sans mb-3">
          Click to upload your custom travel memory here.
        </p>
        <span className="inline-flex items-center space-x-1 px-3 py-1 bg-zinc-900 text-white rounded-full text-[9px] uppercase tracking-widest font-sans font-bold shadow-sm group-hover/upload:bg-zinc-950 transition-colors">
          <span>Upload Photo</span>
        </span>
      </div>
    );
  };

  // Sizing styles for display inside the layout
  // Instagram: 1:1 aspect ratio
  // Story: 9:11 aspect ratio (extremely classic postcard shape, taller vertical)
  const sizeAspectClass = config.size === 'instagram' ? 'aspect-square' : 'aspect-[9/11]';

  return (
    <div className="w-full flex justify-center py-1.5 sm:py-3 select-none">
      {/* Card wrapper with exact aspect ratio and simulated realistic shadow */}
      <div 
        ref={exportRef}
        id="postcard-capture-container"
        className={`w-full max-w-[260px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-[480px] xl:max-w-[500px] bg-white shadow-2xl rounded-sm overflow-hidden relative transition-all duration-300 ${sizeAspectClass}`}
        style={{ 
          backgroundColor: palette.background,
          color: palette.textPrimary,
          fontFamily: '"Inter", sans-serif'
        }}
      >
        {/* LAYOUT 1: SPLIT POSTCARD (Perfect reference look) */}
        {config.layout === 'split' && (
          <div className="w-full h-full flex flex-col">
            {/* Top Half: Photo */}
            <div 
              ref={imageContainerRef}
              className="w-full h-[50%] overflow-hidden relative bg-zinc-950 cursor-grab active:cursor-grabbing border-b"
              style={{ borderColor: palette.border }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUpOrLeave}
            >
              {config.imageSrc ? (
                <img 
                  src={config.imageSrc} 
                  alt="Postcard Artwork" 
                  className="w-full h-full object-cover select-none pointer-events-none transition-all duration-200"
                  referrerPolicy="no-referrer"
                  crossOrigin={config.imageSrc.startsWith('data:') ? undefined : 'anonymous'}
                  style={{
                    filter: getImageFilter(config.filter),
                    transform: `scale(${config.imageZoom}) translate(${config.imageX}px, ${config.imageY}px)`,
                    transformOrigin: 'center center',
                  }}
                />
              ) : (
                <div className="absolute inset-0 p-4 flex items-center justify-center bg-zinc-900/5">
                  {renderEmptyImagePlaceholder()}
                </div>
              )}
              
              {/* Subtle overlay helper text if photo loaded */}
              {config.imageSrc && (
                <div className="absolute bottom-2 left-2 bg-black/40 text-white/90 text-[10px] font-sans px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity duration-300">
                  Drag photo to position • Pinch/Slider to zoom
                </div>
              )}
            </div>

            {/* Bottom Half: Classic Postcard Backing */}
            <div className="w-full h-[50%] relative p-6 flex flex-row select-none">
              
              {/* Left Column: Note & Description */}
              <div 
                className="w-[52%] h-full flex flex-col justify-between pr-4 border-r" 
                style={{ borderColor: palette.border }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                {/* Vintage Location Header */}
                <div className="flex flex-col mb-1.5 space-y-1">
                  <input 
                    type="text"
                    value={config.location}
                    onChange={(e) => onChangeConfig({ location: e.target.value })}
                    placeholder="ENTER LOCATION"
                    className="w-full bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-zinc-500 focus:outline-none font-serif-lux text-[10px] tracking-[0.2em] uppercase font-semibold leading-tight py-0.5"
                    style={{ color: palette.textPrimary }}
                  />
                  <input 
                    type="text"
                    value={config.date}
                    onChange={(e) => onChangeConfig({ date: e.target.value })}
                    placeholder="July 13, 2026"
                    className="w-full bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-zinc-500 focus:outline-none text-[8px] tracking-[0.1em] font-sans uppercase leading-none py-0.5"
                    style={{ color: palette.textMuted }}
                  />
                </div>

                {/* The Custom Handwritten / Serif Note */}
                <div className="flex-1 my-1 overflow-hidden flex items-start">
                  <textarea 
                    value={config.note}
                    onChange={(e) => onChangeConfig({ note: e.target.value })}
                    placeholder="Write a heartfelt note here. Connect with friends and share your aesthetic postcards directly from this canvas..."
                    className={`w-full h-full bg-transparent border border-transparent hover:border-zinc-200 focus:border-zinc-300 focus:outline-none resize-none whitespace-pre-wrap text-left ${getFontFamilyClass()} text-sm leading-relaxed tracking-wide`}
                    style={{ color: palette.textPrimary }}
                  />
                </div>

                {/* Footer Signature */}
                <div className="text-[9px] tracking-wide font-serif-lux italic mt-auto border-t pt-1 border-dotted flex items-center justify-between" style={{ borderColor: palette.border }}>
                  <span>With love,</span>
                  <input 
                    type="text"
                    value={config.sender}
                    onChange={(e) => onChangeConfig({ sender: e.target.value })}
                    placeholder="Sender"
                    className="w-24 bg-transparent text-right border-b border-transparent hover:border-zinc-300 focus:border-zinc-500 focus:outline-none font-medium font-serif-lux py-0.5"
                    style={{ color: palette.textPrimary }}
                  />
                </div>
              </div>

              {/* Right Column: Title, Stamps, Address Lines */}
              <div 
                className="w-[48%] h-full flex flex-col justify-between pl-6 relative"
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              >
                {/* Cursive / Elegant "Post Card" Title */}
                <div className="text-center mt-1">
                  <input 
                    type="text"
                    value={config.title}
                    onChange={(e) => onChangeConfig({ title: e.target.value })}
                    placeholder="POST CARD"
                    className="w-full bg-transparent text-center border-b border-transparent hover:border-zinc-300 focus:border-zinc-500 focus:outline-none font-serif-lux text-base tracking-[0.3em] font-normal uppercase leading-none py-0.5"
                    style={{ color: palette.textPrimary }}
                  />
                  <div className="w-12 h-[1px] mx-auto mt-1" style={{ backgroundColor: palette.textMuted }} />
                </div>

                {/* Simulated Vintage Stamp */}
                <PostmarkStamp />

                {/* Postcard Address Lines */}
                <div className="w-full space-y-4 mb-4 mt-auto">
                  <div className="border-b border-dotted pb-0.5 flex items-end justify-between" style={{ borderColor: palette.border }}>
                    <span className="text-[7px] uppercase font-sans tracking-widest shrink-0" style={{ color: palette.textMuted }}>To:</span>
                    <input 
                      type="text"
                      value={config.recipient}
                      onChange={(e) => onChangeConfig({ recipient: e.target.value })}
                      placeholder="Dearest Friend"
                      className="w-full bg-transparent text-right border-b border-transparent hover:border-zinc-300 focus:border-zinc-500 focus:outline-none font-serif-lux text-xs font-medium pl-2 py-0.5 truncate"
                      style={{ color: palette.textPrimary }}
                    />
                  </div>
                  <div className="border-b border-dotted pb-0.5 h-4" style={{ borderColor: palette.border }} />
                  <div className="border-b border-dotted pb-0.5 h-4" style={{ borderColor: palette.border }} />
                </div>
              </div>

              {/* Vertical elegant middle dividing mark */}
              <div className="absolute top-4 bottom-4 left-[52%] w-[1px] bg-gradient-to-b from-transparent via-zinc-300 to-transparent pointer-events-none" style={{ backgroundColor: palette.border }} />
            </div>
          </div>
        )}

        {/* LAYOUT 2: MINIMALIST POLAROID FRAME */}
        {config.layout === 'polaroid' && (
          <div className="w-full h-full flex flex-col p-6 pb-12 justify-between">
            {/* Main Polaroid Photo Container */}
            <div 
              className="w-full aspect-square overflow-hidden relative bg-zinc-950 cursor-grab active:cursor-grabbing shadow-inner"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUpOrLeave}
            >
              {config.imageSrc ? (
                <img 
                  src={config.imageSrc} 
                  alt="Postcard Memory" 
                  className="w-full h-full object-cover select-none pointer-events-none transition-all duration-200"
                  referrerPolicy="no-referrer"
                  crossOrigin={config.imageSrc.startsWith('data:') ? undefined : 'anonymous'}
                  style={{
                    filter: getImageFilter(config.filter),
                    transform: `scale(${config.imageZoom}) translate(${config.imageX}px, ${config.imageY}px)`,
                    transformOrigin: 'center center',
                  }}
                />
              ) : (
                renderEmptyImagePlaceholder()
              )}
            </div>

            {/* Bottom Polaroid Captions Pane */}
            <div 
              className="w-full mt-6 px-2 flex flex-col justify-between items-center text-center"
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              {/* Note Content */}
              <textarea 
                value={config.note}
                onChange={(e) => onChangeConfig({ note: e.target.value })}
                placeholder="Collect moments, not things."
                className={`w-full bg-transparent border border-transparent hover:border-zinc-200 focus:border-zinc-300 focus:outline-none resize-none text-center ${getFontFamilyClass()} text-sm tracking-wide h-16 leading-relaxed mb-3`}
                style={{ color: palette.textPrimary }}
              />

              {/* Small details */}
              <div className="flex items-center justify-center space-x-2 text-[10px] tracking-[0.2em] uppercase font-serif-lux pt-2 border-t border-dotted w-full" style={{ borderColor: palette.border }}>
                <div className="flex items-center max-w-[150px]">
                  <MapPin className="w-3 h-3 mr-1 stroke-[1.5] text-zinc-400 shrink-0" />
                  <input 
                    type="text"
                    value={config.location}
                    onChange={(e) => onChangeConfig({ location: e.target.value })}
                    placeholder="LOCATION"
                    className="w-full bg-transparent text-center border-b border-transparent hover:border-zinc-300 focus:border-zinc-500 focus:outline-none font-serif-lux text-[9px] uppercase font-medium py-0.5"
                    style={{ color: palette.textPrimary }}
                  />
                </div>
                <span className="text-zinc-400 font-normal select-none">•</span>
                <div className="flex items-center max-w-[150px]">
                  <Calendar className="w-3 h-3 mr-1 stroke-[1.5] text-zinc-400 shrink-0" />
                  <input 
                    type="text"
                    value={config.date}
                    onChange={(e) => onChangeConfig({ date: e.target.value })}
                    placeholder="DATE"
                    className="w-full bg-transparent text-center border-b border-transparent hover:border-zinc-300 focus:border-zinc-500 focus:outline-none font-serif-lux text-[9px] uppercase font-medium py-0.5"
                    style={{ color: palette.textPrimary }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LAYOUT 3: EDITORIAL TRAVEL CARD */}
        {config.layout === 'editorial' && (
          <div className="w-full h-full flex flex-row overflow-hidden">
            {/* Left 42% Panel: Muted Text Column */}
            <div 
              className="w-[42%] h-full p-5 flex flex-col justify-between relative"
              style={{ backgroundColor: palette.badgeBg }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              {/* Card Title */}
              <div>
                <span className="text-[8px] uppercase tracking-[0.3em] font-sans text-zinc-400 font-semibold leading-none select-none">MEMORIES IN SERIF</span>
                <input 
                  type="text"
                  value={config.title}
                  onChange={(e) => onChangeConfig({ title: e.target.value })}
                  placeholder="TRAVELS"
                  className="w-full bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-zinc-500 focus:outline-none font-serif-lux text-base font-semibold tracking-wide uppercase mt-1 py-0.5"
                  style={{ color: palette.textPrimary }}
                />
                <div className="w-6 h-[1.5px] mt-2" style={{ backgroundColor: palette.accent }} />
              </div>

              {/* Customized Note */}
              <div className="flex-1 my-4 flex items-center justify-start overflow-hidden w-full">
                <textarea 
                  value={config.note}
                  onChange={(e) => onChangeConfig({ note: e.target.value })}
                  placeholder="The sun sets slowly behind the ocean cliffs. A perfect postcard written from the warmth of our memory."
                  className={`w-full h-[85%] bg-transparent border border-transparent hover:border-zinc-200 focus:border-zinc-300 focus:outline-none resize-none text-left ${getFontFamilyClass()} text-xs leading-relaxed italic`}
                  style={{ color: palette.textPrimary }}
                />
              </div>

              {/* Bottom details */}
              <div className="border-t pt-2 border-dotted space-y-1.5" style={{ borderColor: palette.border }}>
                <input 
                  type="text"
                  value={config.location}
                  onChange={(e) => onChangeConfig({ location: e.target.value })}
                  placeholder="LOCATION"
                  className="w-full bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-zinc-500 focus:outline-none font-serif-lux text-[9px] font-semibold uppercase tracking-[0.1em] py-0.5"
                  style={{ color: palette.textPrimary }}
                />
                <input 
                  type="text"
                  value={config.date}
                  onChange={(e) => onChangeConfig({ date: e.target.value })}
                  placeholder="DATE"
                  className="w-full bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-zinc-500 focus:outline-none font-sans text-[8px] tracking-[0.1em] text-zinc-500 uppercase py-0.5"
                />
              </div>

              {/* Elegant decorative background line */}
              <div className="absolute right-0 top-6 bottom-6 w-[1px] bg-gradient-to-b from-transparent via-zinc-200 to-transparent" />
            </div>

            {/* Right 58% Column: Big Beautiful Photograph */}
            <div 
              className="w-[58%] h-full overflow-hidden relative bg-zinc-950 cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUpOrLeave}
            >
              {config.imageSrc ? (
                <img 
                  src={config.imageSrc} 
                  alt="Editorial Cover" 
                  className="w-full h-full object-cover select-none pointer-events-none transition-all duration-200"
                  referrerPolicy="no-referrer"
                  crossOrigin={config.imageSrc.startsWith('data:') ? undefined : 'anonymous'}
                  style={{
                    filter: getImageFilter(config.filter),
                    transform: `scale(${config.imageZoom}) translate(${config.imageX}px, ${config.imageY}px)`,
                    transformOrigin: 'center center',
                  }}
                />
              ) : (
                renderEmptyImagePlaceholder()
              )}

              {/* Small branding overlay bottom right */}
              <div className="absolute bottom-3 right-3 bg-white/70 backdrop-blur-sm px-2 py-1 rounded-[2px] border border-white/20">
                <span className="font-serif-lux text-[7px] uppercase tracking-[0.25em] font-semibold text-zinc-800">CRAFTED POSTCARD</span>
              </div>
            </div>
          </div>
        )}

        {/* LAYOUT 4: FULL OVERLAY CARD */}
        {config.layout === 'overlay' && (
          <div 
            className="w-full h-full overflow-hidden relative bg-zinc-950 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUpOrLeave}
          >
            {/* Full-bleed Photo */}
            {config.imageSrc ? (
              <img 
                src={config.imageSrc} 
                alt="Cinematic Background" 
                className="w-full h-full object-cover select-none pointer-events-none transition-all duration-200"
                referrerPolicy="no-referrer"
                crossOrigin={config.imageSrc.startsWith('data:') ? undefined : 'anonymous'}
                style={{
                  filter: getImageFilter(config.filter),
                  transform: `scale(${config.imageZoom}) translate(${config.imageX}px, ${config.imageY}px)`,
                  transformOrigin: 'center center',
                }}
              />
            ) : (
              renderEmptyImagePlaceholder()
            )}

            {/* Glassmorphism Floating card for note */}
            <div 
              className="absolute bottom-6 left-6 right-6 p-5 rounded-lg border shadow-xl bg-white/95 backdrop-blur-md max-h-[45%] flex flex-col justify-between"
              style={{ 
                backgroundColor: `${palette.background}F2`, // slight transparency
                borderColor: palette.border,
                color: palette.textPrimary 
              }}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              
              {/* Note Header and Stamp inline */}
              <div className="flex justify-between items-start mb-2 gap-4">
                <div className="flex-1 space-y-1">
                  <input 
                    type="text"
                    value={config.title}
                    onChange={(e) => onChangeConfig({ title: e.target.value })}
                    placeholder="MEMENTO"
                    className="w-full bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-zinc-500 focus:outline-none font-serif-lux text-xs font-semibold tracking-wider uppercase py-0.5"
                    style={{ color: palette.textPrimary }}
                  />
                  <input 
                    type="text"
                    value={config.location}
                    onChange={(e) => onChangeConfig({ location: e.target.value })}
                    placeholder="THE GREAT OUTDOORS"
                    className="w-full bg-transparent border-b border-transparent hover:border-zinc-300 focus:border-zinc-500 focus:outline-none font-sans text-[8px] uppercase tracking-widest text-zinc-500 py-0.5"
                  />
                </div>
                <div className="text-[8px] font-sans tracking-wide text-right flex flex-col items-end shrink-0 space-y-1">
                  <input 
                    type="text"
                    value={config.date}
                    onChange={(e) => onChangeConfig({ date: e.target.value })}
                    placeholder="July 2026"
                    className="w-20 bg-transparent text-right border-b border-transparent hover:border-zinc-300 focus:border-zinc-500 focus:outline-none font-sans text-[8px] py-0.5"
                    style={{ color: palette.textPrimary }}
                  />
                  <div className="flex items-center text-[8px] text-zinc-500 italic">
                    <span>By</span>
                    <input 
                      type="text"
                      value={config.sender}
                      onChange={(e) => onChangeConfig({ sender: e.target.value })}
                      placeholder="Mruga"
                      className="w-16 bg-transparent text-right border-b border-transparent hover:border-zinc-300 focus:border-zinc-500 focus:outline-none ml-1 font-serif font-medium py-0.5 text-[8px]"
                      style={{ color: palette.textPrimary }}
                    />
                  </div>
                </div>
              </div>

              {/* Note body */}
              <div className="flex-1 my-2 overflow-hidden text-left w-full">
                <textarea 
                  value={config.note}
                  onChange={(e) => onChangeConfig({ note: e.target.value })}
                  placeholder="Add your postcard note here. It will display inside this elegant floating card positioned beautifully over your photograph."
                  className={`w-full h-16 bg-transparent border border-transparent hover:border-zinc-200 focus:border-zinc-300 focus:outline-none resize-none text-left ${getFontFamilyClass()} text-xs leading-relaxed tracking-wide`}
                  style={{ color: palette.textPrimary }}
                />
              </div>

              {/* Minimal decoration stamp emblem if enabled */}
              {config.stampIcon !== 'none' && (
                <div className="border-t pt-1 border-dotted flex justify-between items-center text-[8px] font-mono tracking-widest uppercase mt-1 opacity-70" style={{ borderColor: palette.border }}>
                  <span>EST. 2026 POSTCARD</span>
                  <div className="flex items-center space-x-1">
                    <span>SEALED</span>
                    {renderStampIcon()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
