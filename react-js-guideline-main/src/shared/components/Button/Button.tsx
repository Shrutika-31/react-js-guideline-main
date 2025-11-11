type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, type = 'button', ...props }: Props) {
  return (
    <button
      type={type}
      className={
        "px-3.5 py-2.5 rounded-lg border border-indigo-600 bg-indigo-600 text-white font-bold cursor-pointer hover:bg-indigo-700 hover:border-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed " +
        (props.className || '')
      }
      {...props}
    >
      {children}
    </button>
  );
}
