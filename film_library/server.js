import express from 'express';
import bodyParser from 'body-parser';
import { Film } from './model/film.mjs';
import { FilmLibrary } from './model/filmLibrary.mjs';

const filmLibrary = new FilmLibrary();

//Initialize Express app
const app = express();
const port = 3000;
app.use(bodyParser.json()); //Middleware for manage JSON body

//Get all films
app.get('/films', async (req, res) => {
    try {
        const films = await filmLibrary.getAll();
        res.json(films);
    } 
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve films.' });
    }
});

//Get film by its ID
app.get('/films/:id', async (req, res) => {
    const filmId = parseInt(req.params.id);
    if (isNaN(filmId)) {
        res.status(400).json({ error: 'Invalid film ID.' });
        return;
    }

    try {
        const film = await filmLibrary.getFilmById(filmId);
        if (film) 
            res.json(film);
        else 
            res.status(404).json({ error: 'Film not found.' });
    } 
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve film.' });
    }
});

//Add a film
app.post('/addFilm', async (req, res) => {
    const { title, isFavorite, watchDate, rating } = req.body;
    if (!title) {
        res.status(400).json({ error: 'Title is required.' });
        return;
    }

    try {
        const newFilm = new Film(null, title, isFavorite, watchDate, rating);
        const result = await filmLibrary.storeNewFilm(newFilm, 1);
        res.status(201).json({ message: result });
    } 
    catch (error) {
        res.status(500).json({ error: 'Failed to create film.' });
    }
});

//Mark a film as favorite/unfavorite
app.patch('/updateFav/:id/favorite', async (req, res) => {
    const filmId = parseInt(req.params.id);
    const { isFavorite } = req.body;
    if (isNaN(filmId) || typeof isFavorite !== 'boolean') {
        res.status(400).json({ error: 'Invalid request.' });
        return;
    }

    try {
        await filmLibrary.updateFavStatus(filmId, isFavorite);
        res.json({ message: 'Favorite status updated successfully.' });
    } 
    catch (error) {
        res.status(500).json({ error: 'Failed to update favorite status.' });
    }
});

//Update rating of film
app.patch('/updateRating/:id/rating', async (req, res) => {
    const filmId = parseInt(req.params.id);
    const { rating } = req.body;
    if (isNaN(filmId) || typeof rating !== 'number') {
        res.status(400).json({ error: 'Invalid request.' });
        return;
    }

    try {
        await filmLibrary.updateRating(filmId, rating);
        res.json({ message: 'Rating updated successfully.' });
    } 
    catch (error) {
        res.status(500).json({ error: 'Failed to update rating.' });
    }
});

//Delete a film by its ID
app.delete('/deleteFilm/:id', async (req, res) => {
    const filmId = parseInt(req.params.id);
    if (isNaN(filmId)) {
        res.status(400).json({ error: 'Invalid film ID.' });
        return;
    }

    try {
        await filmLibrary.deleteFilmById(filmId);
        res.json({ message: 'Film deleted successfully.' });
    } 
    catch (error) {
        res.status(500).json({ error: 'Failed to delete film.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port:${port}`);
});