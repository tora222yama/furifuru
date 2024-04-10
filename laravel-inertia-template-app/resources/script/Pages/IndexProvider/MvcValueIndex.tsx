import * as React from 'react';
import { useContext, useMemo } from 'react';
import { IPropsBase } from '@/script/System/System';
import { MvcValue } from '@/script/Pages/MvcValue/MvcValue';
import { IndexProvider } from '@/script/Provider/IndexProvider';
import { ITrnFacility, parsePayload } from '@/script/Models/App/TrnFacility';

/**
 * コントローラーから受取保持する値.
 */
type MvcValueContext = {
  numberValue: number;
  stringValue: string;
  arrayValue: number[];

  trnFacilityList: ITrnFacility[];
};
export const context = React.createContext<MvcValueContext>({
  numberValue: 0,
  stringValue: '',
  arrayValue: [],

  trnFacilityList: [],
});
export const useMvcValueContext = (): MvcValueContext => useContext(context);

/**
 * コントローラーから受け取るprops.
 */
interface IPros extends IPropsBase {
  numberValue: number;
  stringValue: string;
  arrayValue: number[];

  trnFacilityList: [];
}
export const MvcValueIndex: React.FC<IPros> = ({
  csrfToken,
  numberValue,
  stringValue,
  arrayValue,

  trnFacilityList,
}) => {
  /**
   * 下位コンポーネントで利用するコントローラー経由のパラメータ.
   */
  const providerValue: MvcValueContext = useMemo(
    () => ({
      numberValue,
      stringValue,
      arrayValue,

      trnFacilityList: trnFacilityList.map(v => parsePayload(v)),
    }),
    [numberValue, stringValue, arrayValue, trnFacilityList],
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
