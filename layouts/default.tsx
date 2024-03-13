import Footer from "@/components/navigation/footer";
import Header from "@/components/navigation/header";
import HeaderSticky from "@/components/navigation/header-sticky";
import { Box } from "@mui/system";

export default function Default({ children }: { children: any }) {
    return (
        <>
        <HeaderSticky solid/>
        <Header solid/>
        <Box component="main" sx={{marginTop: { xs: 2, md: 0 }}}>

            {children}
        </Box>
        
        <Footer/>
        </>
    )

}