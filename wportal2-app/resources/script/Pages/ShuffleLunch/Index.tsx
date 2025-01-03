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
import {
  E_CALCULATE,
  ECalculate,
} from '@/script/Enum/Server/App/ShuffleLunch/ECalculate';

/**
 * コントローラーからグローバルに受取保持する値.
 */
type IndexContext = {
  timezone: ETimeZone;
  calculate: ECalculate;
  trnShuffleLunchEntryList: AppTrnShuffleLunchEntryList;
  errorMessage: string;
};
export const context = React.createContext<IndexContext>({
  timezone: E_TIME_ZONE.INVALID,
  calculate: E_CALCULATE.INVALID,
  trnShuffleLunchEntryList: new AppTrnShuffleLunchEntryList(),
  errorMessage: '',
});
export const useIndexContext = (): IndexContext => useContext(context);

interface IProps extends IPropsBase {
  timezone: number;
  calculate: number;
  trnShuffleLunchEntryList: IAppTrnShuffleLunchEntry[];
  errorMessage: string;
}
export const Index: React.FC<IProps> = ({
  timezone,
  calculate,
  trnShuffleLunchEntryList,
  errorMessage,
  ...props
}) => {
  /**
   * 下位コンポーネントで利用するコントローラー経由のパラメータ.
   */
  const providerValue: IndexContext = useMemo(
    () => ({
      timezone: timezone as ETimeZone,
      calculate: calculate as ECalculate,
      trnShuffleLunchEntryList: new AppTrnShuffleLunchEntryList(
        trnShuffleLunchEntryList.map(v =>
          parseAppTrnShuffleLunchEntryPayload(v),
        ),
      ),
      errorMessage,
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
