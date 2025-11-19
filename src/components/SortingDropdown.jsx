import { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";

export default function SortingDropdown({ options, onChange }) {
  const [selected, setSelected] = useState(options[0].label);

  const handleSelect = (value, label) => {
    setSelected(label);
    onChange(value); 
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="secondary" id="sort-dropdown">
        Sort: {selected}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {options.map((opt) => (
          <Dropdown.Item
            key={opt.value}
            onClick={() => handleSelect(opt.value, opt.label)}
          >
            {opt.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
