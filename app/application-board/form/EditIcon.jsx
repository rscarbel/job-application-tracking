const EditIcon = ({ isVisible = false }) => {
  if (!isVisible) return null;

  return (
    <i
      aria-label="edit"
      tabIndex={0}
      className="pi pi-pencil ml-2"
      style={{ fontSize: "0.7em" }}
    ></i>
  );
};

export default EditIcon;
