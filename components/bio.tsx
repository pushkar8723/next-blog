import Image from 'next/image';
import { siteConfig } from '@/lib/site-config';

export default function Bio() {
    return (
        <div className="flex items-center my-8">
            <Image
                src="/images/profile-pic.jpg"
                alt="Avatar"
                width={64}
                height={64}
                className="rounded-full"
                priority
                sizes="64px"
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
