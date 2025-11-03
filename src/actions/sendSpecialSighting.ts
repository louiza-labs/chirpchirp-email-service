import { Resend } from "resend";
import { SpecialSightingEmail } from "../templates/special-sighting";

export const sendSpecialSightingEmail = async (
  to: string,
  species: string,
  imageUrl: string,
  confidence: number,
  resend: Resend
) => {
  const { data, error } = await resend.emails.send({
    from: "ChirpChirp Alerts <joe@louiza.xyz>",
    to,
    subject: `🎉 New Species Alert: ${species} spotted!`,
    react: SpecialSightingEmail({ species, imageUrl, confidence }),
  });

  if (error) throw error;
  return data;
};
