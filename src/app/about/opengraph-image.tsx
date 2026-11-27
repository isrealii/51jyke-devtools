import { socialImageContentType, socialImageSize, renderSocialImage } from "@/lib/social-image";

export const alt = "About 51JYKE DevTools";
export const size = socialImageSize;
export const contentType = socialImageContentType;

export default function Image() {
  return renderSocialImage({
    title: "About 51JYKE DevTools",
    subtitle: "Dialect coverage, parser boundaries, and browser-local processing",
    footer: "Free to use · No ads · Review converted SQL before use",
  });
}
