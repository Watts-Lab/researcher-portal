import React from "react";

interface ModalProps {
  id: string;
  children: React.ReactNode;
}

export function Modal({ id, children }: ModalProps) {
  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    if (dialog) {
      dialog.close();
    }
  };

  return(
  <dialog id={id} className="modal">
    <div className="modal-box">
      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleClose}>
          ✕
        </button>
      </form>
      {children}
    </div>
  </dialog>
  );
}
