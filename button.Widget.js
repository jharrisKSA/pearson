class AniHeaderButton extends HTMLElement {
  constructor() {
    super();
    this._agentContact = null;
    this._ani = "";
    this.attachShadow({ mode: "open" });
  }

  set agentContact(value) {
    console.log("agentContact setter fired:", value);
    this._agentContact = value;

    // Start watching when we first get it
    this.watchForChanges();
  }

  get agentContact() {
    return this._agentContact;
  }

getUserFound() {
  const task = this.agentContact?.taskSelected;

  return (
    task?.callAssociatedData?.UserFound ??
    task?.interaction?.callAssociatedData?.UserFound ??
    null
  );
}
  
  connectedCallback() {
    this.render();
  }

  watchForChanges() {
    if (!this._agentContact) return;

    // Polling approach (safe + simple)
    this._interval && clearInterval(this._interval);

    this._interval = setInterval(() => {
      const task = this._agentContact?.taskSelected;
      const contact = this._agentContact?.contact;

      const ani =
        task?.ani ||
        task?.interaction?.ani ||
        task?.customerNumber ||
        contact?.ani ||
        contact?.customerNumber ||
        "";

      if (ani && ani !== this._ani) {
        this._ani = ani;
        console.log("ANI updated:", this._ani);
        console.log("UserFound:", this.userFound);
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

    this.shadowRoot.getElementById("aniBtn")
      .addEventListener("click", () => {
          const userFound = this.getUserFound();

        console.log("userFound", userFound);
        alert(`ANI / Phone Number: ${this._ani || "No ANI available"}`);
      });
  }
}

customElements.define("ani-header-button", AniHeaderButton);
