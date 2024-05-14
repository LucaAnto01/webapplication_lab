import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
/**---COMPONENT--- */
import NavigationBar from './components/NavigationBar.jsx';
import Filters from './components/Filters.jsx';
import FilmArea from './components/FilmArea.jsx';
import FilmForm from './components/FilmForm.jsx';
/**---DATA--- */
import FILMS from './data/films.js';
import FILTERS from './data/filters.js';

function App() {

  /**-----STATES----- */
  const [filmList, setFilmList] = useState(FILMS); //List with all films
  const [activeFilter, setActiveFilter] = useState('filter-all'); //Default all-filter is the active-one
  const [filmToEdit, setFilmToEdit] = useState(undefined); //Default: no film to edit
  const [showForm, setShowForm] = useState(false); //Default form NOT visible

  const filterArray = Object.entries(FILTERS).map(([filterName, { label }]) => ({ filterName: filterName, text: label })); //Map the filter to array for the Filter component

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
    <Container fluid>
      <Row>
        <Col>
          <NavigationBar></NavigationBar>
        </Col>
      </Row>  
      <Row>
        <Col xs={3}>
          <Filters items={filterArray} selected={activeFilter} onSelect={setActiveFilter}></Filters>
        </Col>
        
        <Col xs={9}>
          <div className="d-flex flex-row justify-content-between">
            <h2><span>{FILTERS[activeFilter].label}</span></h2>
            {showForm ? null : <Button variant="primary" className="my-1" onClick={() => setShowForm(true)}><i class="bi bi-plus"></i></Button>}
          </div>
          <FilmArea activeFilter={FILTERS[activeFilter].label}
            films={filmList.filter(FILTERS[activeFilter].filterFunction)}
            delete={deleteFilm} setFilmToEdit={setFilmToEdit} setShowForm={setShowForm}></FilmArea>
            {showForm? <FilmForm key={filmToEdit ? filmToEdit.id : -1}
            addFilm={(film)=>{addFilm(film); setShowForm(false)}} 
            editFilm={(film)=>{editFilm(film); setShowForm(false)}}
            cancel={()=>setShowForm(false)} 
            filmToEdit={filmToEdit} /> : null}
        </Col>
      </Row>
      
    </Container>
  );
}

export default App
