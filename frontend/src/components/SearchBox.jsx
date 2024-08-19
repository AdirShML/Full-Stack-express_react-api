import React, { useState } from 'react';
import '../styles/SearchBoxstyle.css';
import '../styles/ResultsBoxstyle.css'; // Ensure ResultsBox styles are imported
import validUrl from 'valid-url';
import axios from 'axios';

// this is the search component - its also take care of showing the data nicely.
// make a get request in order to achive csrf token, and than combine it with post request
// in order to fetch the data
export default function SearchBox({ onFetchData }) {
    const [input, setInput] = useState(''); // user input
    const [list, setList] = useState([]); // the overall url's list
    const [moreThanThree, setMoreThanThree] = useState(false); // checking for at least 3 urls in order to fetch
    const [csrfToken, setCsrfToken] = useState(''); // take care of csrf process
    const [loading, setLoading] = useState(false); // Add loading state
    const [error, setError] = useState(''); // Add error state
    const [results, setResults] = useState([]); // Add results state

    // this is for handling the add event to the list 
    const handleAdd = () => {
        if (validUrl.isUri(input)) {
            setList(prevList => [...prevList, input]);
            setInput('');
        } else {
            console.error('Invalid URL');
            alert('invalid url')
        }
        setMoreThanThree(list.length + 1 > 3);
    };

    // to get the csrf token
    const fetchCsrfToken = async () => {
        try {
            const response = await axios.get('http://localhost:3002/api/csrf-token', {
                withCredentials: true // Include cookies for CSRF token
            });
            setCsrfToken(response.data.csrfToken);
        } catch (error) {
            console.error('Error fetching CSRF token:', error);
            setError('Failed to fetch CSRF token.');
        }
    };

    // with csrf token i can securely submit the form, and fetch the relevant data
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (moreThanThree) {
            setLoading(true); // Set loading state to true
            setError(''); // Clear any previous errors

            await fetchCsrfToken(); // Fetch CSRF token before sending the request

            if (csrfToken) { // Only proceed if CSRF token is available
                try {
                    const response = await axios.post('http://localhost:3002/api/fetch', 
                        { data: { items: list } }, 
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-Token': csrfToken // Include CSRF token in headers
                            },
                            withCredentials: true // Include cookies for CSRF token
                        }
                    );
                    setResults(response.data.data); // Set the fetched data in results state
                    console.log('data sent succesfully', response)
                    setError(''); // Clear any previous errors
                } catch (error) {
                    console.error('Error fetching data:', error);
                    setError('Error fetching data from the server.');
                }
            } else {
                setError('please wait...');
            }
            setLoading(false); // Set loading state to false
        } else {
            alert('Add at least 3 URLs to fetch data.');
        }
    };

    return (
        <div className="SearchBoxContainer">
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Enter a URL"
                />
                <button type='button' onClick={handleAdd}>Add to list</button>
                <button type='submit' disabled={loading}>Fetch</button>
            </form>
            {loading && <p>Loading...</p>} {/* Show loading text */}
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Show error message */}
            <ul>
                {list.map((url, index) => (
                    <li key={index}>{url}</li>
                ))}
            </ul>
            {results.length > 0 && (
                <div className="ResultsContainer">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.title}</td>
                                    <td>{item.description}</td>
                                    <td>
                                        <img src={item.image} alt={item.title} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}