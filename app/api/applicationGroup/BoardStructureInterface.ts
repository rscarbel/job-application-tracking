import { FormattedCardForBoardInterface } from "@/services/FormattedCardInterface";

export interface BoardStructureInterface {
  applications: { [key: string]: FormattedCardForBoardInterface };
  columns: {
    [key: string]: { id: string; title: string; applicationIds: string[] };
  };
  columnOrder: string[];
}
