import { Box, Button, ColorPaletteProp, Typography } from "@mui/joy";

export type PageHeaderProps = {
  title: string;
  button: {
    label: string;
    color?: ColorPaletteProp;
    size?: "sm" | "md" | "lg";
    icon?: React.ReactNode;
    onClick: () => void;
  };
};

const PageHeader = ({
  title,
  button: { label, color, size, icon, onClick },
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
        >
          {label}
        </Button>
      )}
    </Box>
  );
};

export default PageHeader;
