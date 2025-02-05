import {useEffect, useState} from 'react'

function App() {
    const [countries, setCountries] = useState([])
    const [query, setQuery] = useState('')
    const [message, setMessage] = useState('')
    const [selectedCountry, setSelectedCountry] = useState(null)
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        if (query === '') {
            setCountries([]);
            setMessage('');
            setSelectedCountry(null)
            return;
        }

        fetch('https://studies.cs.helsinki.fi/restcountries/api/all')
            .then(response => response.json())
            .then(data => {
                const filteredCountries = data.filter(country =>
                    country.name.common.toLowerCase().includes(query.toLowerCase())
                );
                setCountries(filteredCountries)
                setSelectedCountry(null)

                if (filteredCountries.length > 10) {
                    setMessage('Too many matches, specify another filter')
                } else if (filteredCountries.length === 1) {
                    setMessage('')
                } else {
                    setMessage('')
                }
            })
    }, [query]);

    const handleChange = (event) => {
        setQuery(event.target.value);
    }

    const showCountries = (country) => {
        return (
            <div>
                <h2>{country.name.common}</h2>
                <p>capital {country.capital}</p>
                <p>area {country.area}</p>
                <h3>languages:</h3>
                {Object.values(country.languages).map(lang => (
                    <p key={lang}>{lang}</p>
                ))}
                <img src={country.flags.svg} alt="Flag of country" width="140"/>


                {weather && (
                    <div>
                        <h3>Weather in {country.capital}</h3>
                        <p>temperature {weather.temperature} Celsius</p>
                        <img src={`http://openweathermap.org/img/wn/${weather.icon}.png`}
                             alt="Weather description image" width="85"/>
                    </div>
                )}
            </div>
        )
    }

    const showCountry = (country) => {
        setSelectedCountry(country);

        const lat = country.latlng[0]
        const lon = country.latlng[1]

        const api_key = import.meta.env.VITE_SOME_KEY;

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log('weather data:', data)
                if (data.main) {
                    setWeather({
                        temperature: (data.main.temp - 273.15).toFixed(1),
                        icon: data.weather[0].icon,
                        description: data.weather[0].description,
                    })
                }
    })
}

return (
    <>
        <input type="text" placeholder="Search by country" value={query} onChange={handleChange}/>

        {message && <p>{message}</p>}

        {selectedCountry && showCountries(selectedCountry)}

        {countries.length > 1 && countries.length <= 10 && (
            <ul>
                {countries.map(country => (
                    <li key={country.name.common}>{country.name.common}
                        <button onClick={() => showCountry(country)}>show</button>
                    </li>
                ))}
            </ul>
        )}
    </>
)
}

export default App
