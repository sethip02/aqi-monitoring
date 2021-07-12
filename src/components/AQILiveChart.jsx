import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



class AQILiveChart extends React.Component{
  
    constructor(props) {
        super(props);
        this.state ={
          data: [],
          selectedCity : []
        }
    }
   
  static getDerivedStateFromProps(props, state) {
    console.log(JSON.parse(JSON.stringify(props.aqidata)));
    var receivedData = JSON.parse(JSON.stringify(props.aqidata));
    var cityNames = "";
    console.log("state.selectedCity: " + JSON.stringify(state.selectedCity));
    console.log("cityNames: " + cityNames);
    if (state.selectedCity.length !== 0) {
      if (state.selectedCity.length === 1) {
        cityNames = state.selectedCity[0];
      }
      else {
        var tempArr = state.selectedCity;
        cityNames = tempArr[0] + "/" + tempArr[1];
      }
    }
    if ((state.selectedCity !== [] && (receivedData[0]['name'] !== cityNames))) {
      
      return {
        data: receivedData,
        selectedCity: [receivedData[0]['name']]
      };
    }
    else {
      return {
        data: state.data.concat(receivedData),
        selectedCity: [receivedData[0]['name']]
        

      };
    }
    }
    render() {
      console.log("Data received in AQILiveChart: " + JSON.stringify(this.state.data));
        return (
          <div style={{
  paddingBottom: '56.25%',
  position: 'relative',
  height: 0
}} >
  <div style={{
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%'
  }}>
           <ResponsiveContainer width="100%" height="70%">
        <LineChart
          width={500}
          height={300}
          data={this.state.data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="city1" stroke="#8884d8"/>
          { this.state.selectedCity.length === 2 ? <Line type="monotone" dataKey="city2" stroke="#82ca9d" /> : null}
          
        </LineChart>
      </ResponsiveContainer>
</div>
</div>  
        );
    };
}

export default AQILiveChart;