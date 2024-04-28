import * as yup from "yup";

const yupImageSchema = yup.object({
  file: yup
    .mixed()
    .required("A file is required")
    .test(
      "fileType",
      "Unsupported File Format",
      (value) =>
        value &&
        ["image/jpeg", "image/png", "image/gif"].includes((value as File).type)
    )
    .test(
      "fileSize",
      "File too large",
      (value) => value && (value as File).size <= 5000000 // 5MB
    ),
});

export default yupImageSchema;
