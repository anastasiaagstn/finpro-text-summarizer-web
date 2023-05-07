import { useState } from 'react';
import TextArea from "./components/TextAreaComponent.jsx";
import { Stack, Typography } from '@mui/material';

function App() {
  const [isLoading, setIsLoading] = useState(0);

  return (
    <Stack className="App">
      <Stack my={1}>
        <Typography variant='h4'>Base React Project</Typography>
        <Typography variant='h5'>Extractive Text Summarizer</Typography>
      </Stack>
      <TextArea setIsLoading={setIsLoading}/>
      {isLoading ?
        <Stack>
          <Typography>Loading...</Typography>
        </Stack>
        : null }
    </Stack>
  )
}

export default App;