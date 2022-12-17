/* eslint-disable react/react-in-jsx-scope */
import { components } from "../../bkk-openapi";
import { MdWarning } from "react-icons/md";

interface Props {
  leg: components["schemas"]["Leg"];
  displayTime: (date: string) => string;
  alerts?: {
    [key: string]: components["schemas"]["TransitAlert"] | undefined;
  };
}

const Leg = ({ leg, displayTime, alerts }: Props) => {
  const legStyle = {
    backgroundColor: "#" + leg.routeColor,
    color: "#" + leg.routeTextColor,
  };
  return (
    <div className="mb-2 rounded-md border border-solid border-slate-500 p-2 text-sm">
      <div className="flex justify-between">
        <span className="whitespace-normal">{leg?.from?.name}</span>
        <span className="self-center text-slate-600">
          {leg.startTime && displayTime(leg.startTime ?? "")}
        </span>
      </div>
      <div className="my-1">
        <span style={legStyle} className="inline-block rounded-md p-1 text-xs">
          {leg.mode} {leg.transitLeg && leg.routeShortName}{" "}
        </span>
        <span className="text-xs">
          {" "}
          {leg.duration && (leg.duration / 60000).toFixed(0)} min{" "}
          {!leg.transitLeg && "(" + leg.distance?.toFixed() + " m)"}
        </span>
      </div>
      {leg.hasAlertInPattern && alerts && (
        <div className="my-2 ml-1 flex flex-row align-middle text-red-700">
          <MdWarning className="mr-2 inline-flex self-center" />
          <div className="text-xs">
            {leg.alertIds?.map(
              (currentAlertId) =>
                alerts[currentAlertId]?.header?.someTranslation
            ) ?? ""}
          </div>
        </div>
      )}
      <div className="flex justify-between">
        <span>{leg?.to?.name}</span>
        <span className="text-slate-600">
          {leg.endTime && displayTime(leg.endTime)}
        </span>
      </div>
    </div>
  );
};

export default Leg;
