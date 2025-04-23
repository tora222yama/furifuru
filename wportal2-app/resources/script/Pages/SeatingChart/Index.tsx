import * as React from 'react';
import { useContext, useMemo } from 'react';
import { IPropsBase } from '@/script/System/System';
import { CommonIndexProvider } from '@/script/Provider/CommonIndexProvider';
import { SeatingChart } from '@/script/Pages/SeatingChart/SeatingChart';
import { Vector2D } from '@/script/Common/Canvas/Math/Vector2D';
import { SeatObject } from '@/script/Pages/SeatingChart/SeatObject';
import { 
  AppTrnSeatList, 
  IAppTrnSeat, 
  parseAppTrnSeatPayload 
} from '@/script/Models/App/Trn/TrnSeatList';

/**
 * コントローラーからグローバルに受取保持する値.
 */
type IndexContext = {
  trnSeatList: AppTrnSeatList;
  seatObjects: SeatObject[];
};
export const context = React.createContext<IndexContext>({
  trnSeatList: new AppTrnSeatList(),
  seatObjects: [],
});
export const useIndexContext = (): IndexContext => useContext(context);

interface IProps extends IPropsBase {
  trnSeatList: {
    list: IAppTrnSeat[];
  };
}
export const Index: React.FC<IProps> = ({ trnSeatList, ...props }) => {
  /**
   * 下位コンポーネントで利用するコントローラー経由のパラメータ.
   */
  const providerValue = useMemo(
    () => {
      const seatList = new AppTrnSeatList(
        trnSeatList.list.map(v => parseAppTrnSeatPayload(v))
      );
      
      const seatObjects = seatList.list().map((seat: IAppTrnSeat) => {
        return new SeatObject(
          `seat-${seat.id}`,
          seat.label,
          new Vector2D(seat.positionX, seat.positionY),
          new Vector2D(100, 100)
        );
      });
      
      return {
        trnSeatList: seatList,
        seatObjects,
      };
    },
    [trnSeatList]
  );

  return (
    <CommonIndexProvider {...props}>
      <context.Provider value={providerValue}>
        <SeatingChart />
      </context.Provider>
    </CommonIndexProvider>
  );
};
export default Index;
