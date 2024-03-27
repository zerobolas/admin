import { useField } from "formik";

type InputProps = {
  id: string;
  label: string;
  name: string;
  type: string;
  placeholder: string;
};

export function TextInput({ label, ...props }: InputProps) {
  const { id, name } = props;
  const [field, meta] = useField(props);
  return (
    <div className="form__field ">
      <label htmlFor={id || name} className="form__label">
        {label}
      </label>
      <input
        className={`form__input ${
          meta.touched && meta.error && "input__error"
        }`}
        {...field}
        {...props}
        value={field.value || ""}
      />
      {meta.touched && meta.error ? (
        <div className="form__error">{meta.error}</div>
      ) : null}
    </div>
  );
}
