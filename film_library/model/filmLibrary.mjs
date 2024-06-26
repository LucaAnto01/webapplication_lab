import sqlite from "sqlite3"; //Import of SQL db
import dayjs from 'dayjs';
import { validationResult } from 'express-validator'; //Validator
import { Film } from "./film.mjs";

/** FilmLibrary class */
export class FilmLibrary {

    /*-----------CONSTRUCTOR-----------*/
    /**
     * FilmLibrary constructor
     */
    constructor() {
        this.db = new sqlite.Database('./db/films.db',
            (err) => { if (err) throw err; });
        console.log(this.db);
        this.films = [];
        //this.validator = expressValidator(); //Initialize the validator
    }

    /*-----------METHODS-----------*/
    /**
     * Method to add a new film to the library
     * @param {Film} film
     */
    addNewFilm(film) {
        this.films.push(film);
        console.log(`Film "${film.title}" added to the library.`);
    }

    /**
     * Sort the films in the library by watch date in ascending order
     * @returns film[] 
     */
    sortByDate() {
        const sortedFilms = this.films.slice().sort((a, b) => {
    
            if (a.watchDate && b.watchDate) //Both films have watch dates
                return a.watchDate.diff(b.watchDate);
                
            else if (a.watchDate && !b.watchDate)  //Only one film has a watch date
                return -1; //a before b

            else if (!a.watchDate && b.watchDate) 
                return 1; //b before a

            return 0; //Both films do NOT have watch dates --> original order
        });
        
        return sortedFilms;
    }

    /**
     * Delete film in according with its id
     * @param {number} id 
     */
    deleteFilm(id) {
        this.films = this.films.filter(film => film.id !== id); //Get film that has id != from id of film to delete
        console.log(`Film with ID ${id} deleted from the library.`);
    }

    /**
     * Delete the Watch date of all films
     */
    resetWatchedFilms() {
        this.films.forEach(film => {
            film.watchDate = null;
        });
    }

    /**
     * Get rated films
     * @returns films
     */
    getRated() {
        const ratedFilms = this.films.filter(film => film.rating !== null); //Get film that has a rating

        ratedFilms.sort((a, b) => b.rating - a.rating); //Order decreasing score
        return ratedFilms;
    }

    /**
     * Method to map rows into films
     * @param {Promise} rows 
     * @returns 
     */
    mapRowsToFilms(rows) {
        return rows.map(row => new Film(row.id, row.title, row.isFavorite === 1, dayjs(row.watchdate), row.rating));
    }

    /**
     * toString() method of filmLibrary class
     * @returns string
     */
    toString() {
        let output = "Film Library:\n";
        this.films.forEach(film => {
            output += `${film.toString()}\n`;
        });
        return output;
    }

