import { createContext, useContext } from "react";

export const EditCardContext = createContext({
  onEditClick: (cardData) => {},
  editingCardData: null,
  setEditingCardData: (data) => {},
  isModalVisible: false,
  setModalVisible: (visible) => {},
});

export const useEditCard = () => {
  return useContext(EditCardContext);
};
