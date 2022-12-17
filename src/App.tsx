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
    includeReferences: ["alerts"],
    numItineraries: 4,
  });
  const [alerts, setAlerts] = useState<{
    [key: string]: components["schemas"]["TransitAlert"] | undefined;
  }>();
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
    // TODO custom hook?
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
        setAlerts(tripData?.references?.alerts);
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
      (error) => setAccuracy(error.message)
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
      {loading && (
        <div role="status" className="m-8">
          <svg
            aria-hidden="true"
            className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-slate-200"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      )}
      <div>
        <ItinerariesView
          loading={loading}
          itineraries={itineraries}
          alerts={alerts}
        />
      </div>
    </div>
  );
}

export default App;
