import {Stack, Typography } from '@mui/material';

const AccuracyComponent = ({ accuracy }) => {
  let precision = accuracy.Precision? accuracy.Precision: null;
  let recall = accuracy.Recall? accuracy.Recall : null;
  let f1 = accuracy.F1Score? accuracy.F1Score: null;

  return (
    <Stack display={'block'} width={'72%'}>
      <Typography className='label'>Precision: {precision}</Typography>
      <Typography className='label'>Recall: {recall}</Typography>
      <Typography className='label'>F1 Score: {f1}</Typography>
    </Stack>
  );
};

export default AccuracyComponent;