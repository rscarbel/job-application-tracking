import React from "react";
import SingleColumn from "./SingleColumn";
import { FormattedCardForBoardInterface } from "@/services/FormattedCardInterface";
import { ColumnNameEnum } from "@/app/api/applicationGroup/BoardStructureInterface";
import { ApplicationStatusEnum } from "@/utils/databaseTypes";

interface DoubleColumnProps {
  column1: { id: ApplicationStatusEnum; title: ColumnNameEnum };
  column2: { id: ApplicationStatusEnum; title: ColumnNameEnum };
  applications1: FormattedCardForBoardInterface[];
  applications2: FormattedCardForBoardInterface[];
}

const DoubleColumn = ({
  column1,
  column2,
  applications1,
  applications2,
}: DoubleColumnProps) => (
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
