import { Box, Button, ColorPaletteProp, Typography } from "@mui/joy";
import { ReactNode } from "react";

export type PageHeaderProps = {
  title: string;
  button: {
    label: string | ReactNode;
    color?: ColorPaletteProp;
    size?: "sm" | "md" | "lg";
    icon?: React.ReactNode;
    disabled?: boolean;
    onClick: () => void;
  };
};

const PageHeader = ({
  title,
  button: { label, color, size, icon, onClick, disabled },
}: PageHeaderProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        mb: 1,
        gap: 1,
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "start", sm: "center" },
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      <Typography level="h2" component="h1">
        {title}
      </Typography>
      {label && (
        <Button
          color={color}
          startDecorator={icon}
          size={size}
          onClick={onClick}
          disabled={disabled}
        >
          {label}
        </Button>
      )}
    </Box>
  );
};

export default PageHeader;
