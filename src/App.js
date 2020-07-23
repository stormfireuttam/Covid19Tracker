import React, {useState, useEffect} from 'react';
import './App.css';
import {FormControl, MenuItem, Select, CardContent, Card} from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import {sortData, prettyPrintStat} from './util';
import "leaflet/dist/leaflet.css";

function App() {
  const [mapCountries, setMapCountries] = useState([]);
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 20.5937, lng: 78.9629});
  const [mapZoom, setMapZoom] = useState(3);
  const [casesType, setCasesType] = useState("cases");
  // STATE = How to write a variable in React
  // USEEFFECT = Runs a piece of code based on a given condition
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all").then(response => (response.json())).then((data) => {
      setCountryInfo(data);
    })
  }, []);
  useEffect(() => {
    //The code here will run only once when the component loads and not again
    //async -> send a request to server and wait for it
    const getCountriesData = async() => {
      await fetch("https://disease.sh/v3/covid-19/countries").then((response) => response.json()).then((data) => {
        const countries = data.map((country) => ({ 
            name: country.country,      //United States, United Kingdom
            value: country.countryInfo.iso2       //USA, UK, FR
        }));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    };
    getCountriesData();
  }, [countries]);
  const onCountryChange = async(event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    //https://disease.sh/v3/covid-19/all
    //https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
    const url = countryCode === 'worldwide' ? `https://disease.sh/v3/covid-19/all` :
     `https://disease.sh/v3/covid-19/countries/${countryCode}`;
     await fetch(url).then((response) => response.json()).then((data) => {
       setCountry(countryCode);
       //All of the data from the country response
       setCountryInfo(data);
       setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
       setMapZoom(4);
     })
  }; 

  return (
    <div className="app">    
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {/* Loop through all the countries and show a dropdown for all the countries */}
              {countries.map(country =>(
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats"> 
          <InfoBox 
            isRed
            active={casesType === "cases"}
            onClick={e => setCasesType("cases")}
            title="Coronavirus Cases" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox 
            active={casesType === "recovered"}
            onClick={e => setCasesType("recovered")} 
            title="Recovered" 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox 
            isRed
            active={casesType === "deaths"}
            onClick={e => setCasesType("deaths")} 
            title="Deaths" 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>      
        <Map 
          casesType={casesType} 
          countries={mapCountries} 
          center={mapCenter} 
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent> 
          <h3>Live Cases By Country</h3>
          <Table countries={tableData}/>
          <h3 className="app__graph__title">Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
