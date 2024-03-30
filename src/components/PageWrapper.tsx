import { CssBaseline, GlobalStyles, Sheet } from "@mui/joy";
import { CssVarsProvider } from "@mui/joy";
import theme from "../utils/theme";
import PageHeader from "./PageHeader";
import { PageHeaderProps } from "./PageHeader";

type PageWrapperProps = {
  children: React.ReactNode;
  title: string;
  button: PageHeaderProps["button"];
};

function PageWrapper({ children, title, button }: PageWrapperProps) {
  return (
    <CssVarsProvider defaultMode="dark" disableTransitionOnChange theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": {
            "--Form-maxWidth": "800px",
            "--Transition-duration": "0.4s", // set to `none` to disable transition
          },
        }}
      />
      <main>
        <PageHeader title={title} button={button} />
        <Sheet>{children}</Sheet>
      </main>
    </CssVarsProvider>
  );
}

export default PageWrapper;
