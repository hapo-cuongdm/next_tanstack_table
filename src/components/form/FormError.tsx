import { FieldApi } from "@tanstack/react-form";

interface Props {
  field: FieldApi<any, any, any, any>;
}

export const FormError = ({ field }: Props) => {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">
          {field.state.meta.errors.join(", ")}
        </p>
      ) : null}
      {/* {field.state.meta.isValidating ? (
        <p className="mt-2 text-sm">Validating...</p>
      ) : null} */}
    </>
  );
};
