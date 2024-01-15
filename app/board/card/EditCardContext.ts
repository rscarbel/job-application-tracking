import { createContext, useContext } from "react";
import { IndividualFormattedCardInterface } from "@/services/FormattedCardInterface";

export const EditCardContext = createContext({
  onEditClick: (cardData: IndividualFormattedCardInterface) => {},
  editingCardData: null,
  setEditingCardData: (data: IndividualFormattedCardInterface) => {},
  isModalVisible: false,
  setModalVisible: (visible: boolean) => {},
});

export const useEditCard = () => {
  return useContext(EditCardContext);
};
