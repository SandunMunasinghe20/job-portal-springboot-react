import { useState } from "react";
import GetInput from "./GetInput";

export default function GetSkillSelector({
  value,
  onChange,
  options,
  placeholder,
}) {
  const [input, setInput] = useState("");

  const selectedSkills = value.split(", ").filter((s) => s.trim());
  const filteredOptions = options.filter(
    (opt) =>
      opt.toLowerCase().includes(input.toLowerCase()) &&
      !selectedSkills.includes(opt),
  );

  const addSkill = (skill) => {
    const updated = [...selectedSkills, skill];
    onChange(updated.join(", "));
    setInput("");
  };

  const removeSkill = (skill) => {
    const updated = selectedSkills.filter((s) => s !== skill);
    onChange(updated.join(", "));
  };

  return (
    <div className="relative w-full">
      {/* Selected skill tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedSkills.map((skill) => (
          <span
            key={skill}
            className="flex items-center px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="ml-2 text-blue-500 hover:text-red-500"
            >
              &times;
            </button>
          </span>
        ))}
      </div>

      <GetInput
        type="text"
        value={input}
        placeholder={placeholder}
        onChange={setInput}
        required={false}
      />

      {/* Suggestions dropdown */}
      {input && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border shadow rounded-xl max-h-40">
          {filteredOptions.map((option) => (
            <li
              key={option}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100"
              onClick={() => addSkill(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
