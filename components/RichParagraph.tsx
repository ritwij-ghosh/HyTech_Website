type RichLink = {
  href: string;
  label: string;
};

type RichParagraphProps = {
  text: string;
  links?: RichLink[];
  className?: string;
};

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

export default function RichParagraph({ text, links = [], className }: RichParagraphProps) {
  if (!links.length) {
    return <p className={className}>{text}</p>;
  }

  const nodes: React.ReactNode[] = [];
  let remaining = text;

  links.forEach((link, index) => {
    const at = remaining.toLowerCase().indexOf(link.label.toLowerCase());
    const external = isExternal(link.href);
    const anchor = (
      <a
        key={`${link.href}-${index}`}
        href={link.href}
        className="text-volt underline-offset-4 hover:underline"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {at === -1 ? link.label : remaining.slice(at, at + link.label.length)}
      </a>
    );

    if (at === -1) {
      nodes.push(anchor);
      return;
    }

    if (at > 0) nodes.push(remaining.slice(0, at));
    nodes.push(anchor);
    remaining = remaining.slice(at + link.label.length).replace(/^\s+\./, ".");
  });

  if (remaining) nodes.push(remaining);

  return <p className={className}>{nodes}</p>;
}
