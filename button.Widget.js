class AniHeaderButton extends HTMLElement {
  constructor() {
    super();
    this._agentContact = null;
    this._agent = null;
    this.attachShadow({ mode: "open" });
  }

  set agentContact(value) {
    console.log("agentContact setter fired with:", value);
    this._agentContact = value || null;
  }

  get agentContact() {
    return this._agentContact;
  }

  set agent(value) {
    console.log("agent setter fired with:", value);
    this._agent = value || null;
  }

  get agent() {
    return this._agent;
  }

  connectedCallback() {
    this.render();

    setTimeout(() => {
      console.log("after connect this.agentContact:", this.agentContact);
      console.log("after connect this.agent:", this.agent);
    }, 1000);
  }

  getAni() {
    const ac = this.agentContact;
    const task = ac?.taskSelected;
    const contact = ac?.contact;

    return (
      task?.ani ||
      task?.interaction?.ani ||
      task?.contact?.ani ||
      task?.customerNumber ||
      contact?.ani ||
      contact?.customerNumber ||
      ""
    );
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

      <button id="aniBtn" type="button">Show ANI</button>
    `;

    this.shadowRoot.getElementById("aniBtn").addEventListener("click", () => {
      const ani = this.getAni();

      console.log("taskSelected:", this.agentContact?.taskSelected);
      console.log("contact:", this.agentContact?.contact);
      console.log("resolved ani:", ani);

      alert(`ANI / Phone Number: ${ani || "No ANI available"}`);
    });
  }
}

customElements.define("ani-header-button", AniHeaderButton);
