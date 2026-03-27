import { siteConfig } from '@/lib/site-config';

export function SubstackSubscribe() {
    if (!siteConfig.subscribe?.substack) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <p className="text-center">
                If you liked this article, consider subscribing to my
                newsletter. I don&apos;t write very often. But if you subscribe,
                I will use &nbsp;
                <a
                    className="link"
                    href="https://substack.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    substack
                </a>
                &nbsp;to send you an email when I publish a new article.
            </p>
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
