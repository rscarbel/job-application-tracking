import { createContext, useContext } from "react";
import { IndividualFormattedCardInterface } from "@/services/FormattedCardInterface";

interface EditCardContextInterface {
  onEditClick: (cardData: IndividualFormattedCardInterface | null) => void;
  editingCardData: IndividualFormattedCardInterface | null;
  setEditingCardData: (data: IndividualFormattedCardInterface) => void;
  isModalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

export const EditCardContext = createContext<EditCardContextInterface>({
  onEditClick: (cardData) => {},
  editingCardData: null,
  setEditingCardData: (data) => {},
  isModalVisible: false,
  setModalVisible: (visible) => {},
});

export const useEditCard = () => {
  return useContext(EditCardContext);
};
