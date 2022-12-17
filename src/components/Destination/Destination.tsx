/* eslint-disable react/react-in-jsx-scope */
interface Props {
  label: string;
  coordinates: string;
  getData: (destinationCoordinates: string) => void;
}

const Destination = ({ label, coordinates, getData }: Props) => {
  return (
    <button
      onClick={() => {
        getData(coordinates);
      }}
      className="border border-solid border-slate-500 p-2 hover:bg-slate-300"
    >
      {label}
    </button>
  );
};

export default Destination;
