import React, { ComponentProps, ComponentPropsWithRef, ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownElement =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'ul'
  | 'ol'
  | 'li'
  | 'a'
  | 'blockquote'
  | 'strong'
  | 'em'
  | 'code'
  | 'pre'
  | 'hr'
  | 'table';


  type StyledMarkdownProps = ComponentProps<typeof ReactMarkdown> & {
    children: string | ReactNode;
  };

const markdownElementStyles: Partial<Record<MarkdownElement, string>> = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-bold',
  h4: 'text-xl font-bold',
  h5: 'text-lg font-bold',
  h6: 'text-base-content font-bold',
  p: '',
  ul: 'list-disc list-inside',
  ol: 'list-decimal list-inside',
  li: 'mb-1',
  a: 'text-base-content hover:underline',
  blockquote: 'pl-4 border-l-4 border-primary italic',
  strong: 'font-bold',
  em: 'italic',
  code: 'bg-base-300 text-base-content p-1 rounded',
  pre: 'bg-primary p-2 mb-4 overflow-x-auto',
  hr: 'border-t-2 border-primary my-4',
  table: 'table table-zebra bg-base-100 text-base-content',
};
const proseStyles = '';

function filterProps(componentProps: ComponentPropsWithRef<React.ElementType>) {
  const standardProps = ['children', 'className', 'style', 'onClick', 'onMouseEnter', 'onMouseLeave'];
  
  return Object.keys(componentProps)
    .filter(key => standardProps.includes(key))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: componentProps[key as keyof typeof componentProps],
      };
    }, {});
}

function StyledMarkdown({
  children,
  remarkPlugins = [],
  rehypePlugins,
  remarkRehypeOptions,
  className,
  allowedElements,
  disallowedElements,
  components: componentsProps,
}: StyledMarkdownProps) {
  const components = Object.fromEntries(
    Object.entries(markdownElementStyles).map(([tag, classes]) => [
      tag,
      (componentProps: ComponentPropsWithRef<React.ElementType>) => {
        const filteredProps = filterProps(componentProps);

        return React.createElement(tag, {
          className: `${proseStyles} ${classes}`,
          ...filteredProps,
        });
      },
    ])
  );

  const plugins = [...remarkPlugins, remarkGfm];
  
  return (
    <ReactMarkdown
      className={className}
      remarkPlugins={plugins}
      rehypePlugins={rehypePlugins}
      remarkRehypeOptions={remarkRehypeOptions}
      allowedElements={allowedElements}
      disallowedElements={disallowedElements}
      components={
        componentsProps ? { ...componentsProps, ...components } : components
      }
    >
      {children}
    </ReactMarkdown>
  );
}

export default StyledMarkdown;