import * as React from 'react';
import { useContext, useMemo } from 'react';
import { CommonIndexProvider } from '@/script/Provider/CommonIndexProvider';
import {
  AppTrnUserList,
  IAppTrnUser,
  parseAppTrnUserPayload,
} from '@/script/Models/App/Trn/TrnUserList';
import { IPropsBase } from '@/script/System/System';
import { MvcValue } from '@/script/Pages/Sample/MvcValue/MvcValue';

/**
 * コントローラーから受取保持する値.
 */
type IndexContext = {
  numberValue: number;
  stringValue: string;
  arrayValue: number[];

  trnUserList: AppTrnUserList;
};
export const context = React.createContext<IndexContext>({
  numberValue: 0,
  stringValue: '',
  arrayValue: [],

  trnUserList: new AppTrnUserList(),
});
export const useMvcValueContext = (): IndexContext => useContext(context);

/**
 * コントローラーから受け取るprops.
 */
interface IPros extends IPropsBase {
  numberValue: number;
  stringValue: string;
  arrayValue: number[];

  trnUserList: IAppTrnUser[];
}
export const Index: React.FC<IPros> = ({
  numberValue,
  stringValue,
  arrayValue,

  trnUserList,

  ...props
}) => {
  /**
   * 下位コンポーネントで利用するコントローラー経由のパラメータ.
   */
  const providerValue: IndexContext = useMemo(
    () => ({
      numberValue,
      stringValue,
      arrayValue,

      trnUserList: new AppTrnUserList(
        trnUserList.map(v => parseAppTrnUserPayload(v)),
      ),
    }),
    [numberValue, stringValue, arrayValue, trnUserList],
  );

  // noinspection TypeScriptValidateTypes
  return (
    <context.Provider value={providerValue}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <CommonIndexProvider {...props}>
        <MvcValue />
      </CommonIndexProvider>
    </context.Provider>
  );
};
export default Index;
