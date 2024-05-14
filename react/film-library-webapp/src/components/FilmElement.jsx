import 'dayjs';
import { Form, Button } from 'react-bootstrap';

function FilmElement(props){
    //Format date
    const formatWatchDate = (dayJsDate, format) => {
        return dayJsDate ? dayJsDate.format(format) : '';
    }

    return(
        <tr>
            <td><p className={props.filmData.favorite ? "favorite" : ""} >{props.filmData.title}</p></td>
            <td className="text-center"><Form.Check type="checkbox" checked={props.filmData.favorite ? true : false} readOnly /></td>
            <td><small>{formatWatchDate(props.filmData.watchDate, 'MMMM D, YYYY')}</small></td>
            <td><Rating rating={props.filmData.rating} maxStars={5} /></td>
            <td>
                <Button variant='danger' onClick={() => { props.delete(props.filmData.id) }} ><i className='bi bi-trash'></i></Button>
                <Button className="mx-2" variant='warning' onClick={() => { props.setFilmToEdit(props.filmData); props.setShowForm(true); }} ><i className='bi bi-pencil'></i></Button>
            </td>
        </tr>
    );
}

function Rating(props) {
    return [...Array(props.maxStars)].map((el, index) =>
      <i key={index} className={(index < props.rating) ? "bi bi-star-fill" : "bi bi-star"} />
    )
}

export default FilmElement;