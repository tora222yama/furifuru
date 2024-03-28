export const E_COLOR = {
  INVALID: '#000000',

  // 基本カラー.
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GREY: '#A0A0A0',

  // 設定カラー.
  PRIMARY_LIGHT: '#80CBC4',
  PRIMARY_MAIN: '#009688',
  PRIMARY_DARK: '#007666',
  PRIMARY_TEXT: '#FFFFFF',
  SECONDARY_LIGHT: '#FDE846',
  SECONDARY_MAIN: '#FDD835',
  SECONDARY_DARK: '#EDC836',
  SECONDARY_TEXT: '#242424',
  BACKGROUND: '#EEEEEE',

  // 文字色.
  TEXT_PRIMARY: '#333333',
} as const;
export type EColor = (typeof E_COLOR)[keyof typeof E_COLOR];
