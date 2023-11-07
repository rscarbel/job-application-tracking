import SingleColumn from "./SingleColumn";

const DoubleColumn = ({
  column1,
  column2,
  applicationCards1,
  applicationCards2,
}) => (
  <div className="w-full sm:w-80 flex flex-col">
    <SingleColumn
      column={column1}
      applicationCards={applicationCards1}
      isHalfSizeOnly={true}
    />
    <SingleColumn
      column={column2}
      applicationCards={applicationCards2}
      isHalfSizeOnly={true}
    />
  </div>
);

export default DoubleColumn;
