// Recognize only our tiny disclosure syntax in parsed Markdown. Other raw HTML
// remains raw and is discarded by ReactMarkdown skipHtml. No general HTML parser.
export function safeDisclosures() {
  return (tree) => {
    function convert(parent) {
      if (!Array.isArray(parent.children)) return;
      const output = [];
      const stack = [output];
      for (const node of parent.children) {
        const opener =
          node.type === 'html' && typeof node.value === 'string'
            ? node.value.match(/^<details>\s*<summary>([^<>\r\n]{1,200})<\/summary>\s*$/)
            : null;
        if (opener && stack.length < 8) {
          const details = {
            type: 'blockquote',
            data: { hName: 'details' },
            children: [
              {
                type: 'paragraph',
                data: { hName: 'summary' },
                children: [{ type: 'text', value: opener[1] }],
              },
            ],
          };
          stack[stack.length - 1].push(details);
          stack.push(details.children);
        } else if (node.type === 'html' && node.value.trim() === '</details>' && stack.length > 1)
          stack.pop();
        else {
          convert(node);
          stack[stack.length - 1].push(node);
        }
      }
      parent.children = output;
    }
    convert(tree);
  };
}
