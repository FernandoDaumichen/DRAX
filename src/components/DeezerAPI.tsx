import React, { useState, useEffect } from 'react';

type DeezerApiResponse = {
    // Replace with actual response structure
    country: string;
    open: boolean;
    pop: string;
    // other fields...
};

const DeezerAPI: React.FC = () => {
    const [data, setData] = useState<DeezerApiResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const url = 'https://deezerdevs-deezer.p.rapidapi.com/infos';
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': 'ee75c3cc9dmsha7e377714a18573p11f471jsn38c6ba464127', // Replace with your actual API key
    'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
                }
            };
    
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error('Fetch error:', error);
                setError('Failed to fetch data. Please check the console for more details.');
            }
        };
    
        fetchData();
    }, []);
    

    return (
        <div>
            {error && <p>Something went wrong: {error}</p>}
            {data && (
                <div>
                    <h2>Deezer API Response</h2>
                    <p>Country: {data.country}</p>
                    <p>Is Service Open: {data.open ? 'Yes' : 'No'}</p>
                    <p>Preferred Pop: {data.pop}</p>
                   
                </div>
            )}
        </div>
    );
};

export default DeezerAPI;
