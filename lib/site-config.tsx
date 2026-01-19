import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faJsSquare } from '@fortawesome/free-brands-svg-icons';

export const siteConfig = {
    name: 'Abstracted.in',
    title: 'Pushkar Anand',
    description: 'Passionate JS Developer', // Used for metadata
    descriptionElement: (
        <span className="flex justify-center gap-2">
            Passionate{' '}
            <FontAwesomeIcon
                icon={faJsSquare}
                className="inline h-5"
                aria-label="JavaScript"
            />{' '}
            Developer
        </span>
    ), // Used for display
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.abstracted.in',
    canonicalUrl: process.env.NEXT_PUBLIC_CANONICAL_URL || null,
    author: {
        name: 'Pushkar Anand',
        email: 'pushkar@abstracted.in',
        twitter: '@pushkar8723',
        github: 'pushkar8723',
        linkedin: 'pushkar8723',
    },
    links: {
        facebook: 'https://facebook.com/pushkar8723',
        instagram: 'https://instagram.com/pushkar8723',
        twitter: 'https://twitter.com/pushkar8723',
        github: 'https://github.com/pushkar8723',
        linkedin: 'https://linkedin.com/in/pushkar8723',
    },
};
