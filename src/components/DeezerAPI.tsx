import React, { useState, useEffect } from 'react';

type DeezerApiResponse = {

    country: string;
    open: boolean;
    pop: string;

};

const DeezerAPI: React.FC = () => {
    const [data, setData] = useState<DeezerApiResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const url = 'https://deezerdevs-deezer.p.rapidapi.com/infos';
            const API_KEY = process.env.NEXT_PUBLIC_DEEZER_API;
            if (!API_KEY) {
                console.error('API key is not defined');
                setError('API key is not defined');
                return;
            }
            const options = {
                method: 'GET',
                headers: {
                    'X-RapidAPI-Key': API_KEY,
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
                    <h2 className='flex justify-center items-center text-white vibrant-pink'>Deezer API Response</h2>
                    <p className='text-white'>Country: {data.country}</p>
                    <p className='text-white'>Is Service Open: {data.open ? 'Yes' : 'No'}</p>
                </div>
            )}
        </div>
    );
};

export default DeezerAPI;