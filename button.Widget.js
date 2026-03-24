class AniHeaderButton extends HTMLElement {
  constructor() {
    super();
    this._agentContact = null;
    this._agent = null;
    this._ani = "";
    this._userFound = null;
    this._lastDumpKey = "";
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

  getTask() {
    return this._agentContact?.taskSelected || null;
  }

  getAniFromTask() {
    const task = this.getTask();
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

  getUserFoundFromTask() {
    const task = this.getTask();
    const ac = this._agentContact;
    let result = false;
    
    const candidates = [
      task?.callAssociatedData?.UserFound,
      task?.callAssociatedData?.userFound,
      task?.interaction?.callAssociatedData?.UserFound,
      task?.interaction?.callAssociatedData?.userFound,
      task?.cadVariables?.UserFound,
      task?.cadVariables?.userFound,
      ac?.interactionControlCAD?.UserFound,
      ac?.interactionControlCAD?.userFound
    ];

    for (const value of candidates) {
      if (value !== undefined && value !== null && value !== "") {
        result = value;
      }
    }

    if(result.value){
      return result.value == "true";
    }
    
    return null;
  }

  dumpTaskData(task) {
    const dump = {
      taskKeys: task ? Object.keys(task) : [],
      callAssociatedData: task?.callAssociatedData ?? null,
      interactionCallAssociatedData: task?.interaction?.callAssociatedData ?? null,
      cadVariables: task?.cadVariables ?? null,
      interactionControlCAD: this._agentContact?.interactionControlCAD ?? null,
      contact: this._agentContact?.contact ?? null
    };

    const dumpKey = JSON.stringify(dump);

    if (dumpKey !== this._lastDumpKey) {
      this._lastDumpKey = dumpKey;
      console.log("DEBUG task dump:", dump);
    }
  }

  watchForChanges() {
    if (!this._agentContact) return;

    if (this._interval) {
      clearInterval(this._interval);
    }

    this._interval = setInterval(() => {
      const task = this.getTask();
      const ani = this.getAniFromTask();
      const userFound = this.getUserFoundFromTask();

      if (task) {
        this.dumpTaskData(task);
      }

      if (ani !== this._ani) {
        this._ani = ani || "";
        console.log("ANI updated:", this._ani);
      }

      if (userFound !== this._userFound) {
        this._userFound = userFound;
        console.log("UserFound updated:", this._userFound);
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
      const task = this.getTask();
      console.log("Current task:", task);
      console.log("Current callAssociatedData:", task?.callAssociatedData);
      console.log("Current interaction callAssociatedData:", task?.interaction?.callAssociatedData);
      console.log("Current cadVariables:", task?.cadVariables);
      console.log("Current interactionControlCAD:", this._agentContact?.interactionControlCAD);

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
