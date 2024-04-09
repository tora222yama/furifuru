import * as React from 'react';
import { useContext, useMemo } from 'react';
import { IPropsBase } from '@/script/System/System';
import { MvcValue } from '@/script/Pages/MvcValue/MvcValue';
import { IndexProvider } from '@/script/Provider/IndexProvider';

/**
 * コントローラーから受取保持する値.
 */
type MvcValueContext = {
  numberValue: number;
  stringValue: string;
  arrayValue: number[];
};
export const context = React.createContext<MvcValueContext>({
  numberValue: 0,
  stringValue: '',
  arrayValue: [],
});
export const useMvcValueContext = (): MvcValueContext => useContext(context);

/**
 * コントローラーから受け取るprops.
 */
interface IPros extends IPropsBase {
  numberValue: number;
  stringValue: string;
  arrayValue: number[];
}
export const MvcValueIndex: React.FC<IPros> = ({
  csrfToken,
  numberValue,
  stringValue,
  arrayValue,
}) => {
  /**
   * 下位コンポーネントで利用するコントローラー経由のパラメータ.
   */
  const providerValue: MvcValueContext = useMemo(
    () => ({
      numberValue,
      stringValue,
      arrayValue,
    }),
    [numberValue, stringValue, arrayValue],
  );

  return (
    <context.Provider value={providerValue}>
      <IndexProvider csrfToken={csrfToken}>
        <MvcValue />
      </IndexProvider>
    </context.Provider>
  );
};
export default MvcValueIndex;
