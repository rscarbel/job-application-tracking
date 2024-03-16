"use client";

import React, { FunctionComponent, useState, useRef, useEffect } from "react";
import { BoardStructureInterface } from "../api/applicationGroup/BoardStructureInterface";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { handleDifferentColumnMove, handleSameColumnMove } from "./utils";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { updateCardStatus, updateCard, deleteCard } from "../network";
import ColumnRenderer from "./column/ColumnRenderer";
import EditCardFormModal from "../edit-card/EditCardFormModal";
import { EditCardContext } from "./card/EditCardContext";
import NoCards from "./NoCards";
import { IndividualFormattedCardInterface } from "@/services/FormattedCardInterface";
import { ApplicationStatus } from "@prisma/client";

const MILLISECONDS_FOR_MESSAGES = 3000;
const SAVING_LIFE = 10_000_000;
const MILLISECONDS_IN_A_SECOND = 1000;
const DELAY_FACTOR = 5;

interface BoardProps {
  board: BoardStructureInterface;
}
const Board: FunctionComponent<BoardProps> = ({ board }) => {
  const [boardData, setBoardData] = useState<BoardStructureInterface>(board);
  const [lastSavedBoardData, setLastSavedBoardData] =
    useState<BoardStructureInterface>(board);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingCard, setEditingCard] =
    useState<IndividualFormattedCardInterface | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useRef<Toast>(null);
  const saveTimeoutRef = React.useRef<number | null>(null);

  const { columns, applications, columnOrder } = boardData;

  const numberOfCards = Object.keys(applications || {}).length || 0;

  if (!numberOfCards) return <NoCards />;

  // the more cards there are the more expensive updates are, so delay it proportional to their number
  const saveDelayMilliseconds = numberOfCards * DELAY_FACTOR;

  const showSuccess = () => {
    if (!toast.current) return;

    toast.current.show({
      severity: "success",
      summary: "Saved",
      detail: `Status updated`,
      life: MILLISECONDS_FOR_MESSAGES,
    });
  };

  const showSaving = () => {
    const isAShortTime = saveDelayMilliseconds <= MILLISECONDS_IN_A_SECOND;
    if (isSaving || isAShortTime || !toast.current) return;

    toast.current.show({
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

  const showError = (errorMessage: string) => {
    if (!toast.current) return;

    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: errorMessage,
      life: MILLISECONDS_FOR_MESSAGES,
    });
  };

  const showDeleteSuccess = () => {
    if (!toast.current) return;

    toast.current.show({
      severity: "warn",
      summary: "Application deleted",
      life: MILLISECONDS_FOR_MESSAGES,
    });
  };

  const handleEditClick = (
    cardData: IndividualFormattedCardInterface | null
  ) => {
    if (!cardData) return;

    setEditingCard(cardData);
    setModalVisible(true);
  };

  const handleSaveChanges = async (
    updatedData: IndividualFormattedCardInterface
  ) => {
    try {
      const { response, data } = await updateCard(updatedData);
      const board = data.board;
      if (!response.ok) {
        showError(data.error);
      } else {
        setBoardData(board);
        showSuccess();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showError(error.message);
      }
    } finally {
      setEditingCard(null);
      setModalVisible(false);
    }
  };

  const handleDelete = async (applicationId: number) => {
    try {
      const { response, data } = await deleteCard(applicationId);
      const board = data.board;
      setBoardData(board);
      showDeleteSuccess();
      if (!response.ok) {
        showError(data.error);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showError(error.message);
      }
    } finally {
      setEditingCard(null);
      setModalVisible(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    const draggableId = result.draggableId as unknown as ApplicationStatus;
    const newStatus = result.destination
      ?.droppableId as unknown as ApplicationStatus;

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

    const applicationId = draggableId;
    const index = destination.index;

    showSaving();
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    saveTimeoutRef.current = window.setTimeout(async () => {
      try {
        const { response, data } = await updateCardStatus(
          parseInt(applicationId),
          newStatus,
          index
        );

        if (toast.current) {
          toast.current.clear();
        }

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
      } catch (error: unknown) {
        if (toast.current) {
          toast.current.clear();
        }
        setIsSaving(false);
        if (error instanceof Error) {
          showError(error.message);
        }
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
      <Toast content={null} ref={toast} />

      {editingCard && (
        <EditCardFormModal
          visible={isModalVisible}
          onHide={() => setModalVisible(false)}
          cardData={editingCard}
          onSaveChanges={handleSaveChanges}
          onDelete={handleDelete}
        />
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-wrap sm:flex-nowrap lg:justify-center p-4">
          {columnOrder?.map((columnId) => (
            <ColumnRenderer
              key={columnId}
              columnId={columnId}
              columns={columns}
              applications={applications}
            />
          ))}
        </div>
      </DragDropContext>
    </EditCardContext.Provider>
  );
};

export default Board;
