import { MAX_CHARACTERS, truncateText } from "../../../../utils/board";

const Description = ({ description, isExpanded, toggle }) => {
  const handleClick = (e) => {
    e.stopPropagation();
    toggle();
  };

  return (
    <div className="mb-2 text-sm text-gray-500">
      {isExpanded ? description : truncateText(description)}
      {description?.length > MAX_CHARACTERS && (
        <span className="text-blue-500 cursor-pointer" onClick={handleClick}>
          {isExpanded ? " see less" : " see more..."}
        </span>
      )}
    </div>
  );
};
export default Description;
