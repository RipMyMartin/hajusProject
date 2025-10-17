const express = require('express');
const app = express();
const port = 5001;

const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const swaggerDocument = YAML.load('./docs/swagger.yaml');

const mongoose = require('mongoose');
const Game = require('./models/game');

require('dotenv').config();
const uri = process.env.MONGODB_URI;

app.use(express.json());
app.use(express.static('public'));

mongoose.connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log("Error connecting to MongoDB:", err));

app.get('/games', async (req, res) => {
    try {
        const games = await Game.find();
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/games', async (req, res) => {
    try {
        const lastGame = await Game.findOne().sort({ id: -1 });
        const newId = lastGame ? lastGame.id + 1 : 1;

        const game = new Game({
            id: newId,
            name: req.body.name,
            price: req.body.price
        });

        const newGame = await game.save();
        res.status(201).json(newGame);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/games/:id', async (req, res) => {
    try {
        const game = await Game.findOne({ id: req.params.id });
        if (!game) return res.status(404).json({ message: 'Game not found' });

        game.name = req.body.name || game.name;
        game.price = req.body.price || game.price;

        const updatedGame = await game.save();
        res.json(updatedGame);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/games/:id', async (req, res) => {
    try {
        const game = await Game.findOne({ id: req.params.id });
        if (!game) return res.status(404).json({ message: 'Game not found' });

        await game.deleteOne();
        res.json({ message: 'Game deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/games/:id', async (req, res) => {
    try {
        const game = await Game.findOne({ id: req.params.id });
        if (!game) return res.status(404).json({ message: 'Game not found' });
        res.json(game);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});