import React from 'react'
import './WeatherTable.scss'
import { useEffect, useState, useRef } from 'react'
import axios from 'axios';

export interface ICurrentSearchData {
    lat: number
    lon: number
    dt: number
}

export interface IWeatherHour {
    dt: number
    temp: number;
    pressure: number;
    wind_speed: number;
    weather: any;
}

export interface IWeatherData {
    hourly: Array<IWeatherHour>
}

const WeatherTable = () => {
    const apiKey = '094a267ffe81ea50e9c3ddf4464b3d99';

    const localData: any = localStorage.getItem('currentSearchData');
    const dateRightNow = Math.floor(Date.now() / 1000);
    const dateInputValueRef: any = useRef()

    const [loadingWeather, setLoadingWeather] = useState(false)
    const [apiError, setApiError] = useState(false)

    const [weatherData, setWeatherData] = useState<IWeatherData>();

    const [currentSearchData, setCurrentSearchData] = useState<ICurrentSearchData>(localStorage.currentSearchData ? JSON.parse(localData) : { lat: 55, lon: 37, dt: Math.floor(Date.now() / 1000 - 45000) })

    useEffect(() => {
        const localData = localStorage.getItem('currentSearchData');
        console.log('useEffect >>', currentSearchData)
        console.log('useEffect2 >>', localStorage.currentSearchData)
        getWeatherUTC(currentSearchData)
    }, [])

    useEffect(() => {
        getWeatherUTC(currentSearchData)
        console.log('useEffect3 update >>', currentSearchData)
        localStorage.setItem('currentSearchData', JSON.stringify(currentSearchData))
    }, [currentSearchData])

    async function getWeatherUTC({ lat, lon, dt }: ICurrentSearchData) {
        setLoadingWeather(true)
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${dt}&appid=${apiKey}&units=metric&lang=ru`)
            setLoadingWeather(false)
            setWeatherData(response.data);
        } catch (error) {
            console.log('Api error >>')
            setApiError(true)
        }
    }

    const updateCurrentSearchData = (lat: number, lon: number) => {
        setCurrentSearchData(prevState => {
            return { ...prevState, lat, lon }
        })
    }

    const changeWeatherDataTime: React.ChangeEventHandler<HTMLInputElement> = (e) => {

        //Корректировка инпута под формат Date
        const dateInUSA = [...dateInputValueRef.current.value]
        const dateMonth = +dateInUSA.slice(3, 5).join('')
        const dateDays = +dateInUSA.slice(0, 2).join('')
        const dateYear = +dateInUSA.slice(-4).join('')
        console.log('dateDays', dateDays, dateMonth, dateYear)
        console.log('NEW DATE >>', new Date(2022, 2, 10))

        if (dateInputValueRef.current.value.length === 10 && new Date(dateYear, dateDays, dateMonth).toLocaleDateString('ru') !== 'Invalid Date') {
            console.log('changeWeatherDataTime1 >>', dateInputValueRef.current.value)
            const newDateTime = `${new Date(dateYear, dateMonth - 1, dateDays).getTime() / 1000}`
            console.log('changeWeatherDataTime2 >>', newDateTime)
            console.log('dateNow >>', Date.now())

            setCurrentSearchData(prevState => {
                return { ...prevState, dt: Number(newDateTime) }
            })
        }
    }

    const toggleClassShow = () => {
        document.querySelector('.weather__sort__options')?.classList.toggle('show')
    }

    return (
        <section className='weather container'>
            <div className='weather__content'>
                <div className='weather__sorts'>

                    <ul className='weather-menu' onClick={toggleClassShow}>
                        <li className='weather__sort weather__sort--city'>Выберите город
                            <ul className='weather__sort__options'>
                                <li onClick={() => updateCurrentSearchData(55, 37)}><p>Москва</p></li>
                                <li onClick={() => updateCurrentSearchData(60, 76)}><p>Нижневартовск</p></li>
                                <li onClick={() => updateCurrentSearchData(43, 131)}><p>Владивосток</p></li>
                            </ul>
                        </li>
                    </ul>

                    <input onChange={changeWeatherDataTime} className="weather__sort weather__sort--date" type="text" ref={dateInputValueRef} placeholder='Введите дату: ДД.ММ.ГГГГ' maxLength={10}></input>
                </div>

                <table className='weather__table' >
                    <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Температура воздуха, ℃</th>
                            <th>Давление, мм. вод.ст.</th>
                            <th>Скорость ветра, м/с</th>
                            <th className='weather__table__cloudiness'>Облачность</th>
                        </tr>
                    </thead>

                    <tbody>

                        {weatherData?.hourly.reverse().map((hourly, i) => {
                            return <tr key={i}>
                                <td>{new Date(hourly.dt * 1000).toLocaleString('ru')}</td>
                                <td>{Math.round(hourly.temp * 10) / 10}</td>
                                <td>{hourly.pressure}</td>
                                <td>{Math.round(hourly.wind_speed)}</td>
                                <td>{hourly.weather[0].description}</td>
                            </tr>
                        })
                        }
                    </tbody>

                </table>

            </div>
        </section>
    )
}

export default WeatherTable