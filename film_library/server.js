import express from 'express';
import bodyParser from 'body-parser';
import { check, validationResult } from 'express-validator'; //Validator
import { Film } from './model/film.mjs';
import { FilmLibrary } from './model/filmLibrary.mjs';

const filmLibrary = new FilmLibrary();

//Initialize Express app
const app = express();
const port = 3000;
const maxLenght = 150;
app.use(bodyParser.json()); //Middleware for manage JSON body

//Format the error from the validator
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return `${location}[${param}]: ${msg}`;
  };

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

//Get films based on filters
app.get('/filteredFilms', 
    [ check('filter').isLength({min: 1, max: maxLenght}) ],
    async (req, res) => {
        //Check error
        const errors = validationResult(req).formatWith(errorFormatter);
        if (!errors.isEmpty())
            return res.status(422).json( errors.errors );
        try {
            const { filter } = req.query;
            let films;

            //Select the filter
            switch (filter) { 
                case 'favorite':
                    films = await filmLibrary.getAllFavorites();
                    break;
                case 'best':
                    films = await filmLibrary.getBestRated();
                    break;
                case 'lastmonth':
                    films = await filmLibrary.getFilmsWatchedLastMonth();
                    break;
                case 'unseen':
                    films = await filmLibrary.getUnseenFilms();
                    break;
                default:
                    films = await filmLibrary.getAll();
                    break;
            }

            res.json(films);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to retrieve films.' });
        }
});

//Get film by its ID
app.get('/films/:id', 
    [ check('id').isInt({min: 1}) ], //Validator
    async (req, res) => {
        //Check error
        const errors = validationResult(req).formatWith(errorFormatter);
        if (!errors.isEmpty())
            return res.status(422).json( errors.errors );

        const filmId = parseInt(req.params.id);
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
app.post('/addFilm', 
    [
        check('title').isLength({min: 1, max: maxLenght}),
        check('isFavorite').isBoolean(),
        check('watchDate').isLength({min: 10, max: 10}).isISO8601({strict: true}).optional({checkFalsy: true}),
        check('rating').isInt({min: 1, max: 5})
    ], 
    async (req, res) => {
        //Check error
        const errors = validationResult(req).formatWith(errorFormatter);
        if (!errors.isEmpty())
            return res.status(422).json( errors.errors );

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
app.put('/updateFav/:id/favorite', 
    [
        check('id').isInt({min: 1}),
        check('isFavorite').isBoolean()
    ],
    async (req, res) => {
        //Check error
        const errors = validationResult(req).formatWith(errorFormatter);
        if (!errors.isEmpty())
            return res.status(422).json( errors.errors );

        const filmId = parseInt(req.params.id);
        const { isFavorite } = req.body;
        try {
            await filmLibrary.updateFavStatus(filmId, isFavorite);
            res.json({ message: 'Favorite status updated successfully.' });
        } 
        catch (error) {
            res.status(500).json({ error: 'Failed to update favorite status.' });
        }
});

//Update rating of film
app.put('/updateRating/:id/rating', 
    [
        check('id').isInt({min: 1}),
        check('rating').isInt({min: 1, max: 5})
    ],
    async (req, res) => {
        //Check error
        const errors = validationResult(req).formatWith(errorFormatter);
        if (!errors.isEmpty())
            return res.status(422).json( errors.errors );

        const filmId = parseInt(req.params.id);
        const { rating } = req.body;

        try {
            await filmLibrary.updateRating(filmId, rating);
            res.json({ message: 'Rating updated successfully.' });
        } 
        catch (error) {
            res.status(500).json({ error: 'Failed to update rating.' });
        }
});

//Update an existing film
app.put('/updateFilm/:id', 
    [ check('id').isInt({min: 1}) ],
    async (req, res) => {
        //Check error
        const errors = validationResult(req).formatWith(errorFormatter);
        if (!errors.isEmpty())
            return res.status(422).json( errors.errors );

        const filmId = parseInt(req.params.id);
        try {
            //Get updated properties from the request body
            const updatedProperties = req.body;        
            const message = await filmLibrary.updateFilm(filmId, updatedProperties);

            res.json({ message });
        } 
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to update film.' });
        }
});

//Delete a film by its ID
app.delete('/deleteFilm/:id', 
    [ check('id').isInt({min: 1}) ],
    async (req, res) => {
        //Check error
        const errors = validationResult(req).formatWith(errorFormatter);
        if (!errors.isEmpty())
            return res.status(422).json( errors.errors );

        const filmId = parseInt(req.params.id);
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