import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Row, Col, Button } from 'react-bootstrap';
import { Outlet, Link, useParams, Navigate } from 'react-router-dom';
import NavigationBar from '../NavigationBar.jsx';
import Filters from '../Filters.jsx';
import FilmArea from '../FilmArea.jsx';
import FilmForm from '../FilmForm.jsx';
import PersonalFooter from '../PersonalFooter.jsx';

/**
 * Layout for adding a film to the page
 * @param {*} props 
 * @returns 
 */
function AddFilmLayout(props){
    return(
        <FilmForm addFilm={props.addFilm} />
      );
}

/**
 * Layout for edit a film
 * @param {*} props 
 * @returns 
 */
function EditFilmLayout(props) {
    const { filmId } = useParams();
    const filmToEdit = props.films && props.films.find( f => f.id === parseInt(filmId) );
    
    return(
      <>
      {filmToEdit? 
        <FilmForm editFilm={props.editFilm} filmToEdit={filmToEdit} />
       : <Navigate to={"/add"} />}
      </>
    );
  }

/**
 * Main area of the page
 * @param {*} props 
 * @returns 
 */
function FilmAreaLayout(props){
    const { filterId } = useParams();
    const filterName = props.filters[filterId] ?  props.filters[filterId].label : 'All';

    const filteredFilms = (filterId in props.filters) ? props.filmList.filter(props.filters[filterId].filterFunction) : props.filmList;

    return(
        <>
        <div className="d-flex flex-row justify-content-between">
            <h1 className="my-2">Filter: <span>{filterName}</span></h1>
            <Link to={'/add'}>
                <Button variant="primary" className="my-2"><i className="bi bi-plus"></i></Button>
            </Link>
        </div>
        <FilmArea films={filteredFilms} delete={props.deleteFilm} editFilm={props.editFilm} />
        </>
    );
}

/**
 * Give the layout of the app
 * @param {*} props 
 * @returns 
 */
function BaseLayout(props){
    return(
        <>
        <Row>
            <Col>
                <NavigationBar></NavigationBar>
            </Col>
        </Row>  
        <Row>
            <Col xs={3}>
            <Filters filterArray={props.filterArray} />
            </Col>        
            <Col xs={9}>
            <Outlet /> {/* Place-holder for dynamic content */}
            </Col>
        </Row>      
        <Row>
            <Col>
            <PersonalFooter></PersonalFooter>
            </Col>
        </Row>      
        </>
    );
}

export {BaseLayout, FilmAreaLayout, AddFilmLayout, EditFilmLayout};