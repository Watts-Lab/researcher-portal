import React from "react";

export function Modal({ id, children }) {

  return(
  <dialog id={id} className="modal">
    <div className="modal-box">
      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onclose}>
          ✕
        </button>
      </form>
      {children}
    </div>
  </dialog>
  )
}
