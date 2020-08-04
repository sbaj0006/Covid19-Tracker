import React, { useState, useEffect } from "react";
import "./App.css";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Table from "./Table";
import { sortData } from "./util";
import LineGraph from "./LineGraph";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

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

          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, [countries]);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
      });
  };

  return (
    <React.Fragment>
      {/* Title + select input dropdown field */}
      <div className="app">
        <div className="app__left">
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
            <InfoBox
              title="Coronovirus Cases"
              cases={countryInfo.todayCases}
              total={countryInfo.cases}
            />
            <InfoBox
              title="Recovered"
              cases={countryInfo.todayRecovered}
              total={countryInfo.recovered}
            />
            <InfoBox
              title="Deaths"
              cases={countryInfo.todayDeaths}
              total={countryInfo.deaths}
            />
          </div>

          {/* Map */}
          <Map />
        </div>
        <Card className="app__right">
          <CardContent>
            <h3>Live Cases by Country</h3>
            {/* Table */}
            <Table countries={tableData} />
            <h3>Worldwide new Cases</h3>
            {/* Graph */}
            <LineGraph />
          </CardContent>
        </Card>
      </div>
    </React.Fragment>
  );
}

export default App;
