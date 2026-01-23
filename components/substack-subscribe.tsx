import { siteConfig } from '@/lib/site-config';

export function SubstackSubscribe() {
    if (!siteConfig.subscribe?.substack) {
        return null;
    }

    return (
        <div className="flex justify-center">
            <iframe
                title="Subscribe to my blog"
                src={`https://${siteConfig.subscribe.substack}.substack.com/embed`}
                width="480"
                height="150"
                className="border-0 rounded-[5px]"
            />
        </div>
    );
}
