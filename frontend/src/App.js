import React, { useState } from 'react';
import './App.css';
import TopBar from './components/TopBar';
import SearchBox from './components/SearchBox';



function App() {
    const [results, setResults] = useState([]);

    const handleFetchData = (data) => {
        setResults(data);
    };

    return (
        <div className="AppContainer">
            <div className="HeaderSec">
                <TopBar />
            </div>
            <div className="Section">
                <SearchBox onFetchData={handleFetchData} />
            </div>
        </div>
    );
}

export default App;