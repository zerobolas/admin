import * as yup from "yup";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import Stack from "@mui/joy/Stack";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Typography from "@mui/joy/Typography";
import { Box, Divider } from "@mui/joy";
import { useMutation } from "@tanstack/react-query";
import slugify from "slugify";
import { Category, Subcategory } from "../../../types/categories";
import {
  addSubcategory,
  updateSubcategory,
  SubcategoriesResponse,
} from "../../../api/organization";
import queryClient from "../../../utils/queryClient";
import { useNotification } from "../../../context/NotificationContext";
import { AxiosError } from "axios";

type EditModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  category: Category;
  subcategory?: Subcategory;
};

const subcategorySchema = yup.object({
  nameEn: yup.string().required("Name in english is required"),
  nameEs: yup.string().required("Name in spanish is required"),
});

function SubcategoryModal({
  category,
  subcategory,
  open,
  setOpen,
}: EditModalProps) {
  const { setNotification } = useNotification();
  const { mutate: addSubcategoryMutation } = useMutation({
    mutationFn: (subcategory: Partial<Subcategory>) =>
      addSubcategory(category._id, subcategory),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      setOpen(false);
      setNotification({
        message: "Subcategory created",
        type: "neutral",
      });
    },
    onError: (error: AxiosError<SubcategoriesResponse>) => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      setOpen(false);
      setNotification({
        message: error.response?.data?.message || "An error occurred",
        type: "danger",
      });
    },
  });

  const { mutate: updateSubcategoryMutation } = useMutation({
    mutationFn: (subcategory: Partial<Subcategory>) =>
      updateSubcategory(category._id, subcategory),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      setOpen(false);
      setNotification({
        message: "Subcategory updated",
        type: "neutral",
      });
    },
    onError: (error: AxiosError<SubcategoriesResponse>) => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      setOpen(false);
      setNotification({
        message: error.response?.data?.message || "An error occurred",
        type: "danger",
      });
    },
  });

  function handleClose() {
    setOpen(false);
  }
  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <ModalDialog variant="plain">
          {subcategory ? (
            <DialogTitle>
              Edit subcategory "{category.name.en} / {subcategory.name.en}"
            </DialogTitle>
          ) : (
            <DialogTitle>Add subcategory in "{category.name.en}"</DialogTitle>
          )}
          <Divider />
          <Formik
            initialValues={{
              nameEn: subcategory?.name.en || "",
              nameEs: subcategory?.name.es || "",
            }}
            validationSchema={subcategorySchema}
            onSubmit={(values) => {
              const name = {
                en: values.nameEn,
                es: values.nameEs,
              };
              if (subcategory) {
                updateSubcategoryMutation({
                  _id: subcategory._id,
                  name,
                });
              } else {
                const subcategoryId = slugify(values.nameEn, {
                  lower: true,
                  strict: true,
                }).replace(/-/g, "_");

                const handle = {
                  en: slugify(values.nameEn, { lower: true, strict: true }),
                  es: slugify(values.nameEs, { lower: true, strict: true }),
                };

                addSubcategoryMutation({
                  subcategoryId,
                  handle,
                  name,
                });
              }
            }}
          >
            {(formik) => (
              <Form>
                <Stack spacing={2}>
                  <Typography level="title-md">Name</Typography>
                  <FormControl>
                    <FormLabel>English</FormLabel>
                    <Field
                      name="nameEn"
                      as={Input}
                      error={formik.errors.nameEn && formik.touched.nameEn}
                    />
                    <ErrorMessage
                      name="nameEn"
                      render={(errorMessage) => (
                        <Typography level="body-sm" color="danger">
                          {errorMessage}
                        </Typography>
                      )}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Spanish</FormLabel>
                    <Field
                      name="nameEs"
                      as={Input}
                      error={formik.errors.nameEs && formik.touched.nameEs}
                    />
                    <ErrorMessage
                      name="nameEs"
                      render={(errorMessage) => (
                        <Typography level="body-sm" color="danger">
                          {errorMessage}
                        </Typography>
                      )}
                    />
                  </FormControl>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "16px",
                      marginTop: "30px",
                    }}
                  >
                    <Button
                      onClick={handleClose}
                      variant="plain"
                      color="neutral"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      color="primary"
                      disabled={!formik.touched || !formik.isValid}
                      loading={formik.isSubmitting}
                    >
                      {subcategory ? "Save" : "Add"}
                    </Button>
                  </Box>
                </Stack>
              </Form>
            )}
          </Formik>
        </ModalDialog>
      </Modal>
    </>
  );
}

export default SubcategoryModal;
