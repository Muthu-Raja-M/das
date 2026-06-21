import React from "react";
import Button from "@mui/material/Button";

const CustomButton = ({ text, variant = "contained", color = "primary", onClick }) => {
    return (
        <Button
            variant={variant}
            color={color}
            onClick={onClick}
            sx={{
            }}
        >
            {text}
        </Button>
    );
};

export default CustomButton;