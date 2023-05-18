import { useState } from 'react';
import axios from 'axios';
import { Button, Stack, TextField, Typography } from '@mui/material';

const TextAreaComponent = ({ setIsLoading, setAccuracy }) => {
  const [inputValue, setInputValue] = useState('');
  const [responseValue, setResponseValue] = useState('');

  const handleTextAreaChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (inputValue === "") {
      return
    }

    setIsLoading(true);
    setResponseValue("");

    try {
      const response = await axios.post('http://localhost:3000/summarize', { textDocument: inputValue });
      let data = response.data
      setResponseValue(data.summary);
      setAccuracy(data.rouge);
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack display="flex" spacing={3} direction={'row'} pb={2} width={'100%'}>
        <Stack display="block" direction={'column'}>
          <Typography htmlFor="myTextArea" pb={1} className='label'>Type your content:</Typography>
          <TextField
            sx={{ width: 500 }}
            id="myTextArea"
            placeholder='Type your story'
            variant="filled"
            multiline
            rows={10}
            value={inputValue}
            onChange={handleTextAreaChange}
          />
        </Stack>
        <Stack display="block" direction={'column'}>
          <Typography htmlFor="responseTextArea" pb={1} className='label'>Summary:</Typography>
          <TextField
            sx={{ width: 500 }}
            id="responseTextArea"
            placeholder='Summary will appear here'
            variant="filled"
            multiline
            rows={10}
            value={responseValue}
            readOnly
          />
        </Stack>
      </Stack>
      <Stack display="flex" justifyContent="center" alignItems="center" py={1}>
        <Button type="submit" variant="contained">Submit</Button>
      </Stack>
    </form>
  );
};

export default TextAreaComponent;