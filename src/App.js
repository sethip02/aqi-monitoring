import './App.css';
import { React, useEffect, useState, useRef } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AQILiveChart from './components/AQILiveChart';

let webSocketObj = new WebSocket("ws://city-ws.herokuapp.com/");

function App() {
  const [aqiData, setAQIData] = useState(() => initialState());
  const tempAQIData = useRef(initialState());
  const aqiTableColumns = ['City', 'Current aqi', 'Last updated' ];
  const showAQIChart = useRef(false);
  const selectedCity = useRef("");

  useEffect(() => {
    webSocketObj.onopen = () => {
      console.log("Connection established with the Server");
    };
    
    webSocketObj.onmessage = (message) => {
      const parsedJSONResponse = JSON.parse(message.data);
      //processing json response
      
      for (let currDataObj of parsedJSONResponse) {
        for (let prevDataObj of tempAQIData.current) {
          if (prevDataObj["city"] === currDataObj["city"]) {
            prevDataObj["aqi"] = parseFloat(currDataObj["aqi"]).toFixed(2).toString();
            prevDataObj["last_update"] = (new Date()).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            break;
          }

        }
          
            
      }
      setAQIData([...(tempAQIData.current)]);
    };
   
    
    

    webSocketObj.onclose = () => {
      console.log("Connection to the server is closed");
    }
    
  }, []);


  return (
    
    <div className="App">
      <Header />
      <div className="AQITable">
        <table>
          
            {
              aqiTableColumns.map((columnName) => 
              (<th>{columnName}</th>))
            
            }
          
          {
            aqiData.map((rowData) => 
              (<tr>
              <td><a href="#" onClick={() => { selectedCity.current = rowData["city"]; showAQIChart.current = true; }}>{rowData["city"]}</a></td>
              {getAQIRowData(rowData["aqi"])}
              <td>{rowData["last_update"]}</td>
                  </tr>))
          }
        </table>
        <p style={{ color: 'gray' }}>* For real time monitoring chart, click on the particular city name</p>
        
      </div>
      {showAQIChart.current ? <AQILiveChart aqidata={aqiData.filter((dataObj) => dataObj["city"] === selectedCity.current)} /> : <div/>}
      <Footer/>
    </div>
  );

  
}

function initialState() {
  
  const currentTime = (new Date()).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  return ([
  { "city": "Mumbai", "aqi": "Not Available", "last_update" :  currentTime},
  { "city": "Bengaluru", "aqi": "Not Available", "last_update" : currentTime },
  { "city": "Chennai", "aqi": "Not Available", "last_update" :  currentTime },
  { "city": "Pune", "aqi": "Not Available" , "last_update" :  currentTime },
  { "city": "Hyderabad", "aqi": "Not Available" , "last_update" :  currentTime },
  { "city": "Indore", "aqi": "Not Available" , "last_update" :  currentTime },
  { "city": "Jaipur", "aqi": "Not Available" , "last_update" :  currentTime },
  { "city": "Chandigarh", "aqi": "Not Available" , "last_update" :  currentTime },
  { "city": "Lucknow", "aqi": "Not Available" , "last_update" :  currentTime },
  { "city": "Kolkata", "aqi": "Not Available" , "last_update" :  currentTime },
  { "city": "Delhi", "aqi": "Not Available" , "last_update" :  currentTime },
    { "city": "Bhubaneswar", "aqi": "Not Available", "last_update": currentTime }

]);
}


function getAQIRowData(value) {
  let tdClass = "";
  if (value === "Not Available" || value < 0) {
    tdClass = "na";
  }
  else if (value > 0 && value <= 50) {
    tdClass = "good";
  }
  
  else if (value > 50 && value <= 100) {
     tdClass = "satisfactory";
  }
  
  else if (value > 100 && value <= 200) {
    tdClass = "moderate";
  }
  
  else if (value > 200 && value <= 300) {
    tdClass = "poor";
  }
  else if (value > 300 && value <= 400) {
    tdClass = "verypoor";
  }
  else if (value > 400 && value <= 500) {
    tdClass = "severe";
  }


  return (
    <td class={tdClass}><b>{value}</b></td>
  );
}


export default App;
