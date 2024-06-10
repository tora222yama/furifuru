export interface IInputProps {
  width?: string;
  minWidth?: string;
  height?: string;
  padding?: string;
  marginRight?: string;
  resize?: string;
  textAlign?: string;
}

/**
 * インプットボックスの初期設定.
 */
export const defaultInputProps = {
  width: undefined,
  minWidth: undefined,
  height: 'typography.body1.fontSize',
  padding: '4px',
  marginRight: '3px',
  resize: 'none',
  textAlign: 'start',
};

/**
 * 外部値と初期値のマージを行う.
 * @param props
 */
export const parseInputProps = (props?: IInputProps): IInputProps => {
  return {
    width: props?.width ?? defaultInputProps.width,
    minWidth: props?.minWidth ?? defaultInputProps.minWidth,
    height: props?.height ?? defaultInputProps.height,
    padding: props?.padding ?? defaultInputProps.padding,
    marginRight: props?.marginRight ?? defaultInputProps.marginRight,
    resize: props?.resize ?? defaultInputProps.resize,
    textAlign: props?.textAlign ?? defaultInputProps.textAlign,
  };
};
