'use client';

import StarButton from 'octo-buttons/lib/components/StarButton';

export default function GitHubButton({ repo }: { repo: string }) {
    return (
        <StarButton
            repo={repo}
            width={150}
            fontSize={16}
            formatter={count => Number(count).toLocaleString()}
        />
    );
}
