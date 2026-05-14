import * as React from 'react';
import {
  Box,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  Tooltip,
} from '@mui/material';
import { IPropsBase } from '@/script/System/System';
import { TypoText } from '@/script/Component/Typography/TypoText';
import { E_COLOR } from '@/script/Enum/EColor';
import { IDate } from '@/script/Common/getMonthCalendar';
import {
  DisplaySyncStatus,
  ShiftType,
} from '@/script/Pages/ShiftSchedule/Index';

interface IProps extends IPropsBase {
  date: IDate;
  shift: ShiftType;
  holidayName?: string;
  syncStatus?: DisplaySyncStatus;
  onShiftChange: (shift: ShiftType) => void;
}

type StatusConfig = {
  label: string;
  color: 'default' | 'warning' | 'success' | 'error';
};

const SYNC_STATUS_CONFIG: Record<DisplaySyncStatus, StatusConfig> = {
  unregistered: { label: '未反映', color: 'default' },
  unsaved: { label: '未反映', color: 'default' },
  pending: { label: '未反映', color: 'default' },
  synced: { label: '反映', color: 'success' },
  failed: { label: '反映失敗', color: 'error' },
};

export const Day: React.FC<IProps> = ({
  sx,
  date,
  shift,
  holidayName,
  syncStatus,
  onShiftChange,
}) => {
  const dateColor = date.inRange ? E_COLOR.BLACK : E_COLOR.GREY;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onShiftChange(event.target.value as ShiftType);
  };

  return (
    <Box
      sx={{
        padding: '6px',
        minHeight: '120px',
        borderTop: `1px solid ${E_COLOR.GREY}`,
        borderLeft: `1px solid ${E_COLOR.GREY}`,
        position: 'relative',
        ...sx,
        bgcolor:
          date.inRange && shift === 'holiday'
            ? E_COLOR.BACKGROUND_GRAYOUT
            : 'transparent',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
        }}
      >
        <TypoText color={dateColor} bold={date.inRange}>
          {date.dateTime.toFormatString('dd日')}
        </TypoText>
        {holidayName && (
          <TypoText size="xs" color={E_COLOR.TEXT_RED}>
            {holidayName}
          </TypoText>
        )}
      </Box>
      {date.inRange && (
        <Box sx={{ marginTop: '4px', height: '18px' }}>
          {syncStatus && (
            <Chip
              label={SYNC_STATUS_CONFIG[syncStatus].label}
              color={SYNC_STATUS_CONFIG[syncStatus].color}
              size="small"
              sx={{
                height: '18px',
                fontSize: '10px',
                '& .MuiChip-label': { px: '6px' },
              }}
            />
          )}
        </Box>
      )}
      {date.inRange && (
        <RadioGroup
          value={shift}
          onChange={handleChange}
          sx={{ marginTop: '8px', position: 'relative' }}
        >
          <FormControlLabel
            value="remote"
            control={<Radio size="small" />}
            label={
              <Tooltip
                title={
                  syncStatus === 'unregistered' && shift === 'remote'
                    ? '未反映のまま送信すると在宅として反映されます'
                    : ''
                }
                placement="top"
                arrow
              >
                <span>
                  <TypoText size="xs">在宅</TypoText>
                </span>
              </Tooltip>
            }
          />
          <FormControlLabel
            value="office"
            control={<Radio size="small" />}
            label={<TypoText size="xs">出社</TypoText>}
          />
          <FormControlLabel
            value="businessTrip"
            control={<Radio size="small" />}
            label={<TypoText size="xs">出張</TypoText>}
          />
          <FormControlLabel
            value="holiday"
            control={<Radio size="small" />}
            label={<TypoText size="xs">休暇</TypoText>}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              margin: 0,
            }}
          />
        </RadioGroup>
      )}
    </Box>
  );
};
