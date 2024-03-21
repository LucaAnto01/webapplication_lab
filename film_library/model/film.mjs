import dayjs from 'dayjs';

/**Film class */
export class Film {

    /*-----------CONSTRUCTOR-----------*/
    /**
     * Film constructor
     * @param {number} id 
     * @param {string} title 
     * @param {boolean} isFavorite 
     * @param {dayjs} watchDate 
     * @param {number} rating 
     */
    constructor(id, title, isFavorite = false, watchDate = null, rating = null) {
        this.id = id;
        this.title = title;
        this.isFavorite = isFavorite;
        this.watchDate = watchDate ? dayjs(watchDate) : null;;
        this.rating = rating;        
    }

    /*-----------GETTERS & SETTERS-----------*/
    setId(id) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    setTitle(title) {
        this.title = title;
    }

    getTitle() {
        return this.title;
    }

    setIsFavorite(isFavorite) {
        this.isFavorite = isFavorite;
    }

    getIsFavorite() {
        return this.isFavorite;
    }
    
    setWatchDate(date) {
        this.watchDate = dayjs(date);
    }

    getWatchDate() {
        return this.watchDate;
    }

    getFormattedWatchDate() {
        return this.watchDate ? this.watchDate.format('MMMM D, YYYY') : null;
    }

    setRating(rating) {
        this.rating = (rating > 0 && rating <= 5) ? rating : null;
    }

    getRating() {
        return this.rating;
    }

    /*-----------METHODS-----------*/
    /**
     * toString() method of Film class
     * @returns string
     */
    toString() {
        let result = `Film ID: ${this.id}, Title: ${this.title}, Favorite: ${this.isFavorite ? 'Yes' : 'No'}`;
        if (this.watchDate)
            result += `, Watch Date: ${this.getFormattedWatchDate()}`;

        if (this.rating) 
            result += `, Rating: ${this.rating}`;

        return result;
    }
}