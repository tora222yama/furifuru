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
  trnSeatList?: Array<{
    id: number;
    label: string;
    positionX: number;
    positionY: number;
    phoneNumber: string;
  }>;
}
export const Index: React.FC<IProps> = ({ trnSeatList = [], ...props }) => {
  /**
   * 下位コンポーネントで利用するコントローラー経由のパラメータ.
   */
  const seatListData = useMemo(
    () => new AppTrnSeatList(
      trnSeatList.map(v => parseAppTrnSeatPayload(v))
    ),
    [trnSeatList]
  );

  const seatObjects = useMemo(() => {
    return seatListData.list().map((seat: IAppTrnSeat) => {
      return new SeatObject(
        `seat-${seat.id}`,
        seat.label,
        new Vector2D(seat.positionX, seat.positionY),
        new Vector2D(100, 100)
      );
    });
  }, [seatListData]);

  const providerValue = useMemo(
    () => ({
      trnSeatList: seatListData,
      seatObjects,
    }),
    [seatListData, seatObjects]
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
