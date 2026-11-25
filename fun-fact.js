const FACT_URL = "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en";

// Returns a safe https URL string
function toSafeLink(value) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

class FunFact extends HTMLElement {
  static get observedAttributes() {
    return ["compact"];
  }

  constructor() {
    super();
    // { text, source, sourceUrl } once loaded
    this.fact = null;
    this.loading = false;
    this.handleNewFact = this.handleNewFact.bind(this);
  }

  connectedCallback() {
    if (this.built) return;
    this.built = true;

    const heading = document.createElement("h3");
    heading.textContent = "Random Fact";

    // The fact
    this.factText = document.createElement("p");

    // Source line
    this.details = document.createElement("p");

    // Internal control that requests a new fact
    this.newFactButton = document.createElement("button");
    this.newFactButton.type = "button";
    this.newFactButton.textContent = "New fact";
    this.newFactButton.addEventListener("click", this.handleNewFact);

    this.status = document.createElement("p");
    this.status.setAttribute("role", "status");

    // Build the subtree off-page then insert it once
    const fragment = document.createDocumentFragment();
    fragment.appendChild(heading);
    fragment.appendChild(this.factText);
    fragment.appendChild(this.details);
    fragment.appendChild(this.newFactButton);
    fragment.appendChild(this.status);
    this.appendChild(fragment);

    this.render();
    this.loadFact();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }

  disconnectedCallback() {
    this.newFactButton.removeEventListener("click", this.handleNewFact);
    this.built = false;
    this.replaceChildren();
  }

  handleNewFact() {
    this.loadFact();
  }

  async loadFact() {
    
    if (this.loading) {
      return;
    }

    this.loading = true;

    this.newFactButton.setAttribute("aria-disabled", "true");
    this.setStatus("Loading a fact…", "loading");

    try {
      const response = await fetch(FACT_URL, {
        headers: { Accept: "application/json" }
      });

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const data = await response.json();

      if (typeof data?.text !== "string" || data.text.trim() === "") {
        throw new Error("Expected fact text in the response.");
      }

      if (!this.built) return;

      this.fact = {
        text: data.text.trim(),
        source: typeof data.source === "string" ? data.source.trim() : "",
        sourceUrl: data.source_url
      };

      this.render();
      this.setStatus("New fact loaded.", "success");
      this.newFactButton.textContent = "New fact";
    } catch (error) {
      console.error("Could not load a fact.", error);
      this.setStatus("Couldn't load a fact. Check your connection and try again.", "error");
      this.newFactButton.textContent = "Try again";
    } finally {
      this.loading = false;
      this.newFactButton.removeAttribute("aria-disabled");
    }
  }

  setStatus(message, state) {
    this.status.textContent = message;
    this.status.dataset.state = state;
  }

  render() {
    if (!this.built) return;

    if (this.fact === null) {
      this.factText.textContent = "No fact loaded yet.";
      this.details.replaceChildren();
    } else {
      this.factText.textContent = this.fact.text;
      this.renderSource();
    }

    this.details.hidden = this.hasAttribute("compact") || this.fact === null;
  }

  renderSource() {
    this.details.replaceChildren();

    if (!this.fact.source) {
      this.details.textContent = "Source not provided.";
      return;
    }

    this.details.appendChild(document.createTextNode("Source: "));
    const link = toSafeLink(this.fact.sourceUrl);

    if (link) {
      const a = document.createElement("a");
      a.href = link;
      a.textContent = this.fact.source;
      this.details.appendChild(a);
    } else {
      this.details.appendChild(document.createTextNode(this.fact.source));
    }
  }
}

customElements.define("fun-fact", FunFact);

// Saved compact/expanded preference

const MODE_KEY = "hw5-fun-fact-mode";
const DEFAULT_MODE = "expanded";
const VALID_MODES = ["compact", "expanded"];

function readMode() {
  try {
    const saved = localStorage.getItem(MODE_KEY);
    return VALID_MODES.includes(saved) ? saved : DEFAULT_MODE;
  } catch (error) {
    console.warn("Could not read the saved fun fact mode.", error);
    return DEFAULT_MODE;
  }
}

function saveMode(mode) {
  try {
    localStorage.setItem(MODE_KEY, mode);
  } catch (error) {
    console.warn("Could not save the fun fact mode.", error);
  }
}

const funFact = document.querySelector("#fun-fact");
const toggleButton = document.querySelector("#fun-fact-toggle");

function applyMode(mode) {
  const isCompact = mode === "compact";
  funFact.toggleAttribute("compact", isCompact);
  toggleButton.setAttribute("aria-pressed", String(isCompact));
  toggleButton.textContent = isCompact ? "Show source" : "Hide source";
}

if (funFact && toggleButton) {
  toggleButton.hidden = false;
  
  applyMode(readMode());

  toggleButton.addEventListener("click", () => {
    const newMode = funFact.hasAttribute("compact") ? "expanded" : "compact";
    applyMode(newMode);
    saveMode(newMode);
  });
}