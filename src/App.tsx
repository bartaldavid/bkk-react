/* eslint-disable react/react-in-jsx-scope */
import { useState } from "react";
import "./App.css";
import Itinerary from "./components/Itinerary/Itinerary";
import { operations, components } from "./bkk-openapi";
import Destination from "./components/Destination/Destination";

function App() {
  const [itineraries, setItineraries] = useState<
    components["schemas"]["Itinerary"][]
  >([]);
  const [loading, setLoading] = useState(true);
  const [tripParams, setTripParams] = useState<
    operations["plan"]["parameters"]["query"]
  >({
    fromPlace: "47.452734,19.183290",
    toPlace: "47.506569,19.089396",
    mode: ["TRANSIT", "WALK"],
    includeReferences: ["false"],
  });
  // const [error, setError] = useState(null);

  const destinations = [
    {
      label: "Radnóti",
      coordinates: "47.506569,19.089396",
    },
    {
      label: "Párbeszéd Háza",
      coordinates: "47.491038,19.067816",
    },
    {
      label: "ELTE BTK",
      coordinates: "47.493322,19.060746",
    },
  ];

  const tripUrl =
    "https://futar.bkk.hu/api/query/v1/ws/otp/api/where/plan-trip.json?";

  function getData() {
    async function fetchTrip() {
      const tripResponse = await fetch(
        tripUrl + new URLSearchParams(tripParams).toString()
      );
      const tripData = await tripResponse
        .json()
        .then((d: components["schemas"]["PlanTripResponse"]) => {
          if (d.code !== 200) {
            console.log(d?.data?.entry?.error);
            throw new Error(d.status);
          }
          return d.data;
        });
      return tripData;
    }

    fetchTrip()
      .then((tripData) => {
        setLoading(false);
        // console.log(tripData.entry.plan);
        setItineraries(tripData?.entry?.plan?.itineraries ?? []);
        // console.log(itineraries);
      })
      .catch((err) => console.log(err));
  }

  const handleDestinationChange = (coordinates: string) => {
    setTripParams({ ...tripParams, ["toPlace"]: coordinates });
  };

  const setDepartToCurrentLoc = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setTripParams({
        ...tripParams,
        ["fromPlace"]:
          pos.coords.latitude.toString() +
          "," +
          pos.coords.longitude.toString(),
      });
      console.log(pos.coords.accuracy);
    });
  };

  return (
    <div className="align-middle">
      <button
        onClick={() => setDepartToCurrentLoc()}
        className="border border-solid border-slate-500 p-1 hover:bg-slate-300"
      >
        Set current location as start
      </button>
      <div className="my-1">
        {destinations.map((destination) => (
          <Destination
            key={destination.coordinates}
            label={destination.label}
            coordinates={destination.coordinates}
            handleDestinationChange={handleDestinationChange}
          />
        ))}
      </div>
      <button
        className="border border-solid border-slate-500 p-1 hover:bg-slate-300"
        onClick={() => getData()}
      >
        Fetch data
      </button>
      <div className="m-4 flex flex-wrap p-3">
        {!loading &&
          itineraries.map((itinerary) => (
            <Itinerary itinerary={itinerary} key={itinerary.duration} />
          ))}
      </div>
    </div>
  );
}

export default App;
