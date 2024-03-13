import useMakeLayout from "@/hooks/useMakeLayout";
import { useDispatch } from "react-redux";

import { withAuth, WithAuthGetServerSideProps } from "@/feature/withAuth";
import { useRouter } from "next/router";
import Default from "@/layouts/default";
import { Container } from "@mui/system";
import { Grid, Typography } from "@mui/material";
import PackageCard from "@/components/cards/PackageCard";
import { useTheme } from "@emotion/react";
import { useEffect, useState } from "react";
import BasicListing, { ListingType } from "@/components/listing/basic-listing";
const createListing = (key: string, title: string, houses: any[]) => {
    return {
        key,
        title,
        houses,
        children: ({ houses }: { houses: any[] }) => {
            return (
                <Grid container spacing={2} justifyContent="center">
                    {houses.map((house, index) => (
                        <Grid key={index} item xs={12}>
                            <PackageCard {...house} />
                        </Grid>
                    ))}
                </Grid>
            );
        },
    };
};
export default function Packages({ }: {}) {
    const dispatch = useDispatch();
    const router = useRouter();
    const theme: any = useTheme();
    const [listing, setListing] = useState<ListingType[]>([])
    useEffect(() => {
        setListing([
            createListing("personal", "BİREYSEL", [
                {
                    title: "BAŞLANGIÇ PAKETİ",
                    bgcolor: theme.palette.primary.main,
                    amount: 3,
                    price: 0,
                },
                {
                    title: "ALTIN PAKET",
                    bgcolor: "#F79F1F",
                    amount: 5,
                    price: 0,
                },
                {
                    title: "PLATİN PAKET",
                    bgcolor: "#A0A09E",
                    amount: 7,
                    price: 0,
                }
            ]),
            createListing("corporate", "KURUMSAL", [
                {
                    title: "BAŞLANGIÇ PAKETİ",
                    bgcolor: theme.palette.primary.main,
                    amount: 20,
                    price: 0,
                },
                {
                    title: "ALTIN PAKET",
                    bgcolor: "#F79F1F",
                    amount: 50,
                    price: 0,
                },
                {
                    title: "PLATİN PAKET",
                    bgcolor: "#A0A09E",
                    amount: null,
                    price: 0,
                }
            ])
        ])
    }, [])
    return (
        <Container>
            <Typography
                component="h1"
                typography={"h3"}
                fontWeight={700}
                sx={{
                    mb: 2,
                    textAlign: 'center',
                    fontSize: { xs: "2rem", sm: "3.2rem" },
                }}
            >
                PAKETLER
            </Typography>
            <Typography sx={{ textAlign: 'center' }}>
                Yeni sistemimizin hizmete sunulmasını kutlamak amaçlı <strong>01.01.2023</strong> tarihine kadar bütün üyelerimizin ilan yayına alma limiti <strong>sınırsızdır</strong>.
            </Typography>
            <BasicListing large list={listing} />
        </Container>
    );
}
Packages.getLayout = useMakeLayout(Default)


export const getServerSideProps: WithAuthGetServerSideProps = withAuth(async (context, user, axios) => {
    return { props: {} };
});
