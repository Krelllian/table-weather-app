import React from 'react';
import logo from './logo.svg';
import './App.scss';
import WeatherTable from './components/WeatherTable';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <main className='App-main container'>
        <WeatherTable />
      </main>
    </div>
  );
}

export default App;
