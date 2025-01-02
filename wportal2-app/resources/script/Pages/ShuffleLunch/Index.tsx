import * as React from 'react';
import { useContext, useMemo } from 'react';
import { IPropsBase } from '@/script/System/System';
import { CommonIndexProvider } from '@/script/Provider/CommonIndexProvider';
import { ShuffleLunch } from '@/script/Pages/ShuffleLunch/ShuffleLunch';
import {
  E_TIME_ZONE,
  ETimeZone,
} from '@/script/Enum/Server/App/ShuffleLunch/ETimeZone';
import {
  AppTrnShuffleLunchEntryList,
  IAppTrnShuffleLunchEntry,
  parseAppTrnShuffleLunchEntryPayload,
} from '@/script/Models/App/Trn/TrnShuffleLunchEntry';

/**
 * コントローラーからグローバルに受取保持する値.
 */
type IndexContext = {
  timezone: ETimeZone;
  trnShuffleLunchEntryList: AppTrnShuffleLunchEntryList;
};
export const context = React.createContext<IndexContext>({
  timezone: E_TIME_ZONE.INVALID,
  trnShuffleLunchEntryList: new AppTrnShuffleLunchEntryList(),
});
export const useIndexContext = (): IndexContext => useContext(context);

interface IProps extends IPropsBase {
  timezone: number;
  trnShuffleLunchEntryList: IAppTrnShuffleLunchEntry[];
}
export const Index: React.FC<IProps> = ({
  timezone,
  trnShuffleLunchEntryList,
  ...props
}) => {
  /**
   * 下位コンポーネントで利用するコントローラー経由のパラメータ.
   */
  const providerValue: IndexContext = useMemo(
    () => ({
      timezone: timezone as ETimeZone,
      trnShuffleLunchEntryList: new AppTrnShuffleLunchEntryList(
        trnShuffleLunchEntryList.map(v =>
          parseAppTrnShuffleLunchEntryPayload(v),
        ),
      ),
    }),
    [timezone, trnShuffleLunchEntryList],
  );

  return (
    <CommonIndexProvider {...props}>
      <context.Provider value={providerValue}>
        <ShuffleLunch />
      </context.Provider>
    </CommonIndexProvider>
  );
};
export default Index;
