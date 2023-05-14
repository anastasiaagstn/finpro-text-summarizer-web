import {Stack, Typography } from '@mui/material';

const AccuracyComponent = ({ accuracy }) => {
  let precision = accuracy.Precision;
  let recall = accuracy.Recall;
  let f1 = accuracy.F1Score;

  return (
    <Stack>
      <Typography>Precision: {precision}</Typography>
      <Typography>Recall: {recall}</Typography>
      <Typography>F1 Score: {f1}</Typography>
    </Stack>
  );
};

export default AccuracyComponent;