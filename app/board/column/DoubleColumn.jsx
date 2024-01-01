import SingleColumn from "./SingleColumn";

const DoubleColumn = ({ column1, column2, applications1, applications2 }) => (
  <div className="w-full sm:w-80 flex flex-col">
    <SingleColumn
      column={column1}
      applications={applications1}
      isHalfSizeOnly={true}
    />
    <SingleColumn
      column={column2}
      applications={applications2}
      isHalfSizeOnly={true}
    />
  </div>
);

export default DoubleColumn;
