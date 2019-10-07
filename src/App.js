import React, { useState, useEffect } from 'react';
import './App.css';
import _ from 'lodash';
import axios from 'axios';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Alert from 'react-bootstrap/Alert'

const INTERVAL = 20000;
const NONE = 'none';
const ASC = 'asc';
const DESC = 'desc';

function App() {
    const [flights, setFlights] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [order, setOrder] = useState(NONE);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchFlights = async () => {
            setIsError(false);
            setIsLoading(true);

            try {
                const result = await axios(
                    'https://opensky-network.org/api/states/all',
                );

                setFlights(_.filter(result.data.states, flight => flight[2] === 'Poland'));
            } catch (error) {
                setIsError(true);
            }

            setIsLoading(false);
        };

        fetchFlights();

        const id = setInterval(fetchFlights, INTERVAL);

        return () => clearInterval(id);
    }, []);

    const orderFlights = (flights) => {
        switch (order) {
            case DESC:
                return _.reverse(_.sortBy(flights, ['0']));
            case ASC:
                return _.sortBy(flights, ['0']);
            case NONE:
            default:
                return flights;
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Fligths</h1>
            </header>
            <ToggleButtonGroup type="radio" name={order} onChange={setOrder}>
                <ToggleButton value={ASC}>Ascending</ToggleButton>
                <ToggleButton value={DESC}>Descending</ToggleButton>
                <ToggleButton value={NONE}>None</ToggleButton>
            </ToggleButtonGroup>
            <main className="App-main">
                {isError
                    ? <Alert variant="danger" style={{margin: 20 + 'px'}}>
                        There was error while fetching data.
                    </Alert>
                    : _.isEmpty(flights) && isLoading
                        ? <div>Loading ...</div>
                        : <div className="App-flights">
                            {_.map(_.take(orderFlights(flights), 50), (flight, id) => (
                                <div className="App-flight" key={id}>
                                    {flight[0]}
                                </div>
                            ))}
                        </div>
                }
            </main>
        </div>
    );
}

export default App;
