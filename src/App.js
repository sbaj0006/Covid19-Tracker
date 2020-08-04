import React, { useState, useEffect } from "react";
import "./App.css";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InfoBox from "./InfoBox";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");

  //useEffect - runs a piece of code based on a given conditon
  useEffect(() => {
    //The code inside here will run once when the component loads and not again
    //async - send a request, wait for it, do something with the output

    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          setCountries(countries);
        });
    };
    getCountriesData();
  }, [countries]);

  const onCountryChange = (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
  };

  return (
    <React.Fragment>
      {/* Title + select input dropdown field */}
      <div className="app">
        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          {/* header */}
          <FormControl className="app__dropdown">
            <Select
              onChange={onCountryChange}
              variant="outlined"
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox title="Coronovirus Cases" cases={123} total={2000} />
          <InfoBox title="Recovered" cases={123} total={3000} />
          <InfoBox title="Deaths" cases={123} total={4000} />
        </div>

        {/* Table */}

        {/* Graph */}

        {/* Map */}
      </div>
    </React.Fragment>
  );
}

export default App;
