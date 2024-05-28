import { ListGroup } from "react-bootstrap";
import { NavLink } from 'react-router-dom';

/**
 * Filter menu
 * @param {*} props 
 * @returns 
 */
function Filters(props){
    const { filterArray } = props;
    return(
        <ListGroup as="ul" className="mt-1">
            {
                filterArray.map( element => {
                    return(
                        <NavLink className="list-group-item" key={element.url} to={`${element.url}`} >
                            {element.label}
                        </NavLink>
                    );
                })
            }
        </ListGroup>
    );
}

export default Filters;