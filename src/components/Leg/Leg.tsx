/* eslint-disable react/react-in-jsx-scope */
import { components } from "../../bkk-openapi";

interface Props {
  leg: components["schemas"]["Leg"];
  displayTime: () => string;
}

const Leg = ({ leg, displayTime }: Props) => {
  const legStyle = {
    backgroundColor: "#" + leg.routeColor,
    color: "#" + leg.routeTextColor,
  };
  return (
    <div className="mb-2 rounded-md border border-solid border-slate-500 p-2 text-sm">
      <div className="flex justify-between">
        <span className="whitespace-normal">{leg?.from?.name}</span>
        <span className="text-slate-600">{displayTime(leg.startTime)}</span>
      </div>
      <div className="my-1">
        <span style={legStyle} className="inline-block rounded-md p-1 text-xs">
          {leg.mode} {leg.transitLeg ? leg.routeShortName : ""}{" "}
        </span>
        <span className="text-xs">
          {" "}
          {(leg.duration / 60000).toFixed(0)} min{" "}
          {leg.transitLeg !== true ? "(" + leg.distance?.toFixed() + " m)" : ""}
        </span>
      </div>
      <div className="flex justify-between">
        <span>{leg?.to?.name}</span>
        <span className="text-slate-600">{displayTime(leg.endTime)}</span>
      </div>
    </div>
  );
};

export default Leg;
