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
console.log("Films filtered, only the rated ones *****");
filmLibrary.getRated().forEach(film => {
    console.log(film.toString());
});

//Reset whatched films
console.log("Reset whatched films");
filmLibrary.resetWatchedFilms();
console.log(filmLibrary.toString());