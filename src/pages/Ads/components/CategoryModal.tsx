import * as yup from "yup";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import Stack from "@mui/joy/Stack";
import Checkbox from "@mui/joy/Checkbox";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Typography from "@mui/joy/Typography";
import { Box, Divider } from "@mui/joy";
import { useMutation } from "@tanstack/react-query";
import slugify from "slugify";
import { Category } from "../../../types/categories";
import {
  updateCategory,
  createCategory,
  CategoriesResponse,
} from "../../../api/organization";
import queryClient from "../../../utils/queryClient";
import { useNotification } from "../../../context/NotificationContext";
import { AxiosError } from "axios";

type EditModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  category?: Category;
};

const categorySchema = yup.object({
  nameEn: yup.string().required("Name in english is required"),
  nameEs: yup.string().required("Name in spanish is required"),
  image: yup.string(),
});

function CategoryEditModal({ category, open, setOpen }: EditModalProps) {
  const { setNotification } = useNotification();
  const { mutate: updateCategoryMutation } = useMutation({
    mutationFn: (category: Partial<Category>) => updateCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      setOpen(false);
      setNotification({
        message: "Category updated",
        type: "neutral",
      });
      if (category) {
        document.querySelector(`#${category._id}`)?.scrollIntoView({
          behavior: "smooth",
        });
      }
    },
    onError: (error: AxiosError<CategoriesResponse>) => {
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

  const { mutate: createCategoryMutation } = useMutation({
    mutationFn: (category: Partial<Category>) => createCategory(category),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      setOpen(false);
      setNotification({
        message: "Category created",
        type: "neutral",
      });
    },
    onError: (error: AxiosError<CategoriesResponse>) => {
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
          {category ? (
            <DialogTitle>Edit category "{category.name.en}"</DialogTitle>
          ) : (
            <DialogTitle>Create category</DialogTitle>
          )}
          <Divider />
          <Formik
            initialValues={{
              nameEn: category?.name.en || "",
              nameEs: category?.name.es || "",
              image: category?.image || "",
              requiresCondition: category?.requiresCondition || true,
              requiresBrand: category?.requiresBrand || true,
            }}
            validationSchema={categorySchema}
            onSubmit={(values) => {
              if (category) {
                const name = {
                  en: values.nameEn,
                  es: values.nameEs,
                };
                updateCategoryMutation({
                  _id: category._id,
                  name,
                });
              } else {
                const categoryId = slugify(values.nameEn, {
                  lower: true,
                  strict: true,
                }).replace(/-/g, "_");

                const handle = {
                  en: slugify(values.nameEn, { lower: true, strict: true }),
                  es: slugify(values.nameEs, { lower: true, strict: true }),
                };

                const name = {
                  en: values.nameEn,
                  es: values.nameEs,
                };

                createCategoryMutation({
                  categoryId,
                  handle,
                  name,
                  requiresCondition: values.requiresCondition,
                  requiresBrand: values.requiresBrand,
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
                  {!category && (
                    <>
                      <FormControl>
                        <Checkbox
                          {...formik.getFieldProps("requiresCondition")}
                          checked={formik.values.requiresCondition}
                          label="Requires condition field"
                          variant="soft"
                        />
                      </FormControl>
                      <FormControl>
                        <Checkbox
                          {...formik.getFieldProps("requiresBrand")}
                          checked={formik.values.requiresBrand}
                          label="Requires brand field"
                          variant="soft"
                        />
                      </FormControl>
                    </>
                  )}
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
                      {category ? "Save" : "Create"}
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

export default CategoryEditModal;
