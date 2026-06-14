interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = ({ label, ...props }: InputProps) => (
  <div className="flex flex-col gap-2 w-full">
    <label className="text-sm font-medium text-gray-400">{label}</label>
    <input
      {...props}
      className="bg-zinc-900 border border-zinc-800 text-white  p-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
    />
  </div>
);
