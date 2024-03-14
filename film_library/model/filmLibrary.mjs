/** FilmLibrary class */
export class FilmLibrary {

    /*-----------CONSTRUCTOR-----------*/
    /**
     * FilmLibrary constructor
     */
    constructor() {
        this.films = [];
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

    getRated() {
        const ratedFilms = this.films.filter(film => film.rating !== null); //Get film that has a rating

        ratedFilms.sort((a, b) => b.rating - a.rating); //Order decreasing score
        return ratedFilms;
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
}