import { getInputTextErrorMessage, Rule } from "@/utils/validate";
import { FormLabel } from "./FormLabel";
import { FormError } from "./FormError";

interface Props {
  title: string;
  form: any;
  placeholder?: string;
  name: string;
  rules?: any;
}

interface FormEvent {
  value: any;
}

export const FormTextInput = (props: Props) => {
  const { title, form, placeholder, name, rules } = props;

  return (
    <>
      <form.Field
        name={name}
        validators={{
          onChange: (props: FormEvent) => {
            const { value } = props;
            return getInputTextErrorMessage(rules, value);
          },
          onChangeAsyncDebounceMs: 500,
          onChangeAsync: async (props: FormEvent) => {
            const { value } = props;
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return (
              value.includes("error") && 'No "error" allowed in first name'
            );
          },
        }}
        children={(field: any) => {
          const isError =
            field.state.meta.isTouched && field.state.meta.errors.length;
          // Avoid hasty abstractions. Render props are great!
          return (
            <>
              <FormLabel title={title} name={field.name} />
              <input
                type="text"
                className={`${
                  isError
                    ? "form-input--error"
                    : "form-input"
                } border text-sm rounded-lg block w-full p-2.5`}
                placeholder={placeholder}
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FormError field={field} />
            </>
          );
        }}
      ></form.Field>
    </>
  );
};
