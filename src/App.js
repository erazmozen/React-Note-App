import React from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { data } from "./data";
import Split from "react-split";
// Ovo je eksterni dependency za split pogled na stranici
import { nanoid } from "nanoid";
// Ovo je eksterni dependency za unique string ID generator
import "./index.css";

export default function App() {
  const [notes, setNotes] = React.useState(
    () => JSON.parse(localStorage.getItem("notes")) || []
  );
  //  Ovde deklarisemo notes, to nam je glavi array sa kojim radimo.
  // dodati komentar za drugi deo, nakon ||
  // State se pokrece i uzima vrednost iz lokala, a posto je to string,
  // moramo ga konvertovati preko JSON.parse u array. Ako localStorage
  // vidi da vradnost koju trazimo ne postoji, ne vraca undefined, vec
  // vraca null. Razlika je u tome sto bi undefind srusio program, dok je
  // null false value, samim tim se u state dodeljuje prazna matrice, tacnije
  // sta god je nakon || u ovom slucaju.
  //
  // Sidenote, posto je getItem malo skuplji sto se resursa tice, koristimo
  // lazy State Init, samo ce prvi put state da se update, tacnije samo ce
  // jednom povuci podatke iz lokala

  const [currentNoteId, setCurrentNoteId] = React.useState(
    (notes[0] && notes[0].id) || ""
  );
  // Ovde u state pratimo id, koristimo ga u Sidebar.js kao props
  // kako bismo znali koji je tacno note u pitanju

  React.useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    // console.log(notes[0].body.split("\n"))
    // Ovde koristimo .split method kako bismo vratili matricu koja
    // sadrzi tekst koji se nalazi u body, a koja elemente odvaja svaki
    // put kada naidje na novu liniju (\n), koristi se u Sidebar.js
  }, [notes]);
  // Kako bismo interactovali sa notes array moramo da postavimo sideEffect
  // Prvi parametar je funkcija, a drugi parametar je uslov, kada tacno
  // zelimo da se ovaj sideEffect zapravo izvrsi. U nasem slucaju to je
  // svaki put kada se notes array promeni. Koristimo localStorage jer
  // zelimo da sacuvamo notes array tamo, a JSON.stringify koristimo da
  // notes array pretvorimo u string jer se drugacije ne moze sacuvati
  // u lokalu.

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }
  // Ovo je funkcija kojom pravimo novi note, dajemo joj neke props,
  // u ovom slucaju id, za koji smo uvezli id generator, pa ga i koristimo,
  // kao i body, odnosno props preko kojem mozemo da editujemo sta se
  // renderuje na ekranu. setNotes uzima funkciju koja ima prevNotes za
  // parametar, ona uzima newNotes i dodeljuje mu prevNotes, zatim setuje
  // id za note koji se trenutno edituje.

  function updateNote(text) { 
    setNotes(oldNotes => {
        // Prvo cemo da napravimo novi prazan array
        // Zatim cemo loop kroz taj array
        // ako je id beleske koju upravo gledamo isti kao id u STATE
        // (currentNoteId) to znaci da je to note koji upravo editujemo
        // pa cemo da postacivemo updateovan note na pocetak matrice.
        // Ako nije onda cemo staru belesku da stavimo na kraj matrice
        // Nakon sto se loop zavrsi vraticemo novu matricu

        const newArray = [];
        for (let i = 0; i < oldNotes.length; i++) {
          // Sve dok je i manje od duzine matrice
          const oldNote = oldNotes[i];
          // Cisto radi preglednosti, mozemo da koristimo samo oldNotes[i]
          // dole, ali ovako je lepse (kao..)
          if (oldNote.id === currentNoteId) {
            newArray.unshift({ ...oldNote, body: text });
          } else {
            newArray.push(oldNote);
          }
        }
        return newArray;
      })
  }

  // Bez rasporedjivanja:
  //
  // function updateNote(text) {
  //   setNotes((oldNotes) =>
  //     oldNotes.map((oldNote) => {
  //       return oldNote.id === currentNoteId
  //         ? { ...oldNote, body: text }
  //         : oldNote;
  //     })
  //   );
  // }
  // // Ova funkcija nam sluzi da updatte svaki put kada user pokusa da
  // // edituje neki note. Mapujemo array tako da ostane na istom mestu
  // // nam kom je bio u sidebaru, jer tako map funkcionise.

  function deleteNote(event, noteId) {
    event.stopPropagation()
    // Kada nova ikonica za kantu handleuje click event, ovo sprecava
    // da taj click event ode dalje na parent element
    console.log("deleted note", noteId)
    // Cisto da vidimo da li onClick radi, i da vidimo da li je id koji
    // imamo onaj koji nam treba
    setNotes(oldNote => oldNote.filter((note) => note.id !== noteId))
    // Potrebno nam je da vidimo stare beleske, samim tim immao callback
    // funkciju sa oldNotes kao parametar. Zelimo da vratimo novi array
    // koji nam dolazi iz array.filter metode, ona isto ima callback funkciju
    // sta god da vratimo iz te callback funkcije mora da bude bool
    // kako bismo znali da li je trenutni item iz originalne matrice
    // (onaj koji trenutno gledamo) 
    // treba da bude dodaljen novoj matrici ili ne. Dakle za svaki note
    // koji gledamo zelimo da ukljucimo iteme ciji ID nije isti kao 
    // noteId koji pokusavamo da obrisemo.
    // Dakle ako Note nije onaj na koji smo kliknuli, sve ostaje isto.

    // Sidenote; Ocigledno je, ali za svaki slucaj. Ne editujemo vec 
    // postojecu matricu, vec pravimo novu, editujemo je, i vracamo je u
    // oldNotes preko callback funkcije. 
  }

  function findCurrentNote() {
    return (
      notes.find((note) => {
        return note.id === currentNoteId;
      }) || notes[0]
    );
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={notes}
            currentNote={findCurrentNote()}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {currentNoteId && notes.length > 0 && (
            <Editor currentNote={findCurrentNote()} updateNote={updateNote} />
          )}
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
