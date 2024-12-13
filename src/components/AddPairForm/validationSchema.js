import * as Yup from "yup";

export const validationSchema = Yup.object({
  email_address: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  public_key: Yup.string()
    .required("Public key is required")
    .test("valid-key", "Invalid public key format", (value) => {
      return (
        value?.trim().startsWith("-----BEGIN PUBLIC KEY-----") &&
        value?.trim().endsWith("-----END PUBLIC KEY-----")
      );
    }),
});
