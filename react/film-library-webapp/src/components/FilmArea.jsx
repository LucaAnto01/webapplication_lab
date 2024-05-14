import { Table } from "react-bootstrap";
import FilmElement from './FilmElement.jsx';

function FilmArea(props){
    const {films} = props;
    
    return(
        <Table responsive>
            <thead>
                <tr>
                    <td>Title</td>
                    <td className="text-center">Favorite</td>
                    <td>Last seen</td>
                    <td>Rating</td>
                    <td>Actions</td>
                </tr>
            </thead>     
            <tbody>
            {films.map((film) => <FilmElement filmData={film} key={film.id} delete={props.delete} setFilmToEdit={props.setFilmToEdit} setShowForm={props.setShowForm} />)}
            </tbody>
        </Table>
    );
}

export default FilmArea;