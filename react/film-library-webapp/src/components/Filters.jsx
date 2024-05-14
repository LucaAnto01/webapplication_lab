import { ListGroup } from "react-bootstrap";

/**
 * Filter menu
 * @param {*} props 
 * @returns 
 */
function Filters(props){
    const {items, selected, onSelect} = props;
    return(
        <ListGroup as="ul" className="mt-1">
            {
                items.map( element => {
                    return(
                        <ListGroup.Item as="li" key={element.filterName} active={selected === element.filterName ? true : false} action href="#" onClick={() => onSelect(element.filterName)}>
                            {element.text}
                        </ListGroup.Item>
                    );
                })
            }
        </ListGroup>
    );
}

export default Filters;