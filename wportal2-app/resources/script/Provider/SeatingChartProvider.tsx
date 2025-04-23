import * as React from 'react';
import { Vector2D } from '@/script/Common/Canvas/Math/Vector2D';
import { SeatObject } from '@/script/Pages/SeatingChart/SeatObject';

interface ISeat {
  id: number;
  label: string;
  positionX: number;
  positionY: number;
  phoneNumber: string;
}

interface ISeatingChartContext {
  seats: ISeat[];
  seatObjects: SeatObject[];
}

const SeatingChartContext = React.createContext<ISeatingChartContext>({
  seats: [],
  seatObjects: [],
});

interface IProps {
  children: React.ReactNode;
  seats: ISeat[];
}

export const SeatingChartProvider: React.FC<IProps> = ({ children, seats }) => {
  const seatObjects = React.useMemo(() => {
    return seats.map((seat) => {
      return new SeatObject(
        `seat-${seat.id}`,
        seat.label,
        new Vector2D(seat.positionX, seat.positionY),
        new Vector2D(100, 100)
      );
    });
  }, [seats]);

  const contextValue = React.useMemo(() => {
    return {
      seats,
      seatObjects,
    };
  }, [seats, seatObjects]);

  return (
    <SeatingChartContext.Provider value={contextValue}>
      {children}
    </SeatingChartContext.Provider>
  );
};

export const useSeatingChart = (): ISeatingChartContext => {
  return React.useContext(SeatingChartContext);
};
