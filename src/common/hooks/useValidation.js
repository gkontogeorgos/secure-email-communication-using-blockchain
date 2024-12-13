import { useCallback, useState } from "react";

export const useValidation = (validationRules) => {
  const [errors, setErrors] = useState({});

  const validate = useCallback(
    (values) => {
      const newErrors = {};
      Object.keys(validationRules).forEach((key) => {
        const value = values[key];
        const rules = validationRules[key];
        const error = rules.reduce((acc, rule) => {
          if (acc) return acc;
          return rule(value);
        }, "");
        if (error) newErrors[key] = error;
      });
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [validationRules]
  );

  return { errors, validate, setErrors };
};
