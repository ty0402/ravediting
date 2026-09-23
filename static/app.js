(() => {
  "use strict";

  function startGallery() {
    const filters = document.querySelector("#demo-filters");
    const gallery = document.querySelector("#demo-gallery");
    const status = document.querySelector("#demo-status");
    if (!filters || !gallery || !status) return;

    let examples = [];
    let categories = new Map();
    let activeFilter = "all";

    function element(tag, className, text) {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    }

    // Keep media paths relative to this page so GitHub Pages subpaths work.
    // Explicit HTTP(S) links are also supported for externally hosted videos.
    function mediaURL(value) {
      if (typeof value !== "string" || !value.trim()) return null;
      const path = value.trim();
      if (/[\u0000-\u001f\u007f\\]/.test(path)) return null;
      const isWebURL = /^https?:\/\//i.test(path);
      if (!isWebURL && (/^[a-z][a-z\d+.-]*:/i.test(path) || path.startsWith("/"))) {
        return null;
      }
      try {
        const url = new URL(path, document.baseURI);
        return ["https:", "http:"].includes(url.protocol) ? url.href : null;
      } catch {
        return null;
      }
    }

    function makePlaceholder(isTarget, unavailable = false) {
      const title = isTarget ? "Edited video" : "Source video";
      const placeholder = element("div", "media-placeholder");
      placeholder.setAttribute("role", "img");
      placeholder.setAttribute(
        "aria-label",
        `${title}. ${unavailable ? "Video unavailable. " : ""}Sample coming soon.`
      );
      const svgNS = "http://www.w3.org/2000/svg";
      const icon = document.createElementNS(svgNS, "svg");
      icon.setAttribute("viewBox", "0 0 40 40");
      icon.setAttribute("width", "40");
      icon.setAttribute("height", "40");
      icon.setAttribute("fill", "none");
      icon.setAttribute("aria-hidden", "true");
      const frame = document.createElementNS(svgNS, "rect");
      frame.setAttribute("x", "5");
      frame.setAttribute("y", "8");
      frame.setAttribute("width", "30");
      frame.setAttribute("height", "24");
      frame.setAttribute("rx", "6");
      frame.setAttribute("stroke", "currentColor");
      frame.setAttribute("stroke-width", "1.5");
      const play = document.createElementNS(svgNS, "path");
      play.setAttribute("d", "M17 15.5 25 20l-8 4.5v-9Z");
      play.setAttribute("fill", "currentColor");
      icon.append(frame, play);
      placeholder.append(
        icon,
        element("span", "placeholder-title", title),
        element("span", "placeholder-note", unavailable ? "Video unavailable" : "Sample coming soon")
      );
      return placeholder;
    }

    function makeVideoColumn(media, example, isTarget) {
      const label = isTarget ? "Target" : "Source";
      const column = element("div", `video-column${isTarget ? " is-target" : ""}`);
      const surface = element("div", "video-surface");
      const src = mediaURL(media.src);
      column.append(element("div", "video-label", label), surface);

      if (!src) {
        surface.append(makePlaceholder(isTarget));
        return column;
      }

      const video = document.createElement("video");
      video.controls = true;
      video.preload = "none";
      video.playsInline = true;
      video.setAttribute("aria-label", `${label} video: ${example.title}`);
      const poster = mediaURL(media.poster);
      if (poster) video.poster = poster;
      const captions = mediaURL(media.captions);
      if (captions) {
        const track = document.createElement("track");
        track.kind = "captions";
        track.label = "English captions";
        track.srclang = "en";
        track.src = captions;
        video.append(track);
      }
      video.append(document.createTextNode("Your browser does not support video playback."));
      video.addEventListener("play", () => {
        gallery.querySelectorAll("video").forEach((other) => {
          if (other !== video) other.pause();
        });
      });
      video.addEventListener("error", () => {
        video.pause();
        surface.replaceChildren(makePlaceholder(isTarget, true));
        status.textContent = `The ${label.toLowerCase()} video for “${example.title}” could not be loaded.`;
      }, { once: true });
      video.src = src;
      surface.append(video);
      return column;
    }

    function makeCard(example) {
      const category = categories.get(example.category);
      const card = element("article", "demo-card");
      const heading = element("div", "demo-card-heading");
      heading.append(
        element("span", "category-label", category.label),
        element("h3", "", example.title)
      );
      const instruction = element("div", "instruction-line");
      instruction.append(
        element("span", "instruction-label", "Instruction"),
        element("p", "instruction-text", example.instruction.trim() || "Instruction to be added")
      );
      const pair = element("div", "video-pair");
      pair.append(
        makeVideoColumn(example.source, example, false),
        makeVideoColumn(example.target, example, true)
      );
      card.append(heading, instruction, pair);
      return card;
    }

    function renderExamples() {
      gallery.querySelectorAll("video").forEach((video) => video.pause());
      const visible = examples.filter((example) => activeFilter === "all" || example.category === activeFilter);
      const cards = document.createDocumentFragment();
      visible.forEach((example) => cards.append(makeCard(example)));
      if (!visible.length) cards.append(element("p", "gallery-empty", "Examples are coming soon."));
      gallery.replaceChildren(cards);
      filters.querySelectorAll("button").forEach((button) => {
        const selected = button.dataset.filter === activeFilter;
        button.setAttribute("aria-pressed", String(selected));
        button.classList.toggle("is-active", selected);
      });
      const label = activeFilter === "all" ? "All edits" : categories.get(activeFilter).label;
      status.textContent = `${label}: ${visible.length} ${visible.length === 1 ? "example" : "examples"}.`;
    }

    function renderFilters() {
      const fragment = document.createDocumentFragment();
      [{ id: "all", label: "All edits" }, ...categories.values()].forEach((category) => {
        const button = element("button", "filter-button", category.label);
        button.type = "button";
        button.dataset.filter = category.id;
        button.setAttribute("aria-controls", "demo-gallery");
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", () => {
          if (activeFilter === category.id) return;
          activeFilter = category.id;
          renderExamples();
        });
        fragment.append(button);
      });
      filters.replaceChildren(fragment);
    }

    function validateData(data) {
      const nonempty = (value) => typeof value === "string" && value.trim().length > 0;
      const mediaObject = (value) => value && ["src", "poster", "captions"].every((key) => typeof value[key] === "string");
      if (!data || data.schemaVersion !== 1 || !Array.isArray(data.categories) || !Array.isArray(data.examples)) {
        throw new Error("Unsupported examples data.");
      }
      const categoryIds = new Set();
      for (const category of data.categories) {
        if (!category || !nonempty(category.id) || category.id === "all" || categoryIds.has(category.id)
          || !nonempty(category.label) || typeof category.description !== "string") {
          throw new Error("Invalid example category.");
        }
        categoryIds.add(category.id);
      }
      const exampleIds = new Set();
      for (const example of data.examples) {
        if (!example || !nonempty(example.id) || exampleIds.has(example.id) || !categoryIds.has(example.category)
          || !nonempty(example.title) || typeof example.instruction !== "string"
          || !mediaObject(example.source) || !mediaObject(example.target)) {
          throw new Error("Invalid example data.");
        }
        exampleIds.add(example.id);
      }
      return data;
    }

    status.textContent = "Loading examples…";
    fetch(new URL("data/examples.json", document.baseURI))
      .then((response) => {
        if (!response.ok) throw new Error("Examples could not be loaded.");
        return response.json();
      })
      .then(validateData)
      .then((data) => {
        examples = data.examples;
        categories = new Map(data.categories.map((category) => [category.id, category]));
        renderFilters();
        renderExamples();
      })
      .catch(() => {
        filters.replaceChildren();
        gallery.replaceChildren(element("p", "gallery-empty", "Examples are temporarily unavailable. Please try again later."));
        status.textContent = "Examples could not be loaded.";
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startGallery, { once: true });
  } else {
    startGallery();
  }
})();
