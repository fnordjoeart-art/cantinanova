export function cdn(url, kind="cover"){
  if (!url) return "";
  if (!url.includes("/upload/")) return url;
  const t = kind === "logo"
    ? "/upload/c_fill,g_auto,f_auto,q_auto,w_300,h_300/"
    : kind === "bottle"
    ? "/upload/c_fill,g_auto,f_auto,q_auto,w_600,h_800/"
    : "/upload/c_fill,g_auto,f_auto,q_auto,w_1200,h_600/";
  return url.replace("/upload/", t);
}