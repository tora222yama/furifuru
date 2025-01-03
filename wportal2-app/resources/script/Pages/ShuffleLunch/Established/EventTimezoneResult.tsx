import * as React from 'react';
import { IPropsBase } from '@/script/System/System';
import { EEventTimeZone } from '@/script/Enum/Server/App/ShuffleLunch/EEventTimeZone';
import { useIndexContext } from '@/script/Pages/ShuffleLunch/Index';
import { Box } from '@mui/material';
import { responsiveSpacing } from '@/script/System/Responsive';
import { EventGroup } from '@/script/Pages/ShuffleLunch/Established/EventGroup';
import { TypoH2 } from '@/script/Component/Typography/TypoH2';

interface IProps extends IPropsBase {
  eventTimeZone: EEventTimeZone;
}
export const EventTimezoneResult: React.FC<IProps> = ({
  sx,
  eventTimeZone,
}) => {
  const { trnShuffleLunchGroupList } = useIndexContext();
  const groupIdList =
    trnShuffleLunchGroupList.getGroupIdListByEventTimeZone(eventTimeZone);

  if (groupIdList.length === 0) {
    return <TypoH2 sx={{ ...sx }}>本日のマッチ結果はありません</TypoH2>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: responsiveSpacing(4),
        ...sx,
      }}
    >
      {groupIdList.map(groupId => {
        return (
          <EventGroup
            key={groupId}
            eventTimeZone={eventTimeZone}
            groupId={groupId}
          />
        );
      })}
    </Box>
  );
};
