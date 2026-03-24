class AniHeaderButton extends HTMLElement {
  static get observedAttributes() {
    return ["ani"];
  }

  constructor() {
    super();
    this._ani = "";
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "ani") {
      this._ani = newValue || "";
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          align-items: center;
          height: 64px;
          box-sizing: border-box;
          font-family: inherit;
        }

        button {
          height: 36px;
          padding: 0 12px;
          border: 1px solid #c9c9c9;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          font-size: 14px;
        }

        button:hover {
          background: #f4f4f4;
        }
      </style>

      <button id="aniBtn" type="button">Show ANI</button>
    `;

    this.shadowRoot.getElementById("aniBtn").addEventListener("click", () => {
      const value = this._ani && !this._ani.startsWith("$STORE")
        ? this._ani
        : "No ANI available";

      alert(`ANI / Phone Number: ${value}`);
    });
  }
}

customElements.define("ani-header-button", AniHeaderButton);
