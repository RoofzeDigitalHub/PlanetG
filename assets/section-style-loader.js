(function () {
  const head = document.head;
  if (!head) return;

  const moveLink = (link) => {
    const href = link.getAttribute("href");
    if (!href) return;
    const existing = Array.from(head.querySelectorAll('link[rel="stylesheet"]')).find(
      (el) => el.getAttribute("href") === href
    );
    if (existing) {
      link.remove();
      return;
    }
    head.appendChild(link);
  };

  const moveStyle = (style) => {
    if (head.contains(style)) return;
    head.appendChild(style);
  };

  const processNode = (node) => {
    if (!(node instanceof Element)) return;
    if (node.matches('link[rel="stylesheet"]')) moveLink(node);
    if (node.matches("style")) moveStyle(node);
    node.querySelectorAll('link[rel="stylesheet"]').forEach(moveLink);
    node.querySelectorAll("style").forEach(moveStyle);
  };

  const scan = (root = document) => {
    root.querySelectorAll('link[rel="stylesheet"]').forEach(moveLink);
    root.querySelectorAll("style").forEach(moveStyle);
  };

  scan();

  const mo = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach(processNode);
    });
  });

  mo.observe(document.body, { childList: true, subtree: true });
})();
