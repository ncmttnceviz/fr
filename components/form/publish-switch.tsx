import useClientAxios from "@/hooks/useClientAxios";
import { AuthContext } from "@/pages/_app";
import postPublish from "@/requests/postPublish";
import { FormControlLabel, Switch } from "@mui/material";
import { ChangeEvent, useContext, useState } from "react";

export default function PublishSwitch({initialValue,id,onChange}:{id: string,initialValue: boolean,onChange?: (value: boolean) => void}) {
        const [checked,setChecked] = useState<boolean>(initialValue);
        const [loading,setLoading] = useState<boolean>(false);
        const actx = useContext(AuthContext);
        const axios = useClientAxios(actx.user);

        const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
            setChecked(event.target.checked);
            setLoading(true);
            try {
                await postPublish(axios,id,!!event.target.checked)
                onChange && onChange(!!event.target.checked)
            }
            catch(error) {
                console.error(error);
            }
            finally {
                setLoading(false);
            }

        }
    return (
        <FormControlLabel
          control={
            <Switch checked={checked} onChange={handleChange} disabled={loading} name="gilad" />
          }
          label={checked ? 'İlan Yayında': 'İlan Yayında Değil'}
        />
    )

}