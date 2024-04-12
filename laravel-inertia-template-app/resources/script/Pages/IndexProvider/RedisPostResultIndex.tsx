import * as React from 'react';
import { useContext, useMemo } from 'react';
import { IPropsBase } from '@/script/System/System';
import { IndexProvider } from '@/script/Provider/IndexProvider';
import { RedisPostResult } from '@/script/Pages/RedisPostResult/RedisPostResult';

/**
 * コントローラーから受取保持する値.
 */
type RedisPostResultContext = {
  storeValue: string;
};
export const context = React.createContext<RedisPostResultContext>({
  storeValue: '',
});
export const useRedisPostResultContext = (): RedisPostResultContext =>
  useContext(context);

/**
 * コントローラーから受け取るprops.
 */
interface IProps extends IPropsBase {
  storeValue: string;
}
export const RedisPostResultIndex: React.FC<IProps> = ({
  storeValue,

  ...props
}) => {
  /**
   * 下位コンポーネントで利用するコントローラー経由のパラメータ.
   */
  const providerValue: RedisPostResultContext = useMemo(
    () => ({
      storeValue,
    }),
    [storeValue],
  );

  // noinspection TypeScriptValidateTypes
  return (
    <context.Provider value={providerValue}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <IndexProvider {...props}>
        <RedisPostResult />
      </IndexProvider>
    </context.Provider>
  );
};
export default RedisPostResultIndex;
