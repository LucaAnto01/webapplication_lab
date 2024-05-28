import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import { Container } from 'react-bootstrap';
/**---COMPONENT--- */
import ErrorPage from './components/error/ErrorPage.jsx';
import {BaseLayout, FilmAreaLayout, AddFilmLayout, EditFilmLayout} from './components/layout/Layout.jsx';
/**---DATA--- */
import FILMS from './data/films.js';
import FILTERS from './data/filters.js';

function App() {

  /**-----STATES----- */
  const [filmList, setFilmList] = useState(FILMS); //List with all films

  //const filterArray = Object.entries(FILTERS).map(([filterName, { label }]) => ({ filterName: filterName, text: label })); //Map the filter to array for the Filter component
  const filterArray = Object.entries(FILTERS).map(([filterName, obj ]) => ({ filterName: filterName, ...obj }));      

  /**-----FUNCTIONS-----*/
  /**
   * Function to add a new film
   * @param {Film} film 
   */
  function addFilm(film) {
    setFilmList( (films) => {
        const newFilmId = Math.max( ...(films.map(e => e.id)))+1;
        return [...films, {"id": newFilmId, ...film}];
      });
  }

  /**
   * Function to delete a film
   * @param {Film} film 
   */
  function editFilm(film) {
    setFilmList( (films) => films.map( e=> {
      if (e.id === film.id)
        return Object.assign({}, film);
      else
        return e;
    }))
  }

  /**
   * Function to delete a film
   * @param {Film} filmId 
   */
  function deleteFilm(filmId) {
    setFilmList(filmList => filmList.filter(e => e.id!==filmId));
  }

  return(
    <BrowserRouter>
      <Container fluid>
        <Routes>
          <Route path='/' element={<BaseLayout filterArray={filterArray} />}>
            <Route index element={<FilmAreaLayout filmList={filmList} filters={FILTERS} deleteFilm={deleteFilm} editFilm={editFilm} />}></Route>
            <Route path="add" element={<AddFilmLayout addFilm={addFilm} />} />
            <Route path="edit/:filmId" element={<EditFilmLayout films={filmList} editFilm={editFilm} />} />
            <Route path="filter/:filterId" element={<FilmAreaLayout 
                 filmList={filmList} filters={FILTERS} deleteFilm={deleteFilm} editFilm={editFilm} />} />
            <Route path='*' element={<ErrorPage />} />
          </Route>
        </Routes>
      </Container>
    </BrowserRouter>
  );
} 

export default App;