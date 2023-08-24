import app from './app';

const port = parseInt(process.env.PORT || '5000', 10);
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
