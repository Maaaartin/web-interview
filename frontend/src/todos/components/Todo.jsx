import React from 'react';
import { TextField, Button, Typography, Checkbox, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';

const GridItemWide = ({ children }) => {
  return (
    <Grid item xs={10} md={4.5}>
      {children}
    </Grid>
  );
};

const GridItemNarrow = ({ children }) => {
  return (
    <Grid item xs={1} md={1}>
      {children}
    </Grid>
  );
};

export const Todo = ({ index, todo, onTodoChange, onRemoveTodo }) => {
  return (
    <Grid
      container
      direction='row'
      justifyContent='left'
      alignItems='center'
      margin={2}
      rowGap={2}
      padding={2}
    >
      <GridItemNarrow>
        <Typography variant='h6'>{index + 1}</Typography>
      </GridItemNarrow>
      <GridItemWide>
        <TextField
          autoFocus
          sx={{ width: '100%' }}
          label='What to do?'
          value={todo.title || ''}
          onChange={(event) => onTodoChange(index, 'title', event.target.value)}
        />
      </GridItemWide>
      <GridItemNarrow>
        <Checkbox
          sx={{ width: '100%' }}
          title='Done'
          checked={!!todo.checked}
          value={!!todo.checked}
          onChange={() => onTodoChange(index, 'checked', !todo.checked, false)}
        />
      </GridItemNarrow>
      <Grid item xs={1} md={'auto'} />
      <GridItemWide>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            disabled={todo.checked}
            label='When should be done?'
            value={todo.due ? dayjs(todo.due) : null}
            onChange={(dateTime) => onTodoChange(index, 'due', dateTime)}
            renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
          />
        </LocalizationProvider>
      </GridItemWide>
      <GridItemNarrow>
        <Button
          sx={{ minWidth: '10px', width: '100%' }}
          title='Delete'
          size='small'
          color='secondary'
          onClick={() => onRemoveTodo(todo, index)}
        >
          <DeleteIcon />
        </Button>
      </GridItemNarrow>
    </Grid>
  );
};
