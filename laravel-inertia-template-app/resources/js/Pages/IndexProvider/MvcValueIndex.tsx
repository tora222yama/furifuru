import * as React from 'react';
import { useContext, useMemo } from 'react';
import { IPropsBase } from '@/js/System/System';
import { MvcValue } from '@/js/Pages/MvcValue/MvcValue';
import { IndexProvider } from '@/js/Provider/IndexProvider';

/**
 * コントローラーから受取保持する値.
 */
type FirstPageContext = {
  numberValue: number;
  stringValue: string;
  arrayValue: number[];
};
export const context = React.createContext<FirstPageContext>({
  numberValue: 0,
  stringValue: '',
  arrayValue: [],
});
export const useFirstPageContext = (): FirstPageContext => useContext(context);

/**
 * コントローラーから受け取るprops.
 */
interface IPros extends IPropsBase {
  numberValue: number;
  stringValue: string;
  arrayValue: number[];
}
export const MvcValueIndex: React.FC<IPros> = ({
  numberValue,
  stringValue,
  arrayValue,
}) => {
  /**
   * 下位コンポーネントで利用するコントローラー経由のパラメータ.
   */
  const providerValue: FirstPageContext = useMemo(
    () => ({
      numberValue,
      stringValue,
      arrayValue,
    }),
    [numberValue, stringValue, arrayValue],
  );

  return (
    <context.Provider value={providerValue}>
      <IndexProvider>
        <MvcValue />
      </IndexProvider>
    </context.Provider>
  );
};
export default MvcValueIndex;
