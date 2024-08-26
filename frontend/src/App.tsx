import React from 'react';
import './App.css'; // Make sure this file includes some basic styling for your app
import MapComponent from './MapComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to TrailVista</h1>
      </header>
      <main>
        <div>
          <MapComponent />
        </div>
      </main>
    </div>
  );
}

export default App;
