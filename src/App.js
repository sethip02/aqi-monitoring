import "./App.css";
import { React, useEffect, useState, useRef } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AQILiveChart from "./components/AQILiveChart";
import { Icon } from "semantic-ui-react";

let webSocketObj = new WebSocket("wss://city-ws.herokuapp.com/");

function App() {
  const [aqiData, setAQIData] = useState(() => initialState());
  const tempAQIData = useRef(initialState());
  const aqiTableColumns = ["City", "Current aqi", "Last updated", "Compare"];
  const showAQIChart = useRef(false);
  const selectedCity = useRef([]);
  const [errorOccurred, setErrorOccurred] = useState(false);

  useEffect(() => {
    webSocketObj.onopen = () => {
      console.log("Connection established with the Server");
    };

    webSocketObj.onerror = (event) => {
      console.log("Error occurred while connecting to Server");
      setErrorOccurred(true);
    };

    webSocketObj.onmessage = (message) => {
      const parsedJSONResponse = JSON.parse(message.data);
      //processing json response

      for (let currDataObj of parsedJSONResponse) {
        for (let prevDataObj of tempAQIData.current) {
          if (prevDataObj["city"] === currDataObj["city"]) {
            prevDataObj["aqi"] = parseFloat(currDataObj["aqi"])
              .toFixed(2)
              .toString();
            prevDataObj["last_update"] = new Date().toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });
            break;
          }
        }
      }
      setAQIData([...tempAQIData.current]);
    };

    webSocketObj.onclose = () => {
      console.log("Connection to the server is closed");
    };
  }, []);

  function processAQIDataForLiveChart(aqiData) {
    console.log("Selected Cities: " + JSON.stringify(selectedCity.current));
    var filteredData = aqiData.filter((dataObj) =>
      selectedCity.current.includes(dataObj["city"])
    );
    if (filteredData.length === 1)
      return filteredData.map((obj1) => ({
        name: obj1["city"],
        city1: obj1["aqi"],
      }))[0];
    else
      return filteredData.reduce((obj1, obj2) => ({
        name:
          (obj1 !== null ? obj1["city"] + "/" : "") +
          (obj2 !== null ? obj2["city"] : ""),
        city1: obj1 !== null ? obj1["aqi"] : 0.0,
        city2: obj2 !== null ? obj2["aqi"] : 0.0,
      }));
  }

  function handleIconClick(e) {
    console.log(
      "e.target.className: " + e.target.className + " ; Icon id: " + e.target.id
    );
    if (e.target.className !== undefined) {
      if (!e.target.className.includes("disabled")) {
        if (selectedCity.current.length === 2) {
        } else {
          e.target.className = "plus icon disabled";
          showAQIChart.current = true;
          selectedCity.current.push(e.target.id);
        }
      } else {
        if (selectedCity.current.length === 1) {
          showAQIChart.current = false;
        }
        e.target.className = "plus icon enabled";
        selectedCity.current.pop(e.target.id);
      }
    }
  }

  return (
    <div className="App">
      <Header />
      {errorOccurred ? (
        <div className="content">
          <h3>Something went wrong. Please try after sometime.</h3>
        </div>
      ) : (
        <div className="content">
          <table>
            {aqiTableColumns.map((columnName) => (
              <th>{columnName}</th>
            ))}

            {aqiData.map((rowData) => (
              <tr>
                <td>{rowData["city"]}</td>
                {getAQIRowData(rowData["aqi"])}
                <td>{rowData["last_update"]}</td>
                <td>
                  <Icon
                    enabled
                    id={rowData["city"]}
                    name="plus"
                    onClick={handleIconClick}
                  />
                </td>
              </tr>
            ))}
          </table>
          <p style={{ color: "gray" }}>
            * For real time monitoring chart and aqi comparison of 2 cities ,
            click <b>+</b> sign against city name
          </p>
        </div>
      )}
      {showAQIChart.current ? (
        <AQILiveChart
          aqidata={processAQIDataForLiveChart(aqiData)}
          selectedCity={selectedCity.current}
        />
      ) : (
        <div />
      )}
      <Footer />
    </div>
  );
}

function initialState() {
  const currentTime = new Date().toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return [
    { city: "Mumbai", aqi: "Not Available", last_update: currentTime },
    { city: "Bengaluru", aqi: "Not Available", last_update: currentTime },
    { city: "Chennai", aqi: "Not Available", last_update: currentTime },
    { city: "Pune", aqi: "Not Available", last_update: currentTime },
    { city: "Hyderabad", aqi: "Not Available", last_update: currentTime },
    { city: "Indore", aqi: "Not Available", last_update: currentTime },
    { city: "Jaipur", aqi: "Not Available", last_update: currentTime },
    { city: "Chandigarh", aqi: "Not Available", last_update: currentTime },
    { city: "Lucknow", aqi: "Not Available", last_update: currentTime },
    { city: "Kolkata", aqi: "Not Available", last_update: currentTime },
    { city: "Delhi", aqi: "Not Available", last_update: currentTime },
    { city: "Bhubaneswar", aqi: "Not Available", last_update: currentTime },
  ];
}

function getAQIRowData(value) {
  let tdClass = "";
  if (value === "Not Available" || value < 0) {
    tdClass = "na";
  } else if (value > 0 && value <= 50) {
    tdClass = "good";
  } else if (value > 50 && value <= 100) {
    tdClass = "satisfactory";
  } else if (value > 100 && value <= 200) {
    tdClass = "moderate";
  } else if (value > 200 && value <= 300) {
    tdClass = "poor";
  } else if (value > 300 && value <= 400) {
    tdClass = "verypoor";
  } else if (value > 400 && value <= 500) {
    tdClass = "severe";
  }

  return (
    <td class={tdClass}>
      <b>{value}</b>
    </td>
  );
}

export default App;
