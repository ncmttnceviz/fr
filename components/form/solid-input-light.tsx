import { alpha, styled } from '@mui/material/styles';
import SolidInput from './solid-input';

export default styled(SolidInput)(({ theme,color }) => ({
    'label + &': {
      marginTop: theme.spacing(2.5),
    },
    '& .MuiInputBase-input': {
      borderRadius: 0,
      position: 'relative',
      backgroundColor: theme.palette.mode === 'light' ? "transparent !important" : '#2b2b2b !important',
      border: '1px solid #ced4da',
      fontSize: 13,
      color: 'white',
      padding: '3px 12px',
      borderColor: theme.palette.grey[100],
      transition: theme.transitions.create([
        'border-color',
        'background-color',
        'box-shadow',
      ]),
    },
    '& . MuiSelect-select': {
        backgroundColor: theme.palette.mode === 'light' ? "transparent" : '#2b2b2b',
    },
    '& .MuiSelect-icon':{
      color: 'white'
    }
  }));