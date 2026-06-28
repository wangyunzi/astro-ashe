function visit(node, callback) {
  if (!node || typeof node !== "object") return;
  callback(node);

  if (Array.isArray(node.children)) {
    node.children.forEach((child) => visit(child, callback));
  }
}

export default function rehypeImageLoading() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== "element" || node.tagName !== "img") {
        return;
      }

      node.properties = node.properties || {};
      node.properties.loading = node.properties.loading || "lazy";
      node.properties.decoding = node.properties.decoding || "async";
    });
  };
}
