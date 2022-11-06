import React from 'react';
import { TextField, Button, Typography, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

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
      <Checkbox
        checked={!!todo.checked}
        value={!!todo.checked}
        onChange={() => onTodoChange(index, 'checked', !todo.checked, false)}
      />
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
