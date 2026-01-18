import { withBasePath } from './lib/base-path';

export function useMDXComponents(components: Record<string, any> = {}) {
    return {
        ...components,
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
