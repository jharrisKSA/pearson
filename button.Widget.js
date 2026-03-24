class AniHeaderButton extends HTMLElement {
  constructor() {
    super();
    this._agentContact = null;
    this._agent = null;
    this._ani = "";
    this._userFound = null;
    this.attachShadow({ mode: "open" });
  }

  set agentContact(value) {
    console.log("agentContact setter fired:", value);
    this._agentContact = value || null;
    this.watchForChanges();
  }

  get agentContact() {
    return this._agentContact;
  }

  set agent(value) {
    this._agent = value || null;
  }

  get agent() {
    return this._agent;
  }

  connectedCallback() {
    this.render();
  }

  getUserFoundFromTask() {
    const task = this._agentContact?.taskSelected;
    const contact = this._agentContact?.contact;

    return (
      task?.callAssociatedData?.UserFound ??
      task?.interaction?.callAssociatedData?.UserFound ??
      task?.interactionControlCAD?.UserFound ??
      contact?.callAssociatedData?.UserFound ??
      null
    );
  }

  getAniFromTask() {
    const task = this._agentContact?.taskSelected;
    const contact = this._agentContact?.contact;

    return (
      task?.ani ||
      task?.interaction?.ani ||
      task?.customerNumber ||
      contact?.ani ||
      contact?.customerNumber ||
      ""
    );
  }

  watchForChanges() {
    if (!this._agentContact) return;

    if (this._interval) {
      clearInterval(this._interval);
    }

    this._interval = setInterval(() => {
      const ani = this.getAniFromTask();
      const userFound = this.getUserFoundFromTask();

      if (ani !== this._ani) {
        this._ani = ani || "";
        console.log("ANI updated:", this._ani);
      }

      if (userFound !== this._userFound) {
        this._userFound = userFound;
        console.log("UserFound updated:", this._userFound);
        console.log("taskSelected:", this._agentContact?.taskSelected);
        console.log("task CAD:", this._agentContact?.taskSelected?.callAssociatedData);
        console.log("interaction CAD:", this._agentContact?.taskSelected?.interaction?.callAssociatedData);
        console.log("interactionControlCAD:", this._agentContact?.interactionControlCAD);
      }
    }, 500);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          align-items: center;
          height: 64px;
          font-family: inherit;
        }

        button {
          height: 36px;
          padding: 0 12px;
          border: 1px solid #c9c9c9;
          border-radius: 6px;
          background: white;
          cursor: pointer;
        }

        button:hover {
          background: #f4f4f4;
        }
      </style>

      <button id="aniBtn">Show ANI</button>
    `;

    this.shadowRoot.getElementById("aniBtn").addEventListener("click", () => {
      alert(
        `ANI / Phone Number: ${this._ani || "No ANI available"}\nUserFound: ${this._userFound ?? "null"}`
      );
    });
  }

  disconnectedCallback() {
    if (this._interval) {
      clearInterval(this._interval);
    }
  }
}

customElements.define("ani-header-button", AniHeaderButton);
