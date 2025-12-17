import { useState } from 'react';

export function useFormFields(initialState) {
  const [fields, setFields] = useState(initialState);

  const updateField = (name, value) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const resetFields = () => setFields(initialState);

  return { fields, updateField, resetFields };
}


