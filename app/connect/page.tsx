import { redirect } from 'next/navigation';
import { corsair } from '@/lib/corsair';

export default async function ConnectPage({
    searchParams,
}: {
    searchParams: Promise<{ state?: string }>;
}) {
    const { state } = await searchParams;
    if (!state) {
        return <p>Missing state.</p>;
    }

    const { oauthUrl } = await corsair.manage.connect.resolve(state);
    redirect(oauthUrl);
}