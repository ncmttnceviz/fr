import { alpha, styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

export default styled(InputBase)(({ theme,color }) => ({
    'label + &': {
      marginTop: theme.spacing(2.5),
    },
    '& .MuiInputBase-input': {
      borderRadius: 0,
      position: 'relative',
      backgroundColor: 'transparent !important',
      color: 'white',
      border: '2px solid white',
      fontSize: 15,
      padding: '7px 12px',
      borderColor: theme.palette.grey[300],
      transition: theme.transitions.create([
        'border-color',
        'background-color',
        'box-shadow',
      ]),
      '&.Mui-focused input': {
        borderColor: "red"
      }
    },
    '& . MuiSelect-select': {
        backgroundColor: theme.palette.mode === 'light' ? "rgba(255, 255, 255, 0.7)" : '#2b2b2b',
    }
  }));