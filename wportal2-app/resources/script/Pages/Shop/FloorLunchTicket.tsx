import * as React from 'react';
import { Box, Grid } from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { responsiveSpacing } from '@/script/System/Responsive';
import { LunchTicket } from '@/script/Pages/Shop/LunchTicket';
import { useIndexContext } from '@/script/Pages/Shop/Index';

interface IProps extends IPropsBase {}
export const FloorLunchTicket: React.FC<IProps> = () => {
  const { mstGoodsList } = useIndexContext();

  return (
    <Box
      sx={{
        padding: responsiveSpacing(4),
      }}
    >
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
            <Grid item key={mstGoods.id}>
              <LunchTicket />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
