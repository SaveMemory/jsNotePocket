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