import * as React from 'react';
import { useContext, useMemo } from 'react';
import { IPropsBase } from '@/script/System/System';
import { MvcValue } from '@/script/Pages/MvcValue/MvcValue';
import { IndexProvider } from '@/script/Provider/IndexProvider';
import {
  AppTrnFacilityList,
  parseAppTrnFacilityPayload,
} from '@/script/Models/App/Trn/TrnFacilityList';

/**
 * コントローラーから受取保持する値.
 */
type MvcValueContext = {
  numberValue: number;
  stringValue: string;
  arrayValue: number[];

  trnFacilityList: AppTrnFacilityList;
};
export const context = React.createContext<MvcValueContext>({
  numberValue: 0,
  stringValue: '',
  arrayValue: [],

  trnFacilityList: new AppTrnFacilityList(),
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
  numberValue,
  stringValue,
  arrayValue,

  trnFacilityList,

  ...props
}) => {
  /**
   * 下位コンポーネントで利用するコントローラー経由のパラメータ.
   */
  const providerValue: MvcValueContext = useMemo(
    () => ({
      numberValue,
      stringValue,
      arrayValue,

      trnFacilityList: new AppTrnFacilityList(
        trnFacilityList.map(v => parseAppTrnFacilityPayload(v)),
      ),
    }),
    [numberValue, stringValue, arrayValue, trnFacilityList],
  );

  // noinspection TypeScriptValidateTypes
  return (
    <context.Provider value={providerValue}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <IndexProvider {...props}>
        <MvcValue />
      </IndexProvider>
    </context.Provider>
  );
};
export default MvcValueIndex;
