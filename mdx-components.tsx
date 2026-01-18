import Link from 'next/link';
import { withBasePath } from './lib/base-path';

export function useMDXComponents(components: Record<string, any> = {}) {
    return {
        ...components,
        a: (props: any) => {
            const href =
                props.href && props.href.startsWith('/')
                    ? withBasePath(props.href)
                    : props.href;

            // External links
            if (href?.startsWith('http')) {
                return (
                    // eslint-disable-next-line jsx-a11y/anchor-has-content
                    <a
                        {...props}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                    />
                );
            }

            // Internal links
            return <Link {...props} href={href} />;
        },
        img: (props: any) => {
            const src =
                props.src && props.src.startsWith('/')
                    ? withBasePath(props.src)
                    : props.src;
            // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
            return <img {...props} src={src} />;
        },
    };
}
