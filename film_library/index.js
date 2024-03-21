/**Implement a simple application to track the films that a person wants to watch and the ones they have already watched */

import { Film } from "./model/film.mjs";
import { FilmLibrary } from "./model/filmLibrary.mjs";

//Films
const inception = new Film(1, "Inception", true);
const darkKnight = new Film(2, "The Dark Knight");
const pulpFiction = new Film(3, "Pulp Fiction", false, '2024-01-15', 5);
const shrek = new Film(4, "Shrek", false, "2023-01-21", 3);
const starWars = new Film(5, "Star Wars");

//Film Library
const filmLibrary = new FilmLibrary();

/**
 * Function to perform test with script
 */
function scriptTest(){
    //Adding films to library
    filmLibrary.addNewFilm(inception);
    filmLibrary.addNewFilm(darkKnight);
    filmLibrary.addNewFilm(pulpFiction);
    filmLibrary.addNewFilm(shrek);
    filmLibrary.addNewFilm(starWars);

    //Print library
    console.log(filmLibrary.toString());

    //Print sorted films
    console.log("Film sorted in ascending order");
    filmLibrary.sortByDate().forEach(film => {
        console.log(film.toString());
    });

    //Remove film
    console.log("Remove film from library: ");
    filmLibrary.deleteFilm(2);
    console.log(filmLibrary.toString());

    //Get just rated films
    console.log("Films filtered, only the rated ones");
    filmLibrary.getRated().forEach(film => {
        console.log(film.toString());
    });

    //Reset whatched films
    console.log("Reset whatched films");
    filmLibrary.resetWatchedFilms();
    console.log(filmLibrary.toString());
}

/**
 * Function to perform db test
 */
function dbTest(){
    //Print all the films from db
    console.log("All films obtained from db");
    console.log(filmLibrary.getAll().then(films => {
                        films.forEach(film => {
                            console.log(film.toString());
                        });
                    })
                    .catch(error => {
                        console.error(error);
                    }));

    //Print all the favorites films from db
    console.log("All favorite films obtained from db");
    console.log(filmLibrary.getAllFavorites().then(films => {
                        films.forEach(film => {
                            console.log(film.toString());
                        });
                    })
                    .catch(error => {
                        console.error(error);
                    }));

    //Print all films watched today present in the database
    console.log("All films watched today present in the db");
    console.log(filmLibrary.getAllWatchedToday().then(films => {
                        films.forEach(film => {
                            console.log(film.toString());
                        });
                    })
                    .catch(error => {
                        console.error(error);
                    }));


    //Print all films with a watch date is earlier than a given date
    console.log("All films with a watch date is earlier than a given date from db");
    console.log(filmLibrary.getAllEarlierThanDate('2024-03-20').then(films => {
                        films.forEach(film => {
                            console.log(film.toString());
                        });
                    })
                    .catch(error => {
                        console.error(error);
                    }));

    //Print all films with a rating is greater than or equal to a given number          
    console.log("All films with a rating is greater than or equal to a given number from db");
    console.log(filmLibrary.getAllWithMinRating(5).then(films => {
                        films.forEach(film => {
                            console.log(film.toString());
                        });
                    })
                    .catch(error => {
                        console.error(error);
                    }));          

    //Print all films with certain title   
    console.log("All films with certain title from db");
    console.log(filmLibrary.getAllWithTitleContaining('pulp').then(films => {
                        films.forEach(film => {
                            console.log(film.toString());
                        });
                    })
                    .catch(error => {
                        console.error(error);
                    }));                      

    //Add a new film in db
    console.log("Adding new film in db...");
    const newFilm = new Film(0, 'Transformers', true, '2024-01-15', 5);
    const uid = 1;
    filmLibrary.storeNewFilm(newFilm, uid)
        .then(message => {
            console.log(message);
        })
        .catch(error => {
            console.error(error);
        }); 

    //Delete a film in db
    console.log("Delete film in db...");
    const filmIdToDelete = 6; 
    filmLibrary.deleteFilmById(filmIdToDelete)
        .then(message => {
            console.log(message);
        })
        .catch(error => {
            console.error(error);
        });

    //Clean all watch dates from db    
    console.log("Cleaning watch date in db...");
    filmLibrary.deleteAllWatchDates()
        .then(message => {
            console.log(message);
        })
        .catch(error => {
            console.error(error);
        });
}