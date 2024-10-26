const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;

app.use(cors());
app.get('/', (req, res) => {
    res.json({ message: 'Hello from Express!' });
//   res.send('Hello from Express!');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});