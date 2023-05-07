import { useState } from 'react';
import axios from 'axios';
import { Button, Stack, TextField, Typography } from '@mui/material';

const TextAreaComponent = ({ setIsLoading }) => {
  const [textAreaValue, setTextAreaValue] = useState('');
  const [responseValue, setResponseValue] = useState('');

  const handleTextAreaChange = (event) => {
    setTextAreaValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setResponseValue("");

    try {
      const response = await axios.post('http://localhost:3000/test-api', { textDocument: textAreaValue });
      let data = response.data
      setResponseValue(data.summary);
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack display="flex" spacing={2} direction={'row'} pb={1}>
        <Stack display="block" direction={'column'}>
          <Typography htmlFor="myTextArea">Type your content:</Typography><br />
          <TextField
            sx={{ width: 400 }}
            id="myTextArea"
            label="Story"
            multiline
            rows={10}
            value={textAreaValue}
            onChange={handleTextAreaChange}
          />
        </Stack>
        <Stack display="block" direction={'column'}>
          <Typography htmlFor="responseTextArea">Response:</Typography><br />
          <TextField
            sx={{ width: 400 }}
            id="responseTextArea"
            label="Response"
            multiline
            rows={10}
            value={responseValue}
            readOnly
          />
        </Stack>
      </Stack>
      <Stack display="block" my={1}>
        <Button type="submit" variant="contained">Submit</Button>
      </Stack>
    </form>
  );
};

export default TextAreaComponent;