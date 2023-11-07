"use client";

import React, { useState, useRef, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import {
  handleDifferentColumnMove,
  handleSameColumnMove,
} from "../../../utils/board";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { updateCardStatus, updateCard, deleteCard } from "../network";
import ColumnRenderer from "./column/ColumnRenderer";
import EditCardFormModal from "../edit-card/EditCardFormModal";
import { EditCardContext } from "./card/EditCardContext.ts";
import NoCards from "./NoCards";

const MILLISECONDS_FOR_MESSAGES = 3000;
const SAVING_LIFE = 10000000;
const MILLISECONDS_IN_A_SECOND = 1000;
const DELAY_FACTOR = 5;

const Board = ({ board }) => {
  const [boardData, setBoardData] = useState(board);
  const [lastSavedBoardData, setLastSavedBoardData] = useState(board);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useRef();
  const saveTimeoutRef = useRef();

  const { columns, applicationCards, columnOrder } = boardData;

  const numberOfCards = Object.keys(applicationCards || {}).length || 0;

  if (!numberOfCards) return <NoCards />;

  // the more cards there are the more expensive updates are, so delay it proportional to their number
  const saveDelayMilliseconds = numberOfCards * DELAY_FACTOR;

  const showSuccess = () => {
    toast.current?.show({
      severity: "success",
      summary: "Saved",
      detail: `Status updated`,
      life: MILLISECONDS_FOR_MESSAGES,
    });
  };

  const showSaving = () => {
    const isAShortTime = saveDelayMilliseconds <= MILLISECONDS_IN_A_SECOND;
    if (isSaving || isAShortTime) return;

    toast.current?.show({
      severity: "info",
      summary: (
        <div className="flex items-center justify-start">
          <div className="flex items-center">
            <ProgressSpinner
              style={{ width: "24px", height: "24px" }}
              strokeWidth="6"
              animationDuration=".5s"
            />
            <p className="ml-2">Saving...</p>
          </div>
        </div>
      ),
      life: SAVING_LIFE,
    });

    setIsSaving(true);
  };

  const showError = (errorMessage) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: errorMessage,
      life: MILLISECONDS_FOR_MESSAGES,
    });
  };

  const showDeleteSuccess = () => {
    toast.current?.show({
      severity: "warn",
      summary: "Application deleted",
      life: MILLISECONDS_FOR_MESSAGES,
    });
  };

  const handleEditClick = (cardData) => {
    setEditingCard(cardData);
    setModalVisible(true);
  };

  const handleSaveChanges = async (updatedData) => {
    try {
      const { response, data } = await updateCard(updatedData);
      const board = data.board;
      if (!response.ok) {
        showError(data.error);
      } else {
        setBoardData(board);
        showSuccess();
      }
    } catch (error) {
      showError(error.message);
    } finally {
      setEditingCard(null);
      setModalVisible(false);
    }
  };

  const handleDelete = async (cardId) => {
    try {
      const { response, data } = await deleteCard(cardId);
      const board = data.board;
      setBoardData(board);
      showDeleteSuccess();
      if (!response.ok) {
        showError(data.error);
      }
    } catch (error) {
      showError(error.message);
    } finally {
      setEditingCard(null);
      setModalVisible(false);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    const startColumn = columns[source.droppableId];
    const updatedColumns =
      source.droppableId === destination.droppableId
        ? handleSameColumnMove(startColumn, source, destination, draggableId)
        : handleDifferentColumnMove(
            startColumn,
            columns[destination.droppableId],
            source,
            destination,
            draggableId
          );

    setBoardData((prevData) => ({
      ...prevData,
      columns: { ...prevData.columns, ...updatedColumns },
    }));

    const cardId = draggableId;
    const newStatus = destination.droppableId;
    const index = destination.index;

    showSaving();
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const { response, data } = await updateCardStatus(
          cardId,
          newStatus,
          index
        );

        toast.current?.clear();
        setIsSaving(false);

        if (!response.ok) {
          showError(data.error);
          setBoardData(lastSavedBoardData);
        } else {
          showSuccess();
          setLastSavedBoardData({
            ...boardData,
            columns: { ...boardData.columns, ...updatedColumns },
          });
        }
      } catch (error) {
        toast.current?.clear();
        setIsSaving(false);
        showError(error.message);
        setBoardData(lastSavedBoardData);
      }
    }, saveDelayMilliseconds);
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <EditCardContext.Provider
      value={{
        onEditClick: handleEditClick,
        editingCardData: editingCard,
        setEditingCardData: setEditingCard,
        isModalVisible,
        setModalVisible,
      }}
    >
      <Toast ref={toast} />

      <EditCardFormModal
        visible={isModalVisible}
        onHide={() => setModalVisible(false)}
        cardData={editingCard}
        onSaveChanges={handleSaveChanges}
        onDelete={handleDelete}
      />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-wrap sm:flex-nowrap lg:justify-center p-4">
          {columnOrder?.map((columnId) => (
            <ColumnRenderer
              key={columnId}
              columnId={columnId}
              columns={columns}
              applicationCards={applicationCards}
            />
          ))}
        </div>
      </DragDropContext>
    </EditCardContext.Provider>
  );
};

export default Board;
