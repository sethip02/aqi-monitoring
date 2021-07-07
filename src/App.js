import './App.css';
import { useEffect, useState } from 'react';
let webSocketObj = new WebSocket("ws://city-ws.herokuapp.com/");

function App() {
  const [aqiData, setAQIData] = useState([]);
  
  
  
  useEffect(() => {
    webSocketObj.onopen = () => {
    console.log("Connection established with the Server");
    };
    
    webSocketObj.onmessage = (message) => {
      console.log("Message received from the server : " + JSON.stringify(message));
      setAQIData([...message]);
    };

    webSocketObj.onclose = () => {
      console.log("Connection to the server is closed");
    }
    
  }, []);


  return (
    <div className="App">
      <p>{ JSON.stringify(aqiData)}</p>
    </div>
  );
}

export default App;
