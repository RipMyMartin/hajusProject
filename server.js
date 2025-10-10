const express = require('express');
const app = express();
const port = 5001;

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.load('./docs/swagger.yaml');

app.use(express.json());

const games = [
    { id: 1, name: "Witcher 3", price: 19.99 },
    { id: 2, name: "Cyberpunk 2077", price: 29.99 },
    { id: 3, name: "Minecraft", price: 24.99 },
    { id: 4, name: "Counter-Strike: Global Offensive", price: 14.99 },
    { id: 5, name: "Roblox", price: 9.99 },
    { id: 6, name: "Grand Theft Auto V", price: 29.99 },
    { id: 7, name: "Valorant", price: 19.99 },
    { id: 8, name: "Forza Horizon 5", price: 59.99 },
]

app.get('/games', (req, res) => {
    if (!req.query.name || req.query.price) {
        return res.status(400).send({ error: "One or more query parameters are missing" });
    }
    let game = {
        id: games.length + 1,
        name: req.query.name,
        price: req.query.price
    };
    games.push(game);
    res.status(201).location(`${getBaseUrl(req)}/games/${game.length}`)
        .send(game);
});

app.post('/games', (req, res) => {
    games.push({
        id: games.length + 1,
        name: req.query.name,
        price: req.query.price
    });
    res.end();
});

app.delete('/games/:id', (req, res) => {
    if (typeof games[req.params.id - 1] === 'undefined') {
        res.status(404).send({ error: "Game not found" });
        return;
    }
    games.splice(req.params.id - 1, 1);
    res.status(204).send({ error: "No content" });
});

function getBaseUrl(req) {
    return req.connection && req.connection.encrypted ?
        'https://' : 'http://' + req.headers.host;
}

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/games/:id', (req, res) => {
    if (typeof games[req.params.id - 1] === 'undefined') {
        res.status(404).send({ error: "Game not found" });
        return;
    }
    res.send(games[req.params.id - 1]);
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});