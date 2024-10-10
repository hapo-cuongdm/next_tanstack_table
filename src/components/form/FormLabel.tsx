interface Props {
  title: string;
  name: string;
}

export const FormLabel = (props: Props) => {
  const { title, name } = props;
  return (
    <label
      htmlFor={name}
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      {title}
    </label>
  );
};
