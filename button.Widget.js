class AniHeaderButton extends HTMLElement {
  constructor() {
    super();
    this._ani = "";
    this.attachShadow({ mode: "open" });
  }

  // 👇 THIS IS THE KEY PART
  set ani(value) {
    this._ani = value || "";
    this.updateDisplay();
  }

  get ani() {
    return this._ani;
  }

  connectedCallback() {
    this.render();
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
        console.log("THIS", this);
        
        const value =
          this._ani && !String(this._ani).startsWith("$STORE")
            ? this._ani
            : "No ANI available";

        alert(`ANI / Phone Number: ${value}`);
      });
  }

  updateDisplay() {
    // Optional: log to verify updates
    console.log("ANI updated:", this._ani);
  }
}

customElements.define("ani-header-button", AniHeaderButton);
