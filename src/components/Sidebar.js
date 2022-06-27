import React from "react";

export default function Sidebar(props) {
  const noteElements = props.notes.map((note, index) => (
    // Izvlacimo iz propsa pojedinacne notes i njihov index
    <div key={note.id}>
      <div
        className={`title ${
          note.id === props.currentNote.id ? "selected-note" : ""
        }`}
        onClick={() => props.setCurrentNoteId(note.id)}
        // dodeljujemo ID u trenutku kada kliknemo na odredjeni note
      >
        <h4 className="text-snippet">{note.body.split("\n")[0]}</h4>
        {/* Koristimo solit metodu kako bismo kreirali matricu koja u sebi 
            sadrzi elemente body-a, odvojene za svaku novu liniju na koju
            naidjemo, i iz nje uzimamo prvi clan kako bismo ga prikazali kao
            title */}
        <button
          className="delete-btn"
          //
          //   onClick={props.deleteNote}
          //
          // Zbog cega ovo ne radi?
          // Po defaultu, koju god funkciju da dajemo even handleru dobice
          // event kao parametar, tako da kako bismo dali nesto drugo uz
          // to, mozemo da napravimo anonimus function cija jedina linija u
          // ovom slucaju zove deleteNote iz App.js. Na taj nacin uzimamo
          // event koji smo dobili kao deo onClick callback funkcije i dajemo ga
          // u deleteNote funkciji, kao i ID. Dakle :
          onClick={(event) => props.deleteNote(event, note.id)}
        >
          <i className="gg-trash trash-icon"></i>
        </button>
      </div>
    </div>
  ));

  return (
    <section className="pane sidebar">
      <div className="sidebar--header">
        <h3>Notes</h3>
        <button className="new-note" onClick={props.newNote}>
          +
        </button>
      </div>
      {noteElements}
    </section>
  );
}
