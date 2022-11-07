import React, { useState } from 'react';
import { TextField, ButtonGroup, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';

export const AddTodoListForm = ({ onCreateList }) => {
  const [listName, setListName] = useState('');
  return (
    <form
      style={{ display: 'flex', alignItems: 'center' }}
      onSubmit={(event) => {
        event.preventDefault();
        onCreateList(listName);
        setListName('');
      }}
    >
      <TextField
        autoFocus
        sx={{ flexGrow: 1, marginTop: '1rem' }}
        label='What is the name of new list?'
        value={listName}
        onChange={(event) => setListName(event.target.value)}
        InputProps={{
          endAdornment: (
            <ButtonGroup variant='text'>
              <Button
                title='Reset'
                disabled={!listName}
                sx={{ margin: '8px' }}
                size='small'
                color='secondary'
                onClick={() => setListName('')}
              >
                <ClearIcon />
              </Button>
              <Button
                title='Create'
                disabled={!listName}
                type='submit'
                sx={{ margin: '8px' }}
                size='small'
                color='primary'
              >
                <AddIcon />
              </Button>
            </ButtonGroup>
          ),
        }}
      />
    </form>
  );
};
