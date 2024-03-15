import * as React from 'react';
import { useContext, useMemo } from 'react';
import { FirstPage } from '@/js/Pages/FirstPage/FirstPage';
import { IndexProvider } from '@/js/Provider/IndexProvider';
export const context = React.createContext({
    numberValue: 0,
    stringValue: '',
    arrayValue: [],
});
export const useFirstPageContext = () => useContext(context);
export const FirstPageIndex = ({ numberValue, stringValue, arrayValue, }) => {
    /**
     * 下位コンポーネントで利用するコントローラー経由のパラメータ.
     */
    const providerValue = useMemo(() => ({
        numberValue,
        stringValue,
        arrayValue,
    }), [numberValue, stringValue, arrayValue]);
    return (<context.Provider value={providerValue}>
      <IndexProvider>
        <FirstPage />
      </IndexProvider>
    </context.Provider>);
};
export default FirstPageIndex;
//# sourceMappingURL=FirstPageIndex.jsx.map