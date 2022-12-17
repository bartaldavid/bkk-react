/* eslint-disable react/react-in-jsx-scope */
import Leg from "../Leg/Leg";
import { components } from "../../bkk-openapi";
import "bootstrap-icons/font/bootstrap-icons.css";
import { MdDirectionsWalk } from "react-icons/md";

interface Props {
  itinerary: components["schemas"]["Itinerary"];
  isExpanded: boolean;
  onExpand: () => void;
  alerts?: {
    [key: string]: components["schemas"]["TransitAlert"] | undefined;
  };
}
const Itinerary = ({ itinerary, isExpanded, onExpand, alerts }: Props) => {
  function displayTime(date: string): string {
    if (date) {
      return new Date(date).toLocaleTimeString("hu", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else return "";
  }
  return (
    <div className="m-2 h-fit w-full rounded-md bg-slate-100 p-4 sm:w-64">
      <div className="mb-4" onClick={onExpand}>
        <div className="flex justify-between pb-1">
          <span className="">
            {displayTime(itinerary.startTime as string)} -{" "}
            {displayTime(itinerary.endTime as string)}{" "}
          </span>
          <span>
            {itinerary.duration && (itinerary.duration / 60).toFixed(0)} min
          </span>
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
          {itinerary.walkTime && (itinerary.walkTime / 60).toFixed(0)} min{", "}
          {itinerary.walkDistance?.toFixed(0)} m
        </div>
      </div>
      {isExpanded && (
        <div className="">
          {itinerary.legs?.map((leg) => (
            <Leg
              leg={leg}
              displayTime={displayTime}
              key={leg.startTime}
              alerts={alerts}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default Itinerary;
