import { CssBaseline, GlobalStyles, Sheet } from "@mui/joy";
import { CssVarsProvider } from "@mui/joy";
import theme from "../utils/theme";

function PageWrapper({ page }: { page: React.ReactNode }) {
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
        <Sheet>{page}</Sheet>
      </main>
    </CssVarsProvider>
  );
}

export default PageWrapper;
