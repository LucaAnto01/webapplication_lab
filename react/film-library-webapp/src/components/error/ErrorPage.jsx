import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
function ErrorPage(props){
    return (
        <>
            <div id="error-page">
                <h1>Oops!</h1>
                <p>Page not found.</p>
                <Link to="/">
                    <Button variant="primary">Go back to the main page!</Button>
                </Link>
            </div>
        </>
    );
}

export default ErrorPage;