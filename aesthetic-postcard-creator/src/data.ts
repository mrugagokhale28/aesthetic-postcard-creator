import { ColorPalette } from './types';

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'warm-sand',
    name: 'Warm Sand',
    background: '#FAF6F0',
    textPrimary: '#3D352F',
    textMuted: '#8C7D70',
    accent: '#C7AC92',
    border: 'rgba(61, 53, 47, 0.12)',
    badgeBg: '#F0EAE1'
  },
  {
    id: 'olive-grove',
    name: 'Olive Grove',
    background: '#F4F6F0',
    textPrimary: '#2C352D',
    textMuted: '#738075',
    accent: '#9BB197',
    border: 'rgba(44, 53, 45, 0.12)',
    badgeBg: '#EAF0E5'
  },
  {
    id: 'dusty-rose',
    name: 'Dusty Rose',
    background: '#FAF3F3',
    textPrimary: '#423232',
    textMuted: '#8C7373',
    accent: '#CCA0A0',
    border: 'rgba(66, 50, 50, 0.12)',
    badgeBg: '#F3E6E6'
  },
  {
    id: 'vintage-ocean',
    name: 'Vintage Ocean',
    background: '#F0F4F7',
    textPrimary: '#2B353E',
    textMuted: '#6F7E8C',
    accent: '#97ADC1',
    border: 'rgba(43, 53, 62, 0.12)',
    badgeBg: '#E3EAEE'
  },
  {
    id: 'aura-amber',
    name: 'Aura Amber',
    background: '#FAF6EF',
    textPrimary: '#4E3A26',
    textMuted: '#9B8168',
    accent: '#D4AA7D',
    border: 'rgba(78, 58, 38, 0.12)',
    badgeBg: '#F3EADB'
  },
  {
    id: 'charcoal-slate',
    name: 'Charcoal Slate',
    background: '#F3F4F6',
    textPrimary: '#1F2937',
    textMuted: '#6B7280',
    accent: '#9CA3AF',
    border: 'rgba(31, 41, 55, 0.12)',
    badgeBg: '#E5E7EB'
  }
];

export interface PresetImage {
  id: string;
  name: string;
  url: string;
  photographer: string;
}

export const PRESET_IMAGES: PresetImage[] = [
  {
    id: 'seal-rocks',
    name: 'Seal Rocks',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Sean O.'
  },
  {
    id: 'coastal-cliff',
    name: 'Aesthetic Sea',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Lukasz Szmigiel'
  },
  {
    id: 'italian-village',
    name: 'Tuscany Archway',
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Pietro De Grandi'
  },
  {
    id: 'misty-trees',
    name: 'Misty Pines',
    url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Luke Stackpoole'
  },
  {
    id: 'desert-dune',
    name: 'Golden Dunes',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    photographer: 'Wolfgang Hasselmann'
  }
];
