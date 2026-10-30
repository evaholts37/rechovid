(() => {
  const script = document.currentScript;
  const root = new URL(script.dataset.root || "./", document.baseURI);
  const container = document.querySelector("[data-repo-nav]");
  const tree = window.REPO_NAV_TREE;

  if (!container || !Array.isArray(tree)) return;

  const canonical = (url) => {
    const parsed = new URL(url, document.baseURI);
    const pathname = parsed.pathname.endsWith("/")
      ? `${parsed.pathname}index.html`
      : parsed.pathname;
    return `${parsed.origin}${pathname}`;
  };

  const currentPage = canonical(document.URL);

  function pageList(pages, depth = 0) {
    const list = document.createElement("ul");
    list.className = depth ? "repo-nav__nested" : "repo-nav__pages";

    for (const page of pages) {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.textContent = page.title;
      link.href = new URL(page.path, root).href;

      if (canonical(link.href) === currentPage) {
        link.setAttribute("aria-current", "page");
      }

      item.append(link);
      if (Array.isArray(page.children) && page.children.length) {
        item.append(pageList(page.children, depth + 1));
      }
      list.append(item);
    }

    return list;
  }

  const nav = document.createElement("nav");
  nav.className = "repo-nav";
  nav.setAttribute("aria-label", "Сторінки репозиторію");

  const heading = document.createElement("a");
  heading.className = "repo-nav__heading";
  heading.textContent = "Rechovid / матеріали";
  heading.href = new URL("index.html", root).href;
  nav.append(heading);

  for (const branch of tree) {
    if (!Array.isArray(branch.pages) || !branch.pages.length) continue;

    const section = document.createElement("section");
    section.className = "repo-nav__branch";
    const label = document.createElement("h2");
    label.className = "repo-nav__label";
    label.textContent = branch.title;
    section.append(label, pageList(branch.pages));
    nav.append(section);
  }

  container.replaceChildren(nav);
})();
