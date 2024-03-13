import { Card, CardContent, Container, Typography } from "@mui/material";
import Default from "./default";

export default function Policy({ children,title }: { children: any,title: string }) {
    return (
        <Default>
            <Container sx={{mb: 3}}>
                <Typography
                    component="h1"
                    typography={"h3"}
                    fontWeight={700}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: { xs: "2rem", sm: "3.2rem" },
                        mb: 2,
                    }}
                >
                    {title}

                </Typography>
                <Card>
                    <CardContent sx={{typography: 'body2'}}>
                        
                        {children}
                    </CardContent>
                </Card>
            </Container>
        </Default>

    )

}