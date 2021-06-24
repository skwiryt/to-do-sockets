const express = require('express');

const app = express();

app.use((req, res) => {
  res.status(404).send('Not found');
});

const server = app.listen(8000, () => console.log('Server started on port 8000'));