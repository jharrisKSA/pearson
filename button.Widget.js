class AniHeaderButton extends HTMLElement {
  constructor() {
    super();
    this._ani = "";
    this.attachShadow({ mode: "open" });
  }

  set ani(value) {
    console.log("setter ani fired with:", value);
    this._ani = value || "";
  }

  get ani() {
    return this._ani;
  }

  connectedCallback() {
    this.render();

    setTimeout(() => {
      console.log("after connect this.ani:", this.ani);
      console.log("after connect getAttribute('ani'):", this.getAttribute("ani"));
    }, 1000);
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
      </style>
      <button id="aniBtn" type="button">Show ANI</button>
    `;

    this.shadowRoot.getElementById("aniBtn").addEventListener("click", () => {
      alert(`ANI / Phone Number: ${this.ani || "No ANI available"}`);
    });
  }
}

customElements.define("ani-header-button", AniHeaderButton);
