import Image from 'next/image';
import { siteConfig } from '@/lib/site-config';
import { withBasePath } from '@/lib/base-path';

export default function Bio() {
    return (
        <div className="flex items-center my-8">
            <Image
                src={withBasePath('/images/profile-pic.jpg')}
                alt="Avatar"
                width={64}
                height={64}
                className="rounded-full"
                priority
                sizes="64px"
                aria-label="Profile Picture"
            />
            <div className="ml-4">
                <p className="text-2xl font-bold text-foreground">
                    {siteConfig.title}
                </p>
                <p className="text-l text-muted-foreground">
                    {siteConfig.descriptionElement}
                </p>
            </div>
        </div>
    );
}
