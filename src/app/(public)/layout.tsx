import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex flex-col gap-4 px-4">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}