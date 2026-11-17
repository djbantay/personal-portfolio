import type { MDXComponents } from "mdx/types";
import { Screenshot, Video, Links, Stats, Note } from "@/components/mdx";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { Screenshot, Video, Links, Stats, Note, ...components };
}
