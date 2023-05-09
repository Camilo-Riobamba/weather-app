import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [position, setPosition] = useState(null);
    const [temp, setTemp] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude } }) => {
                fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=6544e79e6a6c3139aab2ce7d052fbb0e`
                )
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.cod !== 200)
                            throw new Error('Invalid response');

                        setIsLoading(false);
                        setPosition(data);

                        setTemp({
                            type: 'celcius',
                            value: Math.round(data.main.temp - 273.15),
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                        setIsLoading(false);
                    });
            }
        );
    }, []);

    if (isLoading) return 'cargando...';
    if (!position) return 'Ha ocurrido un error en la aplicación';

    return (
        <div className="main-container">
            <div>
                <div className="weather">
                    <div className="info">
                        <div className="data">
                            <span className="temp">
                                {`${temp.value} ${
                                    temp.type === 'celcius' ? 'C' : 'F'
                                }`}
                                °
                            </span>

                            <p>{position.weather[0].main}</p>
                            <p>Wind of {position.wind.speed}km/h</p>
                        </div>
                    </div>
                    <div className="position">
                        <span className="city">{position.name}</span>
                        <span>{position.weather[0].description}</span>
                    </div>
                </div>

                <div
                    className="button"
                    onClick={
                        temp.type === 'celcius'
                            ? () =>
                                  setTemp((prev) => ({
                                      type: 'farenheit',
                                      value: Math.round(
                                          prev.value * (9 / 5) + 32
                                      ),
                                  }))
                            : () =>
                                  setTemp((prev) => ({
                                      type: 'celcius',
                                      value: Math.round(
                                          (prev.value - 32) * (5 / 9)
                                      ),
                                  }))
                    }
                >
                    Cambiar a {temp.type === 'celcius' ? 'F' : 'C'}°
                </div>
            </div>
        </div>
    );
}

export default App;
