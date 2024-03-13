import * as React from "react";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { AdvertUserModel, DetailAdvertModel } from "@/models/advert-model";
import { Container, Drawer, Grid, useTheme } from "@mui/material";
import useTryFormatter from "@/hooks/useTryFormatter";
import usePastTimeFormat from "@/hooks/usePastTimeFormat";
import { ProfileInfo } from "./profile-info";
import SwipeUpIcon from "@mui/icons-material/SwipeUp";

const drawerBleeding = 56;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const Root = styled("div")(({ theme }) => ({
  height: "100%",
  backgroundColor:
    theme.palette.mode === "light"
      ? grey[100]
      : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? "#fff" : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[900],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}));

export default function MobileAdvertInfo({
  window,
  advert,
}: Props & {
  advert: DetailAdvertModel;
}) {
  const [open, setOpen] = React.useState(false);
  const advertUser = React.useMemo(
    () => (advert.advisor || advert.estate_agent) as AdvertUserModel,
    [advert]
  );

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  const theme = useTheme();

  const tryFormatter = useTryFormatter();
  const time = usePastTimeFormat(advert.created_at, advert);
  // This is used only for the example
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Root>
      <Global
        styles={{
          ".mobile-info-drawer.MuiDrawer-root > .MuiPaper-root": {
            height: `calc(380px - ${drawerBleeding}px)`,
            overflow: "visible",
            
          },

          footer: {
            
            [theme.breakpoints.down("md")]: {
                paddingBottom: `${drawerBleeding}px`,
              },
          },
        }}
      />
      <Drawer
        className="mobile-info-drawer"
        container={container}
        anchor="bottom"
        open={open}
        onClose={toggleDrawer(false)}
        sx={{ display: { md: "none" } }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <StyledBox
          onClick={toggleDrawer(true)}
          onTouchStart={toggleDrawer(true)}
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            right: 0,
            left: 0,
            height: 1,
            borderTop: "1px solid rgba(0,0,0,0.3)",
            borderColor: "grey.300",
          }}
        >
          <Container sx={{ height: 1, mt: 1.4 }}>
            <Grid
              container
              justifyContent="space-between"
              alignItems={"center"}
            >
              <Grid item xs={5}>
                <Typography
                  sx={{
                    typography: "subtitle2",
                    fontWeight: 700,
                    color: "secondary.main",
                    fontSize: "1.12em",
                    textAlign: "left",
                  }}
                >
                  {tryFormatter.format(advert.price)}
                </Typography>
              </Grid>
              <Grid item xs>
                <Typography
                  sx={{
                    typography: "subtitle2",
                    fontWeight: 700,
                    color: "secondary.main",
                    textDecoration: "underline",
                    textAlign: "center",
                    lineHeight: "1",
                  }}
                >
                  <SwipeUpIcon
                    sx={{
                      fontSize: "2rem",
                      display: open ? "none" : "inline-block",
                    }}
                  />
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography
                  sx={{
                    typography: "subtitle2",
                    color: "primary.main",
                    textAlign: "right",
                  }}
                >
                  {time}
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </StyledBox>
        <StyledBox
          sx={{
            px: 0,
            pb: 2,
            height: "100%",
            overflow: "auto",
          }}
        >
          <Container
            sx={{
              height: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ width: 1, maxWidth: { xs: "unset", sm: 320 } }}>
              <ProfileInfo user={advertUser} />
            </Box>
          </Container>
        </StyledBox>
      </Drawer>
    </Root>
  );
}
