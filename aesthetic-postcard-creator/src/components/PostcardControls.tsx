import React, { useRef } from 'react';
import { PostcardConfig, PostcardSize, PostcardLayout, PostcardFilter } from '../types';
import { COLOR_PALETTES, PRESET_IMAGES } from '../data';
import { 
  Upload, 
  Download, 
  RotateCcw, 
  MapPin, 
  PenTool, 
  Sliders, 
  Type, 
  Layout, 
  Image as ImageIcon,
  Sparkles,
  Info,
  Check,
  User,
  Heart
} from 'lucide-react';

interface PostcardControlsProps {
  config: PostcardConfig;
  onChangeConfig: (newConfig: Partial<PostcardConfig>) => void;
  onDownload: () => void;
  isDownloading: boolean;
  onReset: () => void;
}

export default function PostcardControls({
  config,
  onChangeConfig,
  onDownload,
  isDownloading,
  onReset,
}: PostcardControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onChangeConfig({ 
        imageSrc: url,
        // Reset crop adjustments on new upload
        imageZoom: 1,
        imageX: 0,
        imageY: 0
      });
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      onChangeConfig({ 
        imageSrc: url,
        imageZoom: 1,
        imageX: 0,
        imageY: 0
      });
    }
  };

  // Trigger manual upload click
  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full flex flex-col space-y-6 select-none max-h-full">
      {/* HEADER WITH BRANDING & DOWNLOAD */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-zinc-200">
        <div>
          <span className="text-[10px] tracking-[0.3em] font-sans font-semibold text-zinc-400 uppercase">CRAFT & MINIMALISM</span>
          <h1 className="font-serif-lux text-2xl font-semibold tracking-wide text-zinc-800">Postcard Canvas</h1>
        </div>
        
        {/* Actions row */}
        <div className="flex items-center space-x-2 mt-3 sm:mt-0">
          <button
            onClick={onReset}
            title="Reset to default config"
            className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors duration-200"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={onDownload}
            disabled={isDownloading || !config.imageSrc}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-sm font-sans text-xs tracking-wider uppercase font-medium transition-all duration-300 shadow-sm ${
              !config.imageSrc 
                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                : 'bg-zinc-800 hover:bg-zinc-950 text-white hover:shadow-md'
            }`}
          >
            {isDownloading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Crafting...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export PNG</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* STEP 1: CHOOSE PHOTO */}
      <div className="space-y-3 bg-white p-4 rounded-lg border border-zinc-100 shadow-sm">
        <div className="flex items-center space-x-2 border-b border-zinc-100 pb-2">
          <ImageIcon className="w-4 h-4 text-zinc-400" />
          <h3 className="font-serif-lux text-sm font-semibold text-zinc-700 uppercase tracking-wider">1. Select Photograph</h3>
          <span className="text-[9px] bg-zinc-800 text-white px-1.5 py-0.5 rounded font-sans uppercase font-medium tracking-wide">Mandatory</span>
        </div>

        {/* Drag and drop upload zone */}
        <div 
          onClick={triggerUploadClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-md p-5 text-center cursor-pointer transition-all duration-300 ${
            config.imageSrc 
              ? 'border-zinc-300 bg-zinc-50/50 hover:bg-zinc-50' 
              : 'border-zinc-300 hover:border-zinc-500 hover:bg-zinc-50/50'
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            className="hidden" 
          />
          
          <div className="flex flex-col items-center justify-center space-y-1.5">
            <div className="p-2 bg-zinc-100 rounded-full text-zinc-500">
              <Upload className="w-4 h-4" />
            </div>
            {config.imageSrc ? (
              <p className="text-xs text-emerald-600 font-sans font-medium flex items-center justify-center">
                <Check className="w-3 h-3 mr-1" /> Custom Photo Uploaded
              </p>
            ) : (
              <p className="text-xs text-zinc-600 font-sans font-medium">Click to upload or drag photo here</p>
            )}
            <p className="text-[10px] text-zinc-400 font-sans">Supports JPEG, PNG, HEIC up to 10MB</p>
          </div>
        </div>

        {/* Curator's aesthetic Unsplash presets */}
        <div>
          <span className="text-[10px] tracking-wider text-zinc-400 font-sans font-semibold block mb-2">OR CHOOSE AN AESTHETIC TRAVEL PRESET:</span>
          <div className="grid grid-cols-5 gap-2">
            {PRESET_IMAGES.map((img) => (
              <button
                key={img.id}
                onClick={() => onChangeConfig({ 
                  imageSrc: img.url,
                  imageZoom: 1,
                  imageX: 0,
                  imageY: 0
                })}
                title={`Select "${img.name}" by ${img.photographer}`}
                className={`aspect-square rounded-sm overflow-hidden relative transition-all duration-200 border-2 ${
                  config.imageSrc === img.url 
                    ? 'border-zinc-800 ring-2 ring-zinc-800/10 scale-95 shadow' 
                    : 'border-transparent opacity-85 hover:opacity-100 hover:scale-105'
                }`}
              >
                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-black/40 text-[7px] text-white py-0.5 truncate px-1 text-center font-sans font-medium">
                  {img.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STEP 2: SIZE & FORMAT LAYOUT */}
      <div className="space-y-4 bg-white p-4 rounded-lg border border-zinc-100 shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <div className="flex items-center space-x-2">
            <Layout className="w-4 h-4 text-zinc-400" />
            <h3 className="font-serif-lux text-sm font-semibold text-zinc-700 uppercase tracking-wider">2. Size & Layout</h3>
          </div>
        </div>

        {/* Size Selection */}
        <div className="space-y-2">
          <span className="text-[10px] tracking-wider text-zinc-400 font-sans font-semibold block">CHOOSE POSTCARD ASPECT RATIO:</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onChangeConfig({ size: 'instagram' })}
              className={`flex flex-col items-center justify-center p-3 rounded border text-center transition-all duration-200 ${
                config.size === 'instagram'
                  ? 'border-zinc-800 bg-zinc-50 text-zinc-800'
                  : 'border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-700'
              }`}
            >
              <div className="w-6 h-6 border-2 border-current rounded-sm mb-1.5 opacity-80" />
              <span className="font-sans text-xs font-semibold">Instagram Post</span>
              <span className="text-[10px] opacity-75 font-sans mt-0.5">Square • 1:1 Aspect</span>
            </button>
            <button
              onClick={() => onChangeConfig({ size: 'story' })}
              className={`flex flex-col items-center justify-center p-3 rounded border text-center transition-all duration-200 ${
                config.size === 'story'
                  ? 'border-zinc-800 bg-zinc-50 text-zinc-800'
                  : 'border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-700'
              }`}
            >
              <div className="w-5 h-6.5 border-2 border-current rounded-sm mb-1.5 opacity-80" />
              <span className="font-sans text-xs font-semibold">Aesthetic Story</span>
              <span className="text-[10px] opacity-75 font-sans mt-0.5">Tall • 9:11 Aspect (Classic)</span>
            </button>
          </div>
        </div>

        {/* Layout templates */}
        <div className="space-y-2">
          <span className="text-[10px] tracking-wider text-zinc-400 font-sans font-semibold block">CHOOSE VISUAL LAYOUT STYLE:</span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'split', name: 'Vintage Split', desc: 'Reference postcard layout (Split)' },
              { id: 'polaroid', name: 'Polaroid Frame', desc: 'Thick vintage border frame' },
              { id: 'editorial', name: 'Editorial Cover', desc: 'Travel magazine side panel' },
              { id: 'overlay', name: 'Floating Card', desc: 'Floating message box over photo' }
            ].map((layout) => (
              <button
                key={layout.id}
                onClick={() => onChangeConfig({ layout: layout.id as PostcardLayout })}
                className={`flex flex-col p-2.5 rounded border text-left transition-all duration-200 ${
                  config.layout === layout.id
                    ? 'border-zinc-800 bg-zinc-50 text-zinc-800'
                    : 'border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-700'
                }`}
              >
                <span className="font-serif-lux text-xs font-semibold">{layout.name}</span>
                <span className="text-[9px] opacity-75 leading-tight mt-0.5 font-sans">{layout.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* STEP 3: TEXTS & MESSAGE */}
      <div className="space-y-4 bg-white p-4 rounded-lg border border-zinc-100 shadow-sm">
        <div className="flex items-center space-x-2 border-b border-zinc-100 pb-2">
          <PenTool className="w-4 h-4 text-zinc-400" />
          <h3 className="font-serif-lux text-sm font-semibold text-zinc-700 uppercase tracking-wider">3. Add Message & Details</h3>
        </div>

        {/* Typography choice */}
        <div className="space-y-2">
          <span className="text-[10px] tracking-wider text-zinc-400 font-sans font-semibold block flex items-center">
            <Type className="w-3.5 h-3.5 mr-1" /> CHOOSE TYPOGRAPHY CHARACTER:
          </span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'serif-lux', name: 'Fine Luxury Serif', fontClass: 'font-serif-lux' },
              { id: 'serif-edit', name: 'Editorial Serif', fontClass: 'font-serif-edit' },
              { id: 'script-formal', name: 'Script Calligraphy', fontClass: 'font-script-formal text-lg' },
              { id: 'script-casual', name: 'Casual Hand-written', fontClass: 'font-script-casual' }
            ].map((font) => (
              <button
                key={font.id}
                onClick={() => onChangeConfig({ fontFamily: font.id as any })}
                className={`p-2.5 rounded border text-center transition-all duration-200 flex flex-col items-center justify-center ${
                  config.fontFamily === font.id
                    ? 'border-zinc-800 bg-zinc-50 text-zinc-800'
                    : 'border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-700'
                }`}
              >
                <span className={`text-sm ${font.fontClass} leading-none mb-1`}>ABC abc</span>
                <span className="text-[9px] font-sans opacity-75">{font.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Rich content textareas and inputs */}
        <div className="space-y-3">
          {/* Main Note */}
          <div className="space-y-1">
            <label className="text-[10px] tracking-wider text-zinc-400 font-sans font-semibold flex justify-between">
              <span>POSTCARD NOTE (OPTIONAL):</span>
              <span className="text-[9px] text-zinc-300 font-sans">Supports line breaks</span>
            </label>
            <textarea
              rows={3}
              value={config.note}
              onChange={(e) => onChangeConfig({ note: e.target.value })}
              placeholder="Type your message to be written elegantly onto the postcard..."
              className="w-full text-xs p-2.5 bg-zinc-50 border border-zinc-200 rounded-sm focus:bg-white focus:ring-1 focus:ring-zinc-800 focus:outline-none transition-all duration-200"
            />
          </div>

          {/* Grid of details inputs */}
          <div className="grid grid-cols-2 gap-2">
            {/* Title */}
            {config.layout !== 'polaroid' && (
              <div className="space-y-1">
                <label className="text-[9px] tracking-wider text-zinc-400 font-sans font-semibold">POSTCARD TITLE:</label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => onChangeConfig({ title: e.target.value })}
                  placeholder="POST CARD"
                  className="w-full text-xs px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-sm focus:bg-white focus:ring-1 focus:ring-zinc-800 focus:outline-none transition-all"
                />
              </div>
            )}

            {/* Location */}
            <div className="space-y-1">
              <label className="text-[9px] tracking-wider text-zinc-400 font-sans font-semibold flex items-center">
                <MapPin className="w-2.5 h-2.5 mr-0.5 text-zinc-400" /> LOCATION / CAPTION:
              </label>
              <input
                type="text"
                value={config.location}
                onChange={(e) => onChangeConfig({ location: e.target.value })}
                placeholder="SEAL ROCKS, CA"
                className="w-full text-xs px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-sm focus:bg-white focus:ring-1 focus:ring-zinc-800 focus:outline-none transition-all"
              />
            </div>

            {/* Date */}
            <div className="space-y-1">
              <label className="text-[9px] tracking-wider text-zinc-400 font-sans font-semibold">DATE PRINTED:</label>
              <input
                type="text"
                value={config.date}
                onChange={(e) => onChangeConfig({ date: e.target.value })}
                placeholder="13 July 2026"
                className="w-full text-xs px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-sm focus:bg-white focus:ring-1 focus:ring-zinc-800 focus:outline-none transition-all"
              />
            </div>

            {/* Split layout fields for realistic touch */}
            {config.layout === 'split' && (
              <>
                <div className="space-y-1">
                  <label className="text-[9px] tracking-wider text-zinc-400 font-sans font-semibold flex items-center">
                    <User className="w-2.5 h-2.5 mr-0.5 text-zinc-400" /> SENDER (FROM):
                  </label>
                  <input
                    type="text"
                    value={config.sender}
                    onChange={(e) => onChangeConfig({ sender: e.target.value })}
                    placeholder="Mruga"
                    className="w-full text-xs px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-sm focus:bg-white focus:ring-1 focus:ring-zinc-800 focus:outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] tracking-wider text-zinc-400 font-sans font-semibold">RECIPIENT (TO):</label>
                  <input
                    type="text"
                    value={config.recipient}
                    onChange={(e) => onChangeConfig({ recipient: e.target.value })}
                    placeholder="Dearest Friend"
                    className="w-full text-xs px-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-sm focus:bg-white focus:ring-1 focus:ring-zinc-800 focus:outline-none transition-all"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* STEP 4: MUTED COLORS & FILTERS */}
      <div className="space-y-4 bg-white p-4 rounded-lg border border-zinc-100 shadow-sm">
        <div className="flex items-center space-x-2 border-b border-zinc-100 pb-2">
          <Sliders className="w-4 h-4 text-zinc-400" />
          <h3 className="font-serif-lux text-sm font-semibold text-zinc-700 uppercase tracking-wider">4. Muted Palettes & Adjustments</h3>
        </div>

        {/* Color Palette Picker */}
        <div className="space-y-2">
          <span className="text-[10px] tracking-wider text-zinc-400 font-sans font-semibold block">SELECT MUTED CARD PALETTE:</span>
          <div className="grid grid-cols-3 gap-2">
            {COLOR_PALETTES.map((palette) => (
              <button
                key={palette.id}
                onClick={() => onChangeConfig({ paletteId: palette.id })}
                className={`flex flex-col p-2 rounded border text-left transition-all duration-200 ${
                  config.paletteId === palette.id
                    ? 'border-zinc-800 bg-zinc-50'
                    : 'border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50/50'
                }`}
              >
                <span className="text-[10px] font-sans font-medium text-zinc-700 leading-tight mb-1.5 truncate">{palette.name}</span>
                <div className="flex space-x-1">
                  <div className="w-3.5 h-3.5 rounded-full border border-zinc-200 shadow-sm" style={{ backgroundColor: palette.background }} />
                  <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: palette.textPrimary }} />
                  <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: palette.accent }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Photo Filter Picker */}
        <div className="space-y-2">
          <span className="text-[10px] tracking-wider text-zinc-400 font-sans font-semibold block">PHOTO AESTHETIC FILTER:</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'original', name: 'Original' },
              { id: 'warm-vintage', name: 'Warm Vintage' },
              { id: 'faded-muted', name: 'Faded Muted' },
              { id: 'noir', name: 'Noir (B&W)' },
              { id: 'chrome', name: 'Chrome' },
              { id: 'sepia', name: 'Sepia Film' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => onChangeConfig({ filter: filter.id as PostcardFilter })}
                className={`py-1.5 px-2 text-[10px] font-sans font-medium rounded border transition-all duration-200 text-center ${
                  config.filter === filter.id
                    ? 'border-zinc-800 bg-zinc-50 text-zinc-800'
                    : 'border-zinc-200 text-zinc-500 hover:border-zinc-400 hover:text-zinc-700'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>

        {/* Fine-Tuning Crop sliders */}
        {config.imageSrc && (
          <div className="space-y-3 pt-2 border-t border-dotted border-zinc-100">
            <span className="text-[10px] tracking-wider text-zinc-400 font-sans font-semibold block flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> FINE-TUNE CROP & ZOOM:
            </span>
            
            {/* Zoom Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-sans text-zinc-500">
                <span>Scale Zoom:</span>
                <span>{config.imageZoom.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.5"
                step="0.05"
                value={config.imageZoom}
                onChange={(e) => onChangeConfig({ imageZoom: parseFloat(e.target.value) })}
                className="w-full accent-zinc-800 cursor-pointer h-1 bg-zinc-200 rounded-lg appearance-none"
              />
            </div>

            {/* Pan Sliders */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-sans text-zinc-500">
                  <span>Horizontal Pan:</span>
                  <span>{config.imageX.toFixed(0)}px</span>
                </div>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  step="1"
                  value={config.imageX}
                  onChange={(e) => onChangeConfig({ imageX: parseInt(e.target.value) })}
                  className="w-full accent-zinc-800 cursor-pointer h-1 bg-zinc-200 rounded-lg appearance-none"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-sans text-zinc-500">
                  <span>Vertical Pan:</span>
                  <span>{config.imageY.toFixed(0)}px</span>
                </div>
                <input
                  type="range"
                  min="-200"
                  max="200"
                  step="1"
                  value={config.imageY}
                  onChange={(e) => onChangeConfig({ imageY: parseInt(e.target.value) })}
                  className="w-full accent-zinc-800 cursor-pointer h-1 bg-zinc-200 rounded-lg appearance-none"
                />
              </div>
            </div>
            
            <button
              onClick={() => onChangeConfig({ imageZoom: 1, imageX: 0, imageY: 0 })}
              className="text-[9px] font-sans font-semibold text-zinc-400 hover:text-zinc-600 flex items-center justify-end w-full"
            >
              <RotateCcw className="w-2.5 h-2.5 mr-0.5" /> Reset Crop Offset
            </button>
          </div>
        )}

        {/* Vintage Stamp Customizer */}
        {config.layout === 'split' && (
          <div className="space-y-2 pt-2 border-t border-dotted border-zinc-100">
            <span className="text-[10px] tracking-wider text-zinc-400 font-sans font-semibold block">STAMP ENGRAVING INSIGNIA:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'flower', name: 'Lotus Flower' },
                { id: 'sailboat', name: 'Sailboat Anchor' },
                { id: 'sun', name: 'Sol' },
                { id: 'heart', name: 'Heart' },
                { id: 'postmark', name: 'Compass' },
                { id: 'none', name: 'None' }
              ].map((stamp) => (
                <button
                  key={stamp.id}
                  onClick={() => onChangeConfig({ stampIcon: stamp.id as any })}
                  className={`py-1 px-2.5 text-[9px] font-sans font-medium rounded-full border transition-all duration-150 ${
                    config.stampIcon === stamp.id
                      ? 'bg-zinc-800 text-white border-zinc-800 shadow-sm'
                      : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  {stamp.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* TIPS CORNER */}
      <div className="p-3 bg-zinc-50 rounded border border-zinc-200/80 text-zinc-500 text-[10px] space-y-1.5 font-sans leading-relaxed">
        <div className="flex items-center text-zinc-600 font-semibold uppercase tracking-wider text-[9px]">
          <Info className="w-3.5 h-3.5 mr-1 text-zinc-400" /> Designer Tips
        </div>
        <p>• Only the **Photograph** is mandatory to generate a postcard.</p>
        <p>• Try clicking on the photo within the preview directly to **drag and pan** it visually to fit your postcard size perfectly.</p>
        <p>• Muted palettes look best with corresponding filter aesthetics; for example, pair *Warm Sand* with *Warm Vintage* or *Charcoal Slate* with *Noir* for maximum nostalgia.</p>
      </div>
    </div>
  );
}
