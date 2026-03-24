class AniHeaderButton extends HTMLElement {
  constructor() {
    super();
    this._ani = "";
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.initialize();
  }

  async initialize() {
    try {
      // If your environment exposes the Desktop SDK globally, use it here.
      // If bundling later, import { Desktop } from '@wxcc-desktop/sdk'
      if (!window.Desktop) {
        console.warn("Desktop SDK not found on window. Falling back to property binding only.");
        return;
      }

      await window.Desktop.config.init();

      const tasks = await window.Desktop.actions.getTasks();
      const selectedTask = Array.isArray(tasks)
        ? tasks.find(t => t.isSelected) || tasks[0]
        : null;

      this._ani =
        selectedTask?.ani ||
        selectedTask?.interaction?.ani ||
        selectedTask?.data?.ani ||
        "";

      console.log("Initial ANI:", this._ani);

      window.Desktop.agentContact.addEventListener("taskSelected", (event) => {
        const task = event?.detail || {};
        this._ani =
          task?.ani ||
          task?.interaction?.ani ||
          task?.data?.ani ||
          "";
        console.log("Updated ANI from taskSelected:", this._ani);
      });
    } catch (err) {
      console.error("Failed to initialize ANI widget:", err);
    }
  }

  set ani(value) {
    this._ani = value || "";
  }

  get ani() {
    return this._ani;
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
      console.log("this.ani property:", this.ani);
      console.log("window.Desktop:", window.Desktop);
      console.log("window.agentx:", window.agentx);
      console.log("window.callingClient:", window.callingClient);
      console.log("window.webexService:", window.webexService);
      
      alert(`ANI / Phone Number: ${this._ani || "No ANI available"}`);
    });
  }
}

customElements.define("ani-header-button", AniHeaderButton);
