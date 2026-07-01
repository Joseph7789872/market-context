import { Icons } from "./icons";

export function Topbar({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="topbar">
      <div className="title-block">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {children ? <div className="search-row">{children}</div> : null}
    </header>
  );
}

export function SearchControl({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <label className="control">
      <Icons.Search size={16} />
      <input name="ticker" placeholder="Ticker" defaultValue={defaultValue} />
    </label>
  );
}

export function SelectControl({
  name,
  defaultValue,
  options
}: {
  name: string;
  defaultValue?: string;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <label className="control">
      <Icons.Filter size={16} />
      <select name={name} defaultValue={defaultValue ?? ""}>
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
