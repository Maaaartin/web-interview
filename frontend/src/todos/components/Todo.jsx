import React from 'react';
import { TextField, Button, Typography, Checkbox, FormControlLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

export const Todo = ({ index, todo, onTodoChange, onRemoveTodo }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography sx={{ margin: '8px' }} variant='h6'>
        {index + 1}
      </Typography>
      <TextField
        autoFocus
        sx={{ flexGrow: 1, marginTop: '1rem' }}
        label='What to do?'
        value={todo.title || ''}
        onChange={(event) => onTodoChange(index, 'title', event.target.value)}
      />
      <FormControlLabel
        value='top'
        control={
          <Checkbox
            checked={!!todo.checked}
            value={!!todo.checked}
            onChange={() => onTodoChange(index, 'checked', !todo.checked, false)}
          />
        }
        label='Done'
        labelPlacement='top'
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          disabled={todo.checked}
          label='When should be done?'
          value={todo.due ? dayjs(todo.due) : null}
          onChange={(dateTime) => onTodoChange(index, 'due', dateTime)}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <Button
        sx={{ margin: '8px' }}
        size='small'
        color='secondary'
        onClick={() => onRemoveTodo(todo, index)}
      >
        <DeleteIcon />
      </Button>
    </div>
  );
};
