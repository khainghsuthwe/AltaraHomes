import Head from 'next/head';

export default function Favorites() {
    return (
        <>
            <Head>
                <title>Favorites | Altara Homes</title>
            </Head>
            <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Favorites</h1>
                    <p className="text-gray-600">
                        This is where you’ll find all the properties you’ve marked as favorites. Start browsing to add listings you love!
                    </p>
                </div>
            </div>
        </>
    );
}
