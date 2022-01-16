export interface ValidationObject {
  value: string | number;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  min?: number;
  max?: number;
}

export const validateInput = (validationObject: ValidationObject) => {
  const { value, required, maxLength, minLength, min, max } = validationObject;
  let isValid = true;
  if (required) {
    isValid = isValid && value.toString().trim().length !== 0;
  }
  if (maxLength != null) {
    if (typeof value === "string") {
      isValid = isValid && value.trim().length <= maxLength;
    }
  }
  if (minLength != null) {
    if (typeof value === "string") {
      isValid = isValid && value.trim().length >= minLength;
    }
  }

  if (min != null) {
    if (typeof value === "number") {
      isValid = isValid && value >= min;
    }
  }
  if (max != null) {
    if (typeof value === "number") {
      isValid = isValid && value <= max;
    }
  }
  return isValid;
};
