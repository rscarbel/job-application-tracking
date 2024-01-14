import React, { FC, MouseEvent } from "react";
import { MAX_CHARACTERS, truncateText } from "../utils";

interface DescriptionProps {
  description: string;
  isExpanded: boolean;
  toggle: () => void;
}

const Description: FC<DescriptionProps> = ({
  description,
  isExpanded,
  toggle,
}) => {
  const handleClick = (e: MouseEvent<HTMLSpanElement>) => {
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
