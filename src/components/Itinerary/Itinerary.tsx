/* eslint-disable react/react-in-jsx-scope */
import Leg from "../Leg/Leg";
import { components } from "../../bkk-openapi";
import "bootstrap-icons/font/bootstrap-icons.css";
import { MdDirectionsWalk } from "react-icons/md";

interface Props {
  itinerary: components["schemas"]["Itinerary"];
}
const Itinerary = ({ itinerary }: Props) => {
  function displayTime(date: string) {
    if (date)
      return new Date(date).toLocaleTimeString("hu", {
        hour: "2-digit",
        minute: "2-digit",
      });
  }
  return (
    <div className="m-2 h-auto max-w-xs rounded-md bg-slate-100 p-4">
      <div className="mb-4">
        <div className="flex justify-between">
          <span className="">
            {displayTime(itinerary.startTime as string)} -{" "}
            {displayTime(itinerary.endTime as string)}{" "}
          </span>
          <span>{(itinerary.duration / 60).toFixed(0)} min</span>
        </div>
        {itinerary.patternFrequency ? (
          <div className="text-sm">
            every {itinerary.patternFrequency?.text} minutes
          </div>
        ) : (
          ""
        )}
        {/* <p>{itinerary.transfers} transfers</p> */}

        <div className="flex flex-row align-baseline text-sm">
          <MdDirectionsWalk />
          {(itinerary.walkTime / 60).toFixed(0)} min{", "}
          {itinerary.walkDistance?.toFixed(0)} m
        </div>
      </div>
      <div className="">
        {itinerary.legs?.map((leg) => (
          <Leg leg={leg} displayTime={displayTime} key={leg.startTime} />
        ))}
      </div>
    </div>
  );
};
export default Itinerary;
