(() => {
  "use strict";

  function startGallery() {
    const navigation = document.querySelector("#demo-navigation");
    const gallery = document.querySelector("#demo-gallery");
    const status = document.querySelector("#demo-status");
    if (!navigation || !gallery || !status) return;

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

    const mediaColumns = [
      { key: "source", label: "Source" },
      { key: "ins", label: "INS" },
      { key: "ours", label: "Ours (NFT)" }
    ];

    function makePlaceholder(label, unavailable = false) {
      const title = `${label} video`;
      const placeholder = element("div", "media-placeholder");
      placeholder.setAttribute("role", "img");
      placeholder.setAttribute(
        "aria-label",
        `${title}. ${unavailable ? "Video unavailable." : "Coming soon."}`
      );
      placeholder.append(
        element("span", "placeholder-title", title),
        element("span", "placeholder-note", unavailable ? "Video unavailable" : "Coming soon")
      );
      return placeholder;
    }

    function makeMediaColumn(media, example, column) {
      const { key, label } = column;
      const figure = element("figure", `comparison-media is-${key}`);
      const surface = element("div", "video-surface");
      const src = mediaURL(media.src);
      figure.append(element("figcaption", "media-label", label), surface);

      if (!src) {
        surface.append(makePlaceholder(label));
        return figure;
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
        surface.replaceChildren(makePlaceholder(label, true));
        status.textContent = `The ${label} video for “${example.title}” could not be loaded.`;
      }, { once: true });
      video.src = src;
      surface.append(video);
      return figure;
    }

    function makeExample(example) {
      const article = element("article", "sample-example");
      article.setAttribute("aria-label", example.title);
      const prompt = element("p", "sample-prompt");
      prompt.append(
        element("strong", "prompt-label", "Instruction: "),
        element("span", "prompt-text", example.instruction.trim() || "Instruction to be added")
      );
      const comparison = element("div", "sample-comparison");
      mediaColumns.forEach((column) => {
        comparison.append(makeMediaColumn(example[column.key], example, column));
      });
      article.append(prompt, comparison);
      return article;
    }

    function makeGroup(category, examples, index) {
      const section = element("section", "sample-group");
      section.id = category.id;
      const heading = element("h3", "", `${index + 1}. ${category.label}`);
      section.append(heading);
      examples.forEach((example) => section.append(makeExample(example)));
      if (!examples.length) {
        section.append(element("p", "gallery-empty", "Video samples coming soon."));
      }
      return section;
    }

    function renderExamples(data) {
      const links = document.createDocumentFragment();
      const groups = document.createDocumentFragment();
      data.categories.forEach((category, index) => {
        const link = element("a", "sample-link", category.label);
        link.href = `#${category.id}`;
        links.append(link);
        groups.append(makeGroup(category, data.examples.filter((example) => example.category === category.id), index));
      });
      navigation.replaceChildren(links);
      gallery.replaceChildren(groups);
      const hasMedia = data.examples.some((example) => mediaColumns.some((column) => mediaURL(example[column.key].src)));
      status.textContent = hasMedia ? "" : "Video samples coming soon.";
    }

    function validateData(data) {
      const nonempty = (value) => typeof value === "string" && value.trim().length > 0;
      const object = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
      const mediaObject = (value) => object(value) && ["src", "poster", "captions"].every((key) => typeof value[key] === "string");
      if (!object(data) || data.schemaVersion !== 2 || !Array.isArray(data.categories) || !Array.isArray(data.examples)) {
        throw new Error("Unsupported examples data.");
      }
      const categoryIds = new Set();
      for (const category of data.categories) {
        if (!object(category) || typeof category.id !== "string" || !/^[a-z][a-z0-9-]*$/.test(category.id) || categoryIds.has(category.id)
          || !nonempty(category.label) || typeof category.description !== "string") {
          throw new Error("Invalid example category.");
        }
        categoryIds.add(category.id);
      }
      const exampleIds = new Set();
      for (const example of data.examples) {
        if (!object(example) || !nonempty(example.id) || exampleIds.has(example.id) || !categoryIds.has(example.category)
          || !nonempty(example.title) || typeof example.instruction !== "string"
          || !mediaColumns.every((column) => mediaObject(example[column.key]))) {
          throw new Error("Invalid example data.");
        }
        exampleIds.add(example.id);
      }
      return data;
    }

    status.textContent = "Loading examples…";
    fetch(new URL("data/examples.json?v=20260926-comparison", document.baseURI))
      .then((response) => {
        if (!response.ok) throw new Error("Examples could not be loaded.");
        return response.json();
      })
      .then(validateData)
      .then(renderExamples)
      .catch(() => {
        navigation.replaceChildren();
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
