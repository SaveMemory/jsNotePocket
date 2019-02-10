document.querySelector("#addNewNote").addEventListener("click", () => {
    Notepad.addNewNote();
});
window.addEventListener("resize", () => {
    Notepad.onResize();
});

// obiekt notatnika
let Notepad = {
    noteContainer: document.querySelector("#notesContainer"),
    notes: [],

    noteDefaultColor: "yellow",

    colorList: ["red", "green", "blue", "yellow"],

    //dodawanie notatki
    addNewNote: function () {
        let date = new Date();
        let dateString =
            date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        this.notes.push(
            new Note(false, "", "", dateString, false, this.noteDefaultColor)
        );
        this.fillColumns();

        Notepad.saveNotes();
    },
    savingInterval: {},
    savingFrequency: 1500,

    // zapisywanie notatek w local storage
    saveNotes: function () {
        let tmp = [];
        this.notes.forEach(el => {
            tmp.push(el.getData());
        });
        window.localStorage.notes = JSON.stringify(tmp);
        console.log("Notes saved");
    },
    // ładowanie notatek z local storage
    loadNotes: function () {
        if (window.localStorage.notes) {
            notesData = JSON.parse(window.localStorage.notes);
            notesData.forEach(el => {
                this.notes.push(
                    new Note(true, el.title, el.content, el.date, el.pin, el.color)
                );
            });
            this.createNoteColumns();
        } else console.log("notes not found");
    },
    nCMinSize: 250, //Minimum size of NoteColumn
    nColumns: [],
    // tworzenie kolumn z notatkami
    createNoteColumns: function () {
        while (this.noteContainer.firstChild)
            this.noteContainer.removeChild(this.noteContainer.firstChild);
        this.nColumns = [];

        let cNumber = parseInt(this.noteContainer.offsetWidth / this.nCMinSize); //Number of columns
        let cSize = 100 / cNumber; //single column size

        for (let i = 0; i < cNumber; i++) {
            let newColumn = document.createElement("div");
            newColumn.classList.add("noteColumn");
            newColumn.style.width = cSize + "%";
            this.noteContainer.appendChild(newColumn);
            this.nColumns.push(newColumn);
        }
        this.fillColumns();
    },

    //wypełnianie kolumn
    fillColumns: function () {
        this.nColumns.forEach(el => {
            while (el.firstChild) el.removeChild(el.firstChild);
        });

        let lowestColumn = () => {
            let minIndex = 0;
            let minHeight = this.nColumns[0].offsetHeight;

            for (let i = 1; i < this.nColumns.length; i++) {
                minIndex = this.nColumns[i].offsetHeight <= minHeight ? i : minIndex;
            }

            return minIndex;
        };

        this.notes.forEach(note => {
            if (!note.pin && note.imported)
                this.nColumns[lowestColumn()].appendChild(note.element);
        });

        this.notes.forEach(note => {
            if (note.pin && note.imported)
                this.nColumns[lowestColumn()].appendChild(note.element);
        });

        this.notes.forEach(note => {
            if (!note.imported)
                this.nColumns[lowestColumn()].appendChild(note.element);
        });
    },
    onResize: function () {
        let cNumber = parseInt(this.noteContainer.offsetWidth / this.nCMinSize);
        if (cNumber != this.nColumns.length) this.createNoteColumns();
    }
};

//konstruktor notatki
let Note = function (importing, title, content, date, pin, color) {
    //ustawianie propek, tworzenie elementów html
    this.imported = importing;

    this.isFocused = false;
    this.isMouseOver = true;

    this.pin = pin;
    this.color = color;

    this.element = document.createElement("div");
    this.element.classList.add("note", "noteEnter");
    this.element.classList.add(this.color);
    setTimeout(() => {
        this.element.classList.remove("noteEnter");
    }, 100);

    this.titleBar = document.createElement("div");
    this.titleBar.classList.add("titleBar");

    this.title = document.createElement("div");
    this.title.classList.add("nTitle");

    this.title.contentEditable = true;

    this.title.addEventListener("focus", e => {
        this.onEdit(e);
    });
    this.title.addEventListener("blur", () => {
        this.onFocusOut();
    });

    this.titleBar.appendChild(this.title);

    this.element.appendChild(this.titleBar);

    this.content = document.createElement("div");
    this.content.classList.add("noteContent");

    this.content.contentEditable = true;

    this.content.addEventListener("focus", e => {
        this.onEdit(e);
    });
    this.content.addEventListener("blur", () => {
        this.onFocusOut();
    });

    this.element.appendChild(this.content);

    this.noteDate = document.createElement("div");
    this.noteDate.classList.add("ndate");

    this.noteDate.innerHTML = date;
    this.element.appendChild(this.noteDate);

    this.optionsBar = document.createElement("div");
    this.optionsBar.classList.add("optionsBar");

    this.pinElement = document.createElement("div");
    this.pinElement.classList.add("fa", "fa-thumb-tack", "opBtn", "pin");
    if (this.pin) this.pinElement.classList.add("active");
    this.pinElement.addEventListener("click", () => {
        this.pinUnpin();
    });

    this.optionsBar.appendChild(this.pinElement);

    this.colorElement = document.createElement("div");
    this.colorElement.classList.add("opBtn", "color", this.color);
    this.colorElement.innerHTML = " ";
    this.colorMenu = document.createElement("div");
    this.colorMenu.classList.add("colorMenu");
    this.colorElement.appendChild(this.colorMenu);
    this.setColorMenu();
    this.optionsBar.appendChild(this.colorElement);

    this.deleteBtn = document.createElement("div");
    this.deleteBtn.classList.add("fa", "fa-trash-o", "deleteBtn");
    this.deleteBtn.addEventListener("click", () => {
        this.delete();
    });
    this.element.appendChild(this.deleteBtn);
    this.element.appendChild(this.optionsBar);

    this.title.innerHTML = title;
    this.content.innerHTML = content;

    this.title.classList.add("edit");
    this.optionsBar.classList.add("visible");
    this.deleteBtn.classList.add("visible");
};