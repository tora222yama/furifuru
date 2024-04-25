import * as React from 'react';
import { useContext, useMemo } from 'react';
import { IPropsBase } from '@/script/System/System';
import { IndexProvider } from '@/script/Provider/IndexProvider';
import { Pagination } from '@/script/Pages/Pagination/Pagination';
import {
  AppTrnFacilityList,
  parseAppTrnFacilityPayload,
} from '@/script/Models/App/Trn/TrnFacilityList';

/**
 * コントローラーから受取保持する値.
 */
type PaginationContext = {
  trnFacilityList: AppTrnFacilityList;
  trnFacilityListCount: number;
  fixList: AppTrnFacilityList;
};
export const context = React.createContext<PaginationContext>({
  trnFacilityList: new AppTrnFacilityList(),
  trnFacilityListCount: 0,
  fixList: new AppTrnFacilityList(),
});
export const usePaginationContext = (): PaginationContext =>
  useContext(context);

/**
 * コントローラーから受け取るprops.
 */
interface IProps extends IPropsBase {
  paginationFacility: { list: []; count: number };
  fixList: [];
}
export const PaginationIndex: React.FC<IProps> = ({
  paginationFacility,
  fixList,

  ...props
}) => {
  /**
   * 下位コンポーネントで利用するコントローラー経由のパラメータ.
   */
  const providerValue: PaginationContext = useMemo(
    () => ({
      trnFacilityList: new AppTrnFacilityList(
        paginationFacility.list.map(v => parseAppTrnFacilityPayload(v)),
      ),
      trnFacilityListCount: paginationFacility.count,
      fixList: new AppTrnFacilityList(
        fixList.map(v => parseAppTrnFacilityPayload(v)),
      ),
    }),
    [paginationFacility, fixList],
  );

  // noinspection TypeScriptValidateTypes
  return (
    <context.Provider value={providerValue}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <IndexProvider {...props}>
        <Pagination />
      </IndexProvider>
    </context.Provider>
  );
};
export default PaginationIndex;
