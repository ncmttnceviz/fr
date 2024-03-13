import { forwardRef } from "react";
import { IMaskInput } from "react-imask";

const MuiIMask = forwardRef<HTMLElement, {
    mask: string, 
    definitions: any, 
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}>(
    function TextMaskCustom(props, ref) {
        const { onChange, ...other } = props;
        return (
            <IMaskInput
                {...other}
                mask={props.mask}
                definitions={props.definitions}
                inputRef={ref as any}
                onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
                overwrite
            />
        );
    },
);
export default MuiIMask;