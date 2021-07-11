import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';



class AQILiveChart extends React.Component{
  
    constructor(props) {
        super(props);
        this.state ={
          data: [],
          selectedCity : ""
        }
    }
   
  static getDerivedStateFromProps(props, state) {
    var receivedData = JSON.parse(JSON.stringify(props.aqidata));
    if ((state.selectedCity !== "" && (receivedData[0]['city'] !== state.selectedCity))) {
      
      return {
        data: receivedData,
        selectedCity: receivedData[0]['city']
      };
    }
    else {
      return {
        data: state.data.concat(receivedData),
        selectedCity: receivedData[0]['city']

      };
    }
    }
    render() {
      console.log("Data received in AQILiveChart: " + JSON.stringify(this.state.data));
        return (
          <div style={{
  paddingBottom: '56.25%', /* 16:9 */
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
          <XAxis dataKey="city" />
          <YAxis dataKey="aqi" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="aqi" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
</div>
</div>  
        );
    };
}

export default AQILiveChart;