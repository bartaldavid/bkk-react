/* eslint-disable react/react-in-jsx-scope */
import { components } from "../bkk-openapi";
import Itinerary from "./Itinerary/Itinerary";
import { useState } from "react";

interface Props {
  loading: boolean;
  itineraries: components["schemas"]["Itinerary"][];
  alerts?: {
    [key: string]: components["schemas"]["TransitAlert"] | undefined;
  };
}

const ItinerariesView = ({
  loading,
  itineraries,
  alerts,
}: Props): JSX.Element => {
  const [expandedId, setExpandedId] = useState(0);
  return (
    <div className="m-4 flex flex-wrap p-3">
      {!loading &&
        itineraries.map((itinerary) => (
          <Itinerary
            itinerary={itinerary}
            key={itinerary.duration}
            isExpanded={expandedId === itinerary.duration}
            onExpand={() => {
              if (itinerary.duration && expandedId !== itinerary.duration) {
                setExpandedId(itinerary.duration);
              } else {
                setExpandedId(0);
              }
            }}
            alerts={alerts}
          />
        ))}
    </div>
  );
};

export default ItinerariesView;
