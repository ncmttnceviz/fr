import Footer from "@/components/navigation/footer";

export default function FooterOnly({ children }: { children: any }) {
    return (
        <>
        <main>
            {children}
        </main>
        <Footer/>
        </>
    )

}