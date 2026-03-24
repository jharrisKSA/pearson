class AniHeaderButton extends HTMLElement {
  constructor() {
    super();
    this._agentContact = null;
    this.attachShadow({ mode: "open" });
  }

  set agentContact(value) {
    this._agentContact = value || null;
    console.log("agentContact setter fired with:", value);
  }

  get agentContact() {
    return this._agentContact;
  }

  connectedCallback() {
    this.render();

    setTimeout(() => {
      console.log("after connect this.agentContact", this.agentContact);
      console.log("after connect taskSelected", this.agentContact?.taskSelected);
      console.log("after connect contact", this.agentContact?.contact);
      console.log("after connect agent", this.agent);
    }, 1000);
  }

  getAni() {
    const task = this.agentContact?.taskSelected;
    const contact = this.agentContact?.contact;

    return (
      task?.ani ||
      task?.interaction?.ani ||
      task?.contact?.ani ||
      task?.customerNumber ||
      task?.destination ||
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
      const task = this.agentContact?.taskSelected;
      const contact = this.agentContact?.contact;
      const ani = this.getAni();
      const agent = this.agent;

      console.log("taskSelected:", task);
      console.log("contact:", contact);
      console.log("resolved ani:", ani);
      console.log("agent:", agent);
      
      alert(`ANI / Phone Number: ${ani || "No ANI available"}`);
    });
  }
}

customElements.define("ani-header-button", AniHeaderButton);
