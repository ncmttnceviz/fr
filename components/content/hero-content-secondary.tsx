import { Container, Grid, SvgIcon, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Link from "next/link";
import QuickSearchForm from "../form/quick-search-form";
import MapsHomeWorkOutlinedIcon from "@mui/icons-material/MapsHomeWorkOutlined";
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import TimeToLeaveOutlinedIcon from '@mui/icons-material/TimeToLeaveOutlined';
import TwoWheelerOutlinedIcon from '@mui/icons-material/TwoWheelerOutlined';
export default function HeroContentSecondary() {
  return (
    <Box
      sx={{
        width: 1,
        height: 1,
        flexGrow: 1,
        flexShrink: 0,
        display: { xs: "flex", sm: "block" },
        alignItems: "center",
      }}
    >
      <Container sx={{ color: (theme) => theme.palette.common.white }}>
        <Grid container justifyContent="center" rowSpacing={5.5}>

          <Grid item xs={12} sm={"auto"}>
            <QuickSearchForm />
          </Grid>
          <Grid item xs={12}>
            <Grid
              justifyContent="center"
              container
              
              columnSpacing={{xs: 0,sm: 9}}
              rowSpacing= {{xs: 4}}
            >
              <Grid item xs={6} sm={"auto"} sx={{justifyContent: 'center',display: 'flex'}}>
                <IconLink
                  title="Konut"
                  href="/ilanlar/emlak/konut"
                  icon={<MapsHomeWorkOutlinedIcon />}
                />
              </Grid>
              <Grid item xs={6} sm={"auto"} sx={{justifyContent: 'center',display: 'flex'}}>
                <IconLink
                  title="Mobilya"
                  href="/ilanlar/mobilya"
                  icon={<BusinessOutlinedIcon />}
                />
              </Grid>
              <Grid item xs={6} sm={"auto"} sx={{justifyContent: 'center',display: 'flex'}}>
                <IconLink
                  title="Otomobil"
                  href="/ilanlar/vasita/otomobil"
                  icon={<TimeToLeaveOutlinedIcon />}
                />
              </Grid>
              <Grid item xs={6} sm={"auto"} sx={{justifyContent: 'center',display: 'flex'}}>
                <IconLink
                  title="Motosiklet"
                  href="/ilanlar/vasita/motosiklet"
                  icon={<TwoWheelerOutlinedIcon />}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

const IconLink = ({
  icon,
  title,
  href,
}: {
  icon: any;
  title: string;
  href: string;
}) => {
  return (
    <Link href={href} passHref>
      <Box
        component="a"
        sx={{
          color: "white",
          textDecoration: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SvgIcon
          sx={{ overflow: "visible", fontSize: { xs: "2.5rem", sm: "2.5rem" },
          "@media(max-width: 450px)": {
            fontSize: "1.5rem"
          },
        }}
        >
          {icon}
        </SvgIcon>
        <Typography sx={{ fontWeight: 600, fontSize: {xs: "1rem",sm:"1.5rem"}, mt: 0 }}>
          {title}
        </Typography>
      </Box>
    </Link>
  );
};
