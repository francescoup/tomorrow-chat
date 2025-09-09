//import { useState } from "react";

export default function SendButton({ onClick, disabled }) {
  console.log("Sono il componente Bottone per inviare");
  return (
    <div>
      <button
        type="button"
        className="{rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-blue }"
        onClick={onClick}
        disabled={disabled}
      >
        Send
      </button>
    </div>
  );
}
