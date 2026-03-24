class AniHeaderButton extends HTMLElement {
    constructor() {
        super();
        this._agentContact = null;
        this._agent = null;
        this._ani = "";
        this._userFound = null;
        this._lastDumpKey = "";
        this._btn = null;
        this.attachShadow({
            mode: "open"
        });
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

        button.contact {
 appearance: button;
 background-color: #1899D6;
 border: solid transparent;
 border-radius: 16px;
 border-width: 0 0 4px;
 box-sizing: border-box;
 color: #FFFFFF;
 cursor: pointer;
 display: inline-block;
 font-size: 15px;
 font-weight: 700;
 letter-spacing: .8px;
 line-height: 20px;
 margin: 0;
 outline: none;
 overflow: visible;
 padding: 13px 19px;
 text-align: center;
 text-transform: uppercase;
 touch-action: manipulation;
 transform: translateZ(0);
 transition: filter .2s;
 user-select: none;
 -webkit-user-select: none;
 vertical-align: middle;
 white-space: nowrap;
}

button.contact:after {
 background-clip: padding-box;
 background-color: #1CB0F6;
 border: solid transparent;
 border-radius: 16px;
 border-width: 0 0 4px;
 bottom: -4px;
 content: "";
 left: 0;
 position: absolute;
 right: 0;
 top: 0;
 z-index: -1;
}

button.contact:main, button.contact:focus {
 user-select: auto;
}

button.contact:hover:not(:disabled) {
 filter: brightness(1.1);
}

button.contact:disabled {
 cursor: auto;
}

button.contact:active:after {
 border-width: 0 0 0px;
}

button.contact:active {
 padding-bottom: 10px;
}
     </style>

      <button id="btnAddContact" class="contact" style="display: none">Add Contact</button>
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
