import { Tooltip } from "primereact/tooltip";

const Undo = ({ onClick, originalValue, newValue, className = "" }) => {
  const hasDataChanged = originalValue !== newValue;
  if (!hasDataChanged) return null;

  return (
    <>
      <i
        aria-label="undo"
        tabIndex={0}
        className={`pi pi-undo mt-1 cursor-pointer justify-self-start ${className}`}
        onClick={onClick}
      ></i>
      <Tooltip
        target=".pi.pi-undo"
        tooltipOptions={{ position: "top" }}
        content="Undo"
      />
    </>
  );
};

export default Undo;
