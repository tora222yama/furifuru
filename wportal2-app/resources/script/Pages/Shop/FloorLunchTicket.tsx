import * as React from 'react';
import { Box, Grid } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { responsiveSpacing } from '@/script/System/Responsive';
import { LunchTicket } from '@/script/Pages/Shop/LunchTicket';
import { useIndexContext } from '@/script/Pages/Shop/Index';
import { E_COLOR } from '@/script/Enum/EColor';
import { TypoText2 } from '@/script/Component/Typography/TypoText2';
import { IAppMstGoods } from '@/script/Models/App/Mst/MstGoodsList';
import { DialogCalendarUserScheduleSelect } from '@/script/Pages/Common/Dialog/DialogCalendarUserScheduleSelect';
import { Closable } from '@/script/Component/Misc/Closable';

interface IProps extends IPropsBase {}
export const FloorLunchTicket: React.FC<IProps> = () => {
  const { mstGoodsList } = useIndexContext();
  const [openCalendarDialog, setOpenCalendarDialog] = React.useState<
    IAppMstGoods | undefined
  >(undefined);

  /**
   * チケットを選択.
   */
  const handleClick = (mstGoods: IAppMstGoods) => {
    setOpenCalendarDialog(mstGoods);
  };

  return (
    <Box
      sx={{
        padding: responsiveSpacing(4),
      }}
    >
      <Closable open={!!openCalendarDialog}>
        <DialogCalendarUserScheduleSelect
          open={!!openCalendarDialog}
          emailList={['miki-yoji@919.jp', 'tobaru-hideyasu@919.jp']}
          startDate=""
          endDate=""
          handleClose={() => setOpenCalendarDialog(undefined)}
        />
      </Closable>
      <Grid
        sx={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, minmax(300px, 1fr))`,
          justifyContent: 'center',
          width: '90%',
          margin: '0 auto',
          gap: '40px',
        }}
      >
        {mstGoodsList.list().map(mstGoods => {
          return (
            <Grid key={mstGoods.id} item onClick={() => handleClick(mstGoods)}>
              <Box>
                <LunchTicket mstGoods={mstGoods} />
              </Box>
              <Box
                sx={{
                  marginTop: responsiveSpacing(2),
                  width: '300px',
                }}
              >
                <TypoText2
                  sx={{
                    padding: '4px 10px',
                    background: E_COLOR.PRIMARY_LIGHT,
                  }}
                  bold
                >
                  {mstGoods.name}
                </TypoText2>
                <TypoText2
                  sx={{
                    background: E_COLOR.WHITE,
                    padding: '4px 10px',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {mstGoods.explain}
                </TypoText2>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
