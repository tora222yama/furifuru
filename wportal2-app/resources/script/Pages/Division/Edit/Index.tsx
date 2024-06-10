import * as React from 'react';
import { useContext, useMemo } from 'react';
import {
  AppTrnDivisionList,
  IAppTrnDivision,
  parseAppTrnDivisionPayload,
} from '@/script/Models/App/Trn/TrnDivisionList';
import { IPropsBase } from '@/script/System/System';
import { CommonIndexProvider } from '@/script/Provider/CommonIndexProvider';
import { Edit } from '@/script/Pages/Division/Edit/Edit';

/**
 * コントローラーからグローバルに受取保持する値.
 */
type IndexContext = {
  trnDivisionList: AppTrnDivisionList;
};
export const context = React.createContext<IndexContext>({
  trnDivisionList: new AppTrnDivisionList(),
});
export const useIndexContext = (): IndexContext => useContext(context);

interface IProps extends IPropsBase {
  trnDivision: IAppTrnDivision;
}
export const Index: React.FC<IProps> = ({ trnDivision, ...props }) => {
  /**
   * 下位コンポーネントで利用するコントローラー経由のパラメータ.
   */
  const providerValue: IndexContext = useMemo(
    () => ({
      trnDivisionList: new AppTrnDivisionList([
        parseAppTrnDivisionPayload(trnDivision),
      ]),
    }),
    [trnDivision],
  );

  // noinspection TypeScriptValidateTypes
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <CommonIndexProvider {...props}>
      <context.Provider value={providerValue}>
        <Edit />
      </context.Provider>
    </CommonIndexProvider>
  );
};
export default Index;
