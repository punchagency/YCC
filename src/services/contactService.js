import axios from "axios";
import { buildApiUrl } from "../utils/apiUtils";

export const sendContactMessage = async ({
  fullName,
  email,
  subject,
  message,
  location,
}) => {
  const payload = { fullName, email, subject, message, location };
  const url = buildApiUrl("public/contact-us");

  const response = await axios.post(url, payload);
  return response.data;
};
