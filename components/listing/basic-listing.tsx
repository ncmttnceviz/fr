import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useState, FC, useEffect } from "react";

export interface ListingType {
  title: string;
  key: string;
  children: FC<{ houses: any[] }>;
  houses: any[];
}
export default function BasicListing(props: { list: ListingType[] ,large?:boolean }) {
  const { list } = props;
  const [currentList, setCurrentList] = useState<ListingType>(list[0]);
  useEffect(() => setCurrentList(list[0]), [list])
  return (
    <section>
      <Box
        component="nav"
        sx={{
          mt: {xs: 3,sm:6},
          mb: {xs: 4, sm: 8},
          display: "flex",
          gap: { xs: 2, sm: 10 },
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {list.map((o) => (
          <Typography
            key={o.key}
            onClick={() => setCurrentList(o)}
            sx={[
              {
                fontSize: "0.85em",
                color: "grey.500",
                "&:hover": {
                  cursor: "pointer",
                },
                "&::after": {
                  width: 1,

                  height: 2,
                  content: '""',
                  display: "block",
                },
              },
              !!props.large && {
                fontSize: {xs: "1em",sm: "1.3em",md: "1.6em",lg: "1.9em"},
                fontWeight: 700
              },
              o.key == currentList?.key && {
                color: (theme) => theme.palette.common.black,
                "&::after": {
                  bgcolor: (theme) => theme.palette.primary.main,
                },
              },
            ]}
          >
            {o.title}
          </Typography>
        ))}
      </Box>

      {!!currentList?.children && (
        <Box sx={{ my: 2 }}>
          <currentList.children houses={currentList.houses} />
        </Box>
      )}
    </section>
  );
}
