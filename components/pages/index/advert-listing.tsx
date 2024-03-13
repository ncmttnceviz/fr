import AdvertCard from "@/components/image/advert-card";
import BasicListing, { ListingType } from "@/components/listing/basic-listing";
import makeAxios from "@/feature/makeAxios";
import useCombineSx from "@/hooks/useCombineSx";
import useMakeHouses from "@/hooks/useMakeHouses";
import { ListingAdvertModel } from "@/models/advert-model";
import getCategory from "@/requests/getCategory";
import { RootState } from "@/store";
import { Box, ContainerProps, Grid, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

const createListing = (key: string, title: string,houses: ListingAdvertModel[]) => {
  return {
    key,
    title,
    houses,
    children: ({ houses }: { houses: any[] }) => {
      return (
        <Grid container spacing={2} justifyContent="center">
          {houses.map((house, index) => (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <AdvertCard advert={house} />
            </Grid>
          ))}
        </Grid>
      );
    },
  };
};
export default function ({ sx, children, ...props }: ContainerProps) {
  const a = useCombineSx(sx);
  const axios = useMemo(makeAxios,[]);
  const categoryTree = useSelector((state: RootState) => state.categoryTree.categories);
  const [listing, setListing] = useState<ListingType[]>([]);

  useEffect(()=>{
    const fetch = async()=>{
      const fetchFrom: {slug: string,title: string}[] = [{slug: "",title: "YENİ İLANLAR"}];
      
      
      categoryTree.forEach(category => fetchFrom.push({slug: category.slug || "",title: category.title.toLocaleUpperCase('tr-TR')}));
      if(fetchFrom.length <= 1){
        return;
      }
      

      const listings = await Promise.all(fetchFrom.map(o => getCategory(axios,o.slug,{per_page: 6})));

      setListing(listings.filter(o => o.paginatedData.items.length).map(o => createListing(o.category?.slug || "new",o.category?.title?.toLocaleUpperCase('tr-TR') || "Yeni İlanlar",o.paginatedData.items)))
    } 
    fetch();
    // TODO FETCH DYNAMIC DATA
  },[categoryTree])
  const b = "Yönetici onayından geçen ilanlar arasından istediğiniz emlak & vasıta ilanını inceleyin veya kendi ilanınızı sistemimize ekleyin!".toLocaleUpperCase('tr-TR');
  return (
    <Container sx={a} {...props}>
      <Box sx={{ textAlign: "center" }}>
        <Typography typography={"h3"} sx={{ fontWeight: 700, mb: 3 }}>
          İLANLAR
        </Typography>
        <Typography typography={"subtitle2"} sx={{ fontWeight: 400 }}>
          {b}        
        </Typography>
      </Box>
      <BasicListing list={listing}></BasicListing>
    </Container>
  );
}
