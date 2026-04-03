export const E_COLOR = {
  INVALID: '#000000',

  // 基本カラー.
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GREY: '#A0A0A0',
  GREY_LIGHT: '#F7F7F7',
  RED: '#F44336',
  RED_LIGHT: '#FFCDD2',
  GREEN_LIGHT: '#C5E8E1',
  YELLOW: '#F5CD3B',
  YELLOW_LIGHT: '#FFFD93',
  BLUE: '#0000ff',
  BLUE_LIGHT: '#D3ECF6',

  // 設定カラー.
  PRIMARY_LIGHT: '#d3ecf6',
  PRIMARY_MAIN: '#229bbf',
  PRIMARY_DARK: '#0074a1',
  PRIMARY_TEXT: '#FFFFFF',
  SECONDARY_LIGHT: '#ffddc6',
  SECONDARY_MAIN: '#F47629',
  SECONDARY_DARK: '#EDC836',
  SECONDARY_TEXT: '#242424',
  BACKGROUND: '#EEEEEE',
  BACKGROUND_GRAYOUT: '#9c9c9c',

  // 文字色.
  TEXT_PRIMARY: '#333333',
  TEXT_BLUE: '#155B94',
  TEXT_RED: '#DC3C31',

  // ベータ.
  BETA: '#0320c1',
} as const;
export type EColor = (typeof E_COLOR)[keyof typeof E_COLOR];
