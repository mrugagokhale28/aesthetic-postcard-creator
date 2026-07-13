export type PostcardSize = 'instagram' | 'story';

export type PostcardLayout = 'split' | 'polaroid' | 'editorial' | 'overlay';

export type PostcardFilter = 'original' | 'warm-vintage' | 'faded-muted' | 'noir' | 'chrome' | 'sepia';

export interface ColorPalette {
  id: string;
  name: string;
  background: string;     // Background of the card
  textPrimary: string;    // Principal color for texts, lines
  textMuted: string;      // Supporting captions, details
  accent: string;         // Delicate touches (e.g., postmark tint)
  border: string;         // Subtle divider border color
  badgeBg: string;        // Small labels background
}

export interface PostcardConfig {
  imageSrc: string | null;
  note: string;
  size: PostcardSize;
  layout: PostcardLayout;
  paletteId: string;
  fontFamily: 'serif-lux' | 'serif-edit' | 'script-formal' | 'script-casual';
  title: string;
  location: string;
  date: string;
  sender: string;
  recipient: string;
  showStamp: boolean;
  stampIcon: 'flower' | 'sailboat' | 'sun' | 'heart' | 'postmark' | 'none';
  filter: PostcardFilter;
  imageZoom: number;
  imageX: number;
  imageY: number;
}
