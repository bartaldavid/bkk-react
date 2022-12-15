/* eslint-disable react/react-in-jsx-scope */
interface Props {
  handleDestinationChange: Function;
  label: string;
  coordinates: string;
}

const Destination = ({
  handleDestinationChange,
  label,
  coordinates,
}: Props) => {
  return (
    <button
      onClick={() => handleDestinationChange(coordinates)}
      className="mx-1 border border-solid border-slate-500 p-1 hover:bg-slate-300"
    >
      {label}
    </button>
  );
};

export default Destination;
