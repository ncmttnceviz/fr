import useCombineSx from "@/hooks/useCombineSx";
import useTryFormatter from "@/hooks/useTryFormatter";
import { alpha, Box, Card, CardContent, Grid, lighten, SxProps, Typography } from "@mui/material";
import { useMemo } from "react";

export default function PackageCard({ sx, bgcolor, title, amount, price }: {
    sx?: SxProps,
    bgcolor: string,
    title: string,
    amount?: string,
    price: number
}) {
    const sxx = useCombineSx(sx);
    const tenMonthPrice = useMemo(() => price * 10, [price])
    const yearPrice = useMemo(() => price * 12, [price])
    const tryFormatter = useTryFormatter({ minimiumFractionDigits: 2, maximumFractionDigits: 2 });
    return (<Card sx={[
        {
            borderRadius: 15,
            color: 'white',
            background: (theme) => `linear-gradient(90deg, ${bgcolor} 0%, ${lighten(bgcolor, 0.25)} 100%)`
        },
        ...sxx
    ]}>
        <CardContent sx={{ px: { xs: 2, sm: 6 } }}>
            <Grid container alignItems={"center"} justifyContent={"space-between"} sx={{ 
                minHeight: 200,
                textAlign: {xs: 'center',md: 'left'},
                
                }}>
                <Grid item xs={12} md={'auto'}>
                    <Typography
                        sx={{
                            typography: 'h4',
                            fontSize: {xs: "1.5rem",sm: '2rem'},
                            fontWeight: 700,
                        }}
                    >{title}</Typography>
                    <Typography
                        sx={{
                            fontSize: '1.3rem',
                            fontWeight: 300,
                        }}
                    >{amount ? `${amount} ilana kadar yayına alma`: `İlan yayına alma limiti sınırsız.`} </Typography>
                </Grid>
                <Grid item xs={12} md={'auto'} sx={{ fontSize: {xs: '1.3rem',sm: '1.7rem'}, }}>
                    <Typography
                        sx={{
                            fontSize: '1em',
                            textAlign: {xs: 'center',md: 'right'},
                            fontWeight: 300,
                            mb: 0,
                        }}
                    >
                        <strong>{tryFormatter.format(price)}</strong>/aylık
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '1em',

                            fontWeight: 300,
                        }}
                    >
                        <Box component="div" sx={{

                            textDecoration: 'line-through',
                            textDecorationThickness: {xs: 1,md: 2},
                            color: 'grey.300',
                            textDecorationColor: 'red',
                            display: 'inline-block',
                            mr: 1,
                            fontWeight: 700
                        }}>
                            {tryFormatter.format(yearPrice)}
                        </Box>

                        <strong>{tryFormatter.format(tenMonthPrice)}</strong>/yıllık
                    </Typography>

                </Grid>

            </Grid>
        </CardContent>
    </Card>)

}