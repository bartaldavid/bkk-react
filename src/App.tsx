/* eslint-disable react/react-in-jsx-scope */
import { useState } from "react";
import "./App.css";
import { operations, components } from "./bkk-openapi";
import Destination from "./components/Destination/Destination";
import {
  MdOutlineMyLocation,
  MdOutlineLocationOn,
  MdLocationPin,
} from "react-icons/md";
import ItinerariesView from "./components/ItinerariesView";
import addresses from "./data/addresses";

function App() {
  const tripUrl =
    "https://futar.bkk.hu/api/query/v1/ws/otp/api/where/plan-trip.json?";
  // const stopDataUrl =
  //   "https://futar.bkk.hu/api/query/v1/ws/otp/api/where/arrivals-and-departures-for-stop.json?";

  const [itineraries, setItineraries] = useState<
    components["schemas"]["Itinerary"][]
  >([]);
  const [loading, setLoading] = useState(false);
  const [tripParams, setTripParams] = useState<
    operations["plan"]["parameters"]["query"]
  >({
    fromPlace: "47.452734,19.183290",
    toPlace: "47.506569,19.089396",
    mode: ["TRANSIT", "WALK"],
    includeReferences: ["false"],
    numItineraries: 4,
  });
  // const [stopParams, setStopParams] = useState<
  //   operations["getArrivalsAndDeparturesForStop"]["parameters"]["query"]
  // >({
  //   stopId: ["BKK_F03845"],
  //   onlyDepartures: true,
  //   limit: 10,
  //   minutesBefore: 0,
  //   minutesAfter: 10,
  // });
  const [accuracy, setAccuracy] = useState("");

  function getData(destinationCoordinates: string): void {
    setLoading(true);
    const params = { ...tripParams, ["toPlace"]: destinationCoordinates };
    fetch(
      // TODO find a better solution to this type issue
      tripUrl + new URLSearchParams(params as any).toString()
    )
      .then((response) => response.json())
      .then((d: components["schemas"]["PlanTripResponse"]) => {
        if (d.code !== 200) {
          console.log(d?.data?.entry?.error);
          throw new Error(d.status);
        }
        return d.data;
      })
      .then((tripData) => {
        setItineraries(tripData?.entry?.plan?.itineraries ?? []);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }

  const setDepartToCurrentLoc = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setTripParams({
          ...tripParams,
          ["fromPlace"]:
            pos.coords.latitude.toString() +
            "," +
            pos.coords.longitude.toString(),
        });
        setAccuracy(pos.coords.accuracy.toFixed(0));
      },
      (error) => setAccuracy(JSON.stringify(error))
    );
  };

  return (
    <div className="">
      <div className="m-4 rounded bg-slate-50 p-2">
        <div className="mx-4 my-2 flex flex-row ">
          <div className="text-md mr-8 inline-flex self-center">
            <MdOutlineLocationOn className="h-8 w-8" />
          </div>
          <button
            onClick={() => setDepartToCurrentLoc()}
            className=" flex items-center border border-solid border-slate-500 p-2 hover:bg-slate-300"
          >
            <MdOutlineMyLocation className="mr-2 inline-flex h-4 w-4" />
            Current location
          </button>
          {accuracy && (
            <div className="ml-4 inline-flex self-center text-xs text-slate-500">
              Accurate to {accuracy} meters
            </div>
          )}
        </div>
        <div className="mx-4 my-2 flex flex-row flex-nowrap">
          <div className="text-md my-auto mr-8 inline-flex">
            <MdLocationPin className="h-8 w-8" />
          </div>
          <div className="my-1 flex flex-row flex-wrap gap-2">
            {addresses.map((destination) => (
              <Destination
                key={destination.coordinates}
                label={destination.label}
                coordinates={destination.coordinates}
                getData={getData}
              />
            ))}
          </div>
        </div>
      </div>
      {/* <button
        className="mx-auto ml-8 w-40 justify-self-center rounded border bg-slate-300 p-3 hover:bg-slate-400"
        onClick={() => getData()}
      >
        <MdDirections className="inline-block text-2xl" /> Plan trip
      </button> */}
      {loading && <p>Loading...</p>}
      <div>
        <ItinerariesView loading={loading} itineraries={itineraries} />
      </div>
    </div>
  );
}

export default App;
