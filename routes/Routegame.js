// routes/games.js
const express = require('express');
const router = express.Router();
const Game = require('../database/modles/game.js');

router.post('/', async (req, res) => {
    try {
        const game = new Game(req.body);
        await game.save();
        res.status(201).send(game);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/', async (req, res) => {
    try {
        const games = await Game.find();
        res.send(games);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).send();
        }
        res.send(game);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!game) {
            return res.status(404).send();
        }
        res.send(game);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const game = await Game.findByIdAndDelete(req.params.id);
        if (!game) {
            return res.status(404).send();
        }
        res.send(game);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;