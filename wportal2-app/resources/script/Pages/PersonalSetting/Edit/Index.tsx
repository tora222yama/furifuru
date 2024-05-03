import * as React from 'react';
import { useContext, useMemo } from 'react';
import { IPropsBase } from '@/script/System/System';
import {
  AppTrnUserSlackProfileList,
  IAppTrnUserSlackProfile,
  parseAppTrnUserSlackProfilePayload,
} from '@/script/Models/App/Trn/TrnUserSlackProfileList';
import { CommonIndexProvider } from '@/script/Provider/CommonIndexProvider';
import { Edit } from '@/script/Pages/PersonalSetting/Edit/Edit';

/**
 * コントローラーからグローバルに受取保持する値.
 */
type IndexContext = {
  trnUserSlackProfile: IAppTrnUserSlackProfile;
};
export const context = React.createContext<IndexContext>({
  trnUserSlackProfile: AppTrnUserSlackProfileList.defaultInterface(),
});
export const useIndexContext = (): IndexContext => useContext(context);

interface IProps extends IPropsBase {
  trnUserSlackProfile?: [];
}
export const Index: React.FC<IProps> = ({ trnUserSlackProfile, ...props }) => {
  /**
   * 下位コンポーネントで利用するコントローラー経由のパラメータ.
   */
  const providerValue: IndexContext = useMemo(
    () => ({
      trnUserSlackProfile:
        parseAppTrnUserSlackProfilePayload(trnUserSlackProfile),
    }),
    [trnUserSlackProfile],
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
