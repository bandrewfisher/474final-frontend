import React, { ReactElement, useState, useMemo } from 'react';
import { DataGrid, Columns } from '@material-ui/data-grid';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Canvas from './Canvas';
import characters from './characters';

const columns: Columns = [
  {
    field: 'Character',
    width: 130,
  },
  {
    field: 'Pinyin',
    width: 130,
  },
  {
    field: 'Definition',
    width: 400,
  },
  {
    field: 'Frequency',
    width: 130,
    type: 'number',
  },
];

function App(): ReactElement {
  const [filter, setFilter] = useState('');

  const tableCharacters = useMemo(
    () =>
      characters.filter(
        c =>
          c.Character === filter ||
          c.Definition.toLowerCase().includes(filter.toLowerCase()) ||
          c.Pinyin.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .includes(
              filter
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
            ) ||
          String(c.Frequency).includes(filter)
      ),
    [filter]
  );
  return (
    <>
      <div className="flex flex-col items-center w-full mt-32">
        <Canvas className="mb-2" />
        <p className="my-3 px-44 text-center">
          The model recognizes the 300 most frequently occurring Chinese
          characters. You can search the following table to see which characters
          are recognized.
        </p>
      </div>

      <div className="w-full px-44 pb-10">
        <Box mb={3}>
          <TextField
            label="Filter"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </Box>
        <Box mb={3}>
          <DataGrid
            rows={tableCharacters.map((r, i) => ({ id: i, ...r }))}
            columns={columns}
            pageSize={20}
            autoHeight
            columnBuffer={5}
          />
        </Box>
      </div>
    </>
  );
}
export default App;
