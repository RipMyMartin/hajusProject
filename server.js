const express = require('express');
const app = express();
const port = 5001;

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/games', (req, res) => {
    res.send(["Witcher 3", "Cyberpunk 2077"]);
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});