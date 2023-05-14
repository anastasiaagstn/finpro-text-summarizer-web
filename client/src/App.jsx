import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import AccuracyComponent from "./components/AccuracyComponent.jsx";
import TextArea from "./components/TextAreaComponent.jsx";

function App() {
  const [isLoading, setIsLoading] = useState(0);
  const [accuracy, setAccuracy] = useState({});

  return (
    <Stack className="App">
      <Stack my={1}>
        <Typography variant='h4'>Base React Project</Typography>
        <Typography variant='h5'>Extractive Text Summarizer</Typography>
      </Stack>
      <TextArea setIsLoading={setIsLoading} setAccuracy={setAccuracy} />
      <AccuracyComponent accuracy={accuracy} />
      {isLoading ?
        <Stack>
          <Typography>Loading...</Typography>
        </Stack>
        : null }
    </Stack>
  )
}

export default App;