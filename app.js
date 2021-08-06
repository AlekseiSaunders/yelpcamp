const express = require('express');
const app = express();

app.get('/', (req, res, next) => {
    res.send('Starting yelpcamp')
})

app.listen(3000, () => {
  console.log('Serving on Port 3000');
});
