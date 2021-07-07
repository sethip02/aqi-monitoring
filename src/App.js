import './App.css';
import { React, useEffect, useState } from 'react';
import { useTable } from 'react-table'

let webSocketObj = new WebSocket("ws://city-ws.herokuapp.com/");

//Sample Message received from the server : Message received from the server : [{"city":"Mumbai","aqi":179.48953967731958},{"city":"Bengaluru","aqi":190.77381882356204},{"city":"Chennai","aqi":140.0255936078323},{"city":"Pune","aqi":222.35319204313396},{"city":"Hyderabad","aqi":199.3847020848653},{"city":"Indore","aqi":51.7829168843359},{"city":"Jaipur","aqi":142.79149985530853},{"city":"Chandigarh","aqi":45.64197667788339},{"city":"Lucknow","aqi":74.30342737014297}]
function App() {
  const [aqiData, setAQIData] = useState([]);
  const aqiTableColumns = React.useMemo(
     () => [
       {
         Header: 'City',
         accessor: 'city', 
       },
       {
         Header: 'Current aqi',
         accessor: 'curr_aqi',
       },
       {
         Header: 'Last updated',
         accessor: 'last_update',
       },
     ],
     []
  )
  
  
const {
     getTableProps,
     getTableBodyProps,
     headerGroups,
     rows,
     prepareRow,
   } = useTable({ aqiTableColumns, aqiData })
  
  
  
  useEffect(() => {
    webSocketObj.onopen = () => {
    console.log("Connection established with the Server");
    };
    
    webSocketObj.onmessage = (message) => {
      console.log("Message received from the server : " + message.data);
      const parsedJSONResponse = JSON.parse(message.data);
      
      setAQIData([...parsedJSONResponse]);
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
