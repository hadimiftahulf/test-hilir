export type Palette = {
  brandLight: string;
  brandDark: string;
  bgLight: string;
  bgDark: string;
  surfaceDark: string;
  borderDark: string;
  borderLight: string;
  textLight: string;
  textDark: string;
  textMutedL: string;
  textMutedD: string;
  placeholderD: string;
  fillHoverD: string;
};

export type CssVarReader = (name: string, fallbackHex: string) => string;
