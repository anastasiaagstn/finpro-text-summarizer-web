import { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import Accuracy from "./components/Accuracy.jsx";
import TextArea from "./components/TextArea.jsx";
import "./styles.css";

function App() {
  const [isLoading, setIsLoading] = useState(0);
  const [accuracy, setAccuracy] = useState({
    Precision: 0,
    Recall: 0,
    F1Score: 0
  });

  return (
    <Stack className="App" justifyContent="center" alignItems="center">
      <Stack mb={2} alignItems="center">
        <Typography variant='h4'>Final Project:</Typography>
        <Typography variant='h5'>Extractive Text Summarizer</Typography>
      </Stack>
      <TextArea setIsLoading={setIsLoading} setAccuracy={setAccuracy} />
      <Accuracy accuracy={accuracy} />
      {isLoading ?
        <Stack>
          <Typography>Loading...</Typography>
        </Stack>
        : null }
    </Stack>
  )
}

export default App;
