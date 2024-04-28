import * as yup from "yup";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Checkbox from "@mui/joy/Checkbox";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import Stack from "@mui/joy/Stack";
import Grid from "@mui/joy/Grid";
import { useFormik } from "formik";
import { Category } from "../../../types/categories";
import Typography from "@mui/joy/Typography";
import { Box, Divider } from "@mui/joy";

type EditModalProps = {
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  category: Category;
};

const categorySchema = yup.object({
  nameEn: yup.string().required(),
  nameEs: yup.string().required(),
  handleEn: yup.string().required(),
  handleEs: yup.string().required(),
  image: yup.string().required(),
  requiresCondition: yup.boolean().required(),
  requiresBrand: yup.boolean().required(),
});

function CategoryEditModal({
  category,
  open,
  setOpen,
  onSubmit,
}: EditModalProps) {
  const formik = useFormik({
    initialValues: {
      nameEn: category.name.en,
      nameEs: category.name.es,
      handleEn: category.handle.en,
      handleEs: category.handle.es,
      image: category.image,
      requiresCondition: category.requiresCondition,
      requiresBrand: category.requiresBrand,
    },
    onSubmit: (values) => {
      console.log(values);
    },
    validationSchema: categorySchema,
  });

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="plain">
          <DialogTitle>Edit category "{category.name.en}"</DialogTitle>
          <Divider />
          <form onSubmit={onSubmit}>
            <Stack spacing={2}>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid xs={12}>
                  <Typography level="title-md">Name</Typography>
                </Grid>
                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>English</FormLabel>
                    <Input
                      variant="soft"
                      autoFocus
                      required
                      {...formik.getFieldProps("nameEn")}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={6}>
                  <FormControl>
                    <FormLabel>Spanish</FormLabel>
                    <Input
                      variant="soft"
                      required
                      {...formik.getFieldProps("nameEs")}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                <Grid xs={6}>
                  <FormControl>
                    <Checkbox
                      variant="soft"
                      label="Show condition field"
                      checked={formik.values.requiresCondition}
                      {...formik.getFieldProps("requiresCondition")}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={6}>
                  <FormControl>
                    <Checkbox
                      variant="soft"
                      label="Show brand field"
                      checked={formik.values.requiresBrand}
                      {...formik.getFieldProps("requiresBrand")}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "16px",
                  marginTop: "30px",
                }}
              >
                <Button
                  onClick={() => setOpen(false)}
                  variant="plain"
                  color="neutral"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={!formik.isValid}
                >
                  Save
                </Button>
              </Box>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  );
}

export default CategoryEditModal;
