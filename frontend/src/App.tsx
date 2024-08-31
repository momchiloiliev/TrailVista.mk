import React from 'react';
import './App.css'; // Make sure this file includes some basic styling for your app
import MapComponent from './MapComponent';
import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Header />
      </header>
      <main>
        <div>
          {/* <MapComponent /> */}
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default App;
