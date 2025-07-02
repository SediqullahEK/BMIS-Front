export default async function Product({ params }: { params: Promise<{ productId: string }> }) {
    const { productId } = await params;
    return (
        <div className="flex flex-col items-center justify-top h-screen">
            <h1 className="text-4xl font-bold mb-4">Book {productId} Details</h1>
        </div>
    );
}