    /**-----DB interactions-----*/
    /**
     * Method to execute a generic get query
     * @param {string} query 
     * @param {[string]} params 
     * @returns 
     */
    executeGetQuery(query, params){
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err) 
                    reject(err);
                else 
                    resolve(rows);
                //this.db.close();
            });
        });
    }

    /**
     * Method to execute a non query
     * @param {string} query 
     * @param {[string]} params 
     * @returns 
     */
    executeNonQuery(query, params){
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function(err) {
                if (err) 
                    reject(err);
                else 
                    resolve();
            });
        });
    }

    /**
     * Method to get all the Film(s) present in db
     * @returns Promise<[Film]>
     */
    async getAll(){
        try {
            const query = "SELECT * FROM films";                   
            const rows = await this.executeGetQuery(query, []);
            return this.mapRowsToFilms(rows);
        } 
        catch (error) {
            console.error(error);
            throw error;
        }        
    }

    /**
     * Method to get all the favorites Film(s) present in db
     * @returns Promise<[Film]>
     */
    async getAllFavorites(){
        try {
            const query = "SELECT * FROM films WHERE isFavorite = 1";                   
            const rows = await this.executeGetQuery(query, []);
            return this.mapRowsToFilms(rows);
        } 
        catch (error) {
            console.error(error);
            throw error;
        }
    }  

    /**
     * Method to get a Film from its id
     * @param {number} id 
     * @returns Promise<Film>
     */
    async getFilmById(id){
        const errors = validationResult({ params: { id } });
        if (!errors.isEmpty())
            throw new Error('Invalid ID'); // or handle the error appropriately
        
        try {
            const query = "SELECT * FROM films WHERE id = " + id;                   
            const rows = await this.executeGetQuery(query, []);
            return this.mapRowsToFilms(rows);
        } 
        catch (error) {
            console.error(error);
        }
    } 
    
    /**
     * Method to get all films watched today present in the database
     * @returns Promise<[Film]>
     */
    async getAllWatchedToday(){
        try {
            const today = dayjs().format('MMMM D, YYYY');
            const query = "SELECT * FROM films WHERE watchdate = ?";                   
            const rows = await this.executeGetQuery(query, [today]);
            return this.mapRowsToFilms(rows);
        } 
        catch (error) {
            console.error(error);
            throw error; 
        }
    }

    /**
     * Method to get films watched last month
     * @returns Promise<[Film]>
     */
    async getFilmsWatchedLastMonth() {
        try {
            const lastMonth = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
            const today = dayjs().format('YYYY-MM-DD');
            const query = "SELECT * FROM films WHERE watchDate BETWEEN ? AND ?";
            const rows = await this.executeGetQuery(query, [lastMonth, today]);
            return this.mapRowsToFilms(rows);
        } 
        catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * Method to get films without a watch date
     * @returns Promise<[Film]>
     */
    async getUnseenFilms() {
        try {
            const query = "SELECT * FROM films WHERE watchDate IS NULL";
            const rows = await this.executeGetQuery(query, []);
            return this.mapRowsToFilms(rows);
        } 
        catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * Method to get films with a watch date is earlier than a given date
     * @param {date} maxDate 
     * @returns Promise<[Film]>
     */
    async getAllEarlierThanDate(maxDate){
        try {
            const query = "SELECT * FROM films WHERE watchdate < ?";                   
            const rows = await this.executeGetQuery(query, [maxDate]);
            return this.mapRowsToFilms(rows);
        } 
        catch (error) {
            console.error(error);
            throw error; 
        }
    }

    /**
     * Method to get films with a rating is greater than or equal to a given number
     * @param {number} minRating 
     * @returns Promise<[Film]>
     */
    async getAllWithMinRating(minRating){
        try {
            const query = "SELECT * FROM films WHERE rating >= ?";                   
            const rows = await this.executeGetQuery(query, [minRating]);
            return this.mapRowsToFilms(rows);
        } 
        catch (error) {
            console.error(error);
            throw error; 
        }
    }

    /**
     * Method to get films with a rating is 5
     * @returns Promise<[Film]>
     */
    async getBestRated(){
        try {
            const query = "SELECT * FROM films WHERE rating = 5";                   
            const rows = await this.executeGetQuery(query, []);
            return this.mapRowsToFilms(rows);
        } 
        catch (error) {
            console.error(error);
            throw error; 
        }
    }

    /**
     * Method to get films with a certain title
     * @param {*} searchString 
     * @returns Promise<[Film]>
     */
    async getAllWithTitleContaining(searchString){
        try {       
            const query = "SELECT * FROM films WHERE title LIKE ?";                   
            const rows = await this.executeGetQuery(query, [`%${searchString}%`]);
            return this.mapRowsToFilms(rows);
        } 
        catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * Function to store a new film in db
     * @param {Film} film 
     * @param {number} uid 
     * @returns Promise<string>
     */
    async storeNewFilm(film, uid){
        try {
            const query = "INSERT INTO films (userId, title, isFavorite, watchdate, rating) VALUES (?, ?, ?, ?, ?)";
            await this.executeNonQuery(query, [uid, film.title, film.isFavorite ? 1 : 0, film.watchDate ? film.watchDate.format('YYYY-MM-DD') : null, film.rating]);
            return 'Film successfully stored in the database.';
        } 
        catch (error) {
            console.error(error);
            throw 'Failed to store film in the database.';
        }
    }

    /**
     * Method to delete a film from db starting from its id
     * @param {number} filmId 
     * @returns Promise<string>
     */
    async deleteFilmById(filmId){
        try {
            const query = "DELETE FROM films WHERE id = ?";
            await this.executeNonQuery(query, [filmId]);
            return 'Film successfully deleted from the database.';
        } 
        catch (error) {
            console.error(error);
            throw 'Failed to delete film from the database.';
        }
    }
    
    /**
     * Method to delete all watches date of films
     * @returns Promise<string>
     */
    async deleteAllWatchDates(){
        try {
            const query = "UPDATE films SET watchdate = NULL";
            await this.executeNonQuery(query, []);
            return 'Watch dates of all films successfully deleted from the database.';
        } 
        catch (error) {
            console.error(error);
            throw 'Failed to delete watch dates of all films from the database.';
        }
    }

    /**
     * Method to update the favorite status of a film
     * @param {number} id 
     * @param {boolean} isFav 
     * @returns Promise<string>
     */
    async updateFavStatus(id, isFav){
        try {
            const query = "UPDATE films SET isFavorite = " + (isFav ? 1 : 0) + " WHERE id = " + id;
            await this.executeNonQuery(query, []);
            return 'Update favorite status of film successfully.';
        } 
        catch (error) {
            console.error(error);
            throw 'Failed to delete watch dates of all films from the database.';
        }
    }

    /**
     * Method to update the rating of a film
     * @param {number} id 
     * @param {number} rating 
     * @returns Promise<string>
     */
    async updateRating(id, rating){
        try {
            const query = "UPDATE films SET rating = " + rating + " WHERE id = " + id;
            await this.executeNonQuery(query, []);
            return 'Update rating of film successfully.';
        } 
        catch (error) {
            console.error(error);
            throw 'Failed to delete watch dates of all films from the database.';
        }
    }

    /**
     * Update an existing film in the library
     * @param {number} id 
     * @param {object} updatedProperties
     * @returns Promise<string>
     */
    async updateFilm(id, updatedProperties) {
        try {
            //TODO: ADD VALIDATOR
            //Get the existing film from the database
            const existingFilm = await this.getFilmById(id);
            if (!existingFilm)
                throw new Error('Film not found.');        

            //Update the existing film with the provided properties
            for (const property in updatedProperties)
                if (updatedProperties.hasOwnProperty(property))
                    existingFilm[property] = updatedProperties[property];

            //Update the selected film
            const query = "UPDATE films SET title = ?, isFavorite = ?, watchdate = ?, rating = ? WHERE id = ?";
            const params = [
                existingFilm.title,
                existingFilm.isFavorite ? 1 : 0,
                existingFilm.watchDate ? dayjs(existingFilm.watchDate) : null,
                existingFilm.rating,
                id
            ];

            await this.executeNonQuery(query, params);

            return 'Film updated successfully.';
        } 
        catch (error) {
            console.error(error);
            throw 'Failed to update film.';
        }
    }
}