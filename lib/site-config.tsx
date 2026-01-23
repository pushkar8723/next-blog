import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faJsSquare } from '@fortawesome/free-brands-svg-icons';

export const siteConfig = {
    name: 'Abstracted.in',
    title: 'Pushkar Anand',
    subTitle: 'Passionate JS Developer',
    subTitleElement: (
        <span className="flex justify-center gap-2">
            Passionate{' '}
            <FontAwesomeIcon
                icon={faJsSquare}
                className="inline h-5"
                aria-label="JavaScript"
            />{' '}
            Developer
        </span>
    ),
    description: `I have 11+ years of experience in crafting digital experiences through thoughtful code and design. This space on the web is my attempt to share my projects, writings, and ideas with the world.`,
    descriptionElement: (
        <>
            <p>
                I have 11+ years of experience in crafting digital experiences
                through thoughtful code and design.
            </p>
            <p>
                This space on the web is my attempt to share my projects,
                writings, and ideas with the world.
            </p>
        </>
    ),
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.abstracted.in',
    canonicalUrl: process.env.NEXT_PUBLIC_CANONICAL_URL || null,
    author: {
        name: 'Pushkar Anand',
        email: 'pushkar@abstracted.in',
        twitter: '@pushkar8723',
        github: 'pushkar8723',
        linkedin: 'pushkar8723',
    },
    subscribe: {
        substack: 'pushkar8723',
    },
    comments: {
        giscus: {
            enabled: true,
            repo: 'pushkar8723/next-blog',
            repoId: 'R_kgDOQ60PQg',
            category: 'General',
            categoryId: 'DIC_kwDOQ60PQs4C1Q1O',
            mapping: 'og:title',
            strict: '0',
            reactionsEnabled: '1',
            emitMetadata: '0',
            inputPosition: 'top',
            theme: 'preferred_color_scheme',
            lang: 'en',
            loading: 'lazy',
        },
    },
    links: {
        facebook: 'https://facebook.com/pushkar8723',
        instagram: 'https://instagram.com/pushkar8723',
        twitter: 'https://twitter.com/pushkar8723',
        github: 'https://github.com/pushkar8723',
        linkedin: 'https://linkedin.com/in/pushkar8723',
    },
};
