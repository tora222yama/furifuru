import * as React from 'react';
import { useContext, useMemo } from 'react';
import { IPropsBase } from '@/script/System/System';
import { CommonIndexProvider } from '@/script/Provider/CommonIndexProvider';
import { ShuffleLunch } from '@/script/Pages/ShuffleLunch/ShuffleLunch';

/**
 * コントローラーからグローバルに受取保持する値.
 */
type IndexContext = {};
export const context = React.createContext<IndexContext>({});
export const useIndexContext = (): IndexContext => useContext(context);

interface IProps extends IPropsBase {}
export const Index: React.FC<IProps> = ({ ...props }) => {
  /**
   * 下位コンポーネントで利用するコントローラー経由のパラメータ.
   */
  const providerValue: IndexContext = useMemo(() => ({}), []);

  return (
    <CommonIndexProvider {...props}>
      <context.Provider value={providerValue}>
        <ShuffleLunch />
      </context.Provider>
    </CommonIndexProvider>
  );
};
export default Index;
