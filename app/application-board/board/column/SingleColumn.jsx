import { ScrollTop } from "primereact/scrolltop";
import ApplicationCard from "../card/ApplicationCard";
import { Droppable } from "@hello-pangea/dnd";

const SingleColumn = ({ column, applicationCards, isHalfSizeOnly = false }) => {
  const maxColumnHeight = isHalfSizeOnly ? "max-h-[50vh]" : "max-h-[80vh]";
  return (
    <div className={`w-full sm:w-80 p-2`}>
      <h2 className="mb-4 text-lg font-bold text-gray-700">{column.title}</h2>
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`bg-white rounded p-6 ${maxColumnHeight} overflow-y-auto concave-container-shadow`}
          >
            {applicationCards.map((applicationCard, index) => (
              <ApplicationCard
                key={String(applicationCard.cardId)}
                {...applicationCard}
                index={index}
                status={column.title.toLowerCase()}
              />
            ))}
            {provided.placeholder}
            <ScrollTop
              target="parent"
              threshold={100}
              className="w-2rem h-2rem border-round-md bg-primary"
              icon="pi pi-arrow-up text-base"
            />
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default SingleColumn;
