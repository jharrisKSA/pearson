class AniHeaderButton extends HTMLElement {
  constructor() {
    super();
    this._agentContact = null;
    this._agent = null;
    this._ani = "";
    this._userFound = null;
    this._lastDumpKey = "";
    this._btn = null;
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

  getIsCallActive() {
    const task = this.getTask();
    return !!(task && !task.isTerminated);
  }

  getAniFromTask() {
    const task = this.getTask();
    const contact = this._agentContact?.contact;

    return (
      task?.ani ||
      task?.interaction?.ani ||
      task?.customerNumber ||
      task?.phoneNumber ||
      contact?.ani ||
      contact?.customerNumber ||
      ""
    );
  }

  getUserFoundFromTask() {
    const task = this.getTask();
    const ac = this._agentContact;

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
      if (value === undefined || value === null || value === "") {
        continue;
      }

      if (typeof value === "boolean") {
        return value;
      }

      if (typeof value === "string") {
        return value.toLowerCase() === "true";
      }

      if (typeof value === "object" && value.value !== undefined && value.value !== null) {
        return String(value.value).toLowerCase() === "true";
      }
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
      const isCallActive = this.getIsCallActive();
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

      if (!isCallActive) {
        this._ani = "";
        this._userFound = null;
        if (this._btn) {
          this._btn.style.display = "none";
        }
        return;
      }

      if (this._btn) {
        this._btn.style.display = this._userFound === false ? "inline-block" : "none";
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

        .contact-button {
  --white: #ffe7ff;
  --bg: #080808;
  --radius: 100px;
  outline: none;
  cursor: pointer;
  border: 0;
  position: relative;
  border-radius: var(--radius);
  background-color: var(--bg);
  transition: all 0.2s ease;
  box-shadow:
    inset 0 0.3rem 0.9rem rgba(255, 255, 255, 0.3),
    inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.7),
    inset 0 -0.4rem 0.9rem rgba(255, 255, 255, 0.5),
    0 3rem 3rem rgba(0, 0, 0, 0.3),
    0 1rem 1rem -0.6rem rgba(0, 0, 0, 0.8);
}
.contact-button .wrap {
  font-size: 25px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  padding: 32px 45px;
  border-radius: inherit;
  position: relative;
  overflow: hidden;
}
.contact-button .wrap p span:nth-child(2) {
  display: none;
}
.contact-button:hover .wrap p span:nth-child(1) {
  display: none;
}
.contact-button:hover .wrap p span:nth-child(2) {
  display: inline-block;
}
.contact-button .wrap p {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  transition: all 0.2s ease;
  transform: translateY(2%);
  mask-image: linear-gradient(to bottom, white 40%, transparent);
}
.contact-button .wrap::before,
.contact-button .wrap::after {
  content: "";
  position: absolute;
  transition: all 0.3s ease;
}
.contact-button .wrap::before {
  left: -15%;
  right: -15%;
  bottom: 25%;
  top: -100%;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.12);
}
.contact-button .wrap::after {
  left: 6%;
  right: 6%;
  top: 12%;
  bottom: 40%;
  border-radius: 22px 22px 0 0;
  box-shadow: inset 0 10px 8px -10px rgba(255, 255, 255, 0.8);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.3) 0%,
    rgba(0, 0, 0, 0) 50%,
    rgba(0, 0, 0, 0) 100%
  );
}
.contact-button:hover {
  box-shadow:
    inset 0 0.3rem 0.5rem rgba(255, 255, 255, 0.4),
    inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.7),
    inset 0 -0.4rem 0.9rem rgba(255, 255, 255, 0.7),
    0 3rem 3rem rgba(0, 0, 0, 0.3),
    0 1rem 1rem -0.6rem rgba(0, 0, 0, 0.8);
}
.contact-button:hover .wrap::before {
  transform: translateY(-5%);
}
.contact-button:hover .wrap::after {
  opacity: 0.4;
  transform: translateY(5%);
}
.contact-button:hover .wrap p {
  transform: translateY(-4%);
}
.contact-button:active {
  transform: translateY(4px);
  box-shadow:
    inset 0 0.3rem 0.5rem rgba(255, 255, 255, 0.5),
    inset 0 -0.1rem 0.3rem rgba(0, 0, 0, 0.8),
    inset 0 -0.4rem 0.9rem rgba(255, 255, 255, 0.4),
    0 3rem 3rem rgba(0, 0, 0, 0.3),
    0 1rem 1rem -0.6rem rgba(0, 0, 0, 0.8);
}

      </style>

      <button id="btnAddContact" class="contact-button" style="display: none">Add Contact</button>
    `;

    this._btn = this.shadowRoot.getElementById("btnAddContact");

    this._btn.addEventListener("click", () => {
    const phone = this._ani || "";

    if (!phone) {
      console.warn("No ANI available to pass");
      return;
    }
      
    const cleanPhone = phone.replace(/[^\d]/g, "");

      return alert(`TODO: Open Business Central Add Contact - ${cleanPhone}`);
      // TODO: Update business central url below
      const url = `https://your-system.com/add-contact?phone=${encodeURIComponent(cleanPhone)}`;
      window.open(url, "_blank");
  });
}

  disconnectedCallback() {
    if (this._interval) {
      clearInterval(this._interval);
    }
  }
}

customElements.define("ani-header-button", AniHeaderButton);
