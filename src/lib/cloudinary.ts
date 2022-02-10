interface Options {
  resize?: {
    width: number;
  };
}

export const cloudinaryUrlReplace = (url: string, options?: Options) => {
  const result = url.match(
    /^https:\/\/res.cloudinary.com\/(?<cloudinaryCloudName>\w{9})\/image\/upload\/(?<rest>.+)$/
  );

  const resize = options?.resize?.width
    ? ["c_fit", `w_${options.resize.width}`]
    : [];
  const params = ["f_auto", "q_auto", resize].flat().join(",");

  return `https://res.cloudinary.com/${result?.groups?.cloudinaryCloudName}/image/upload/${params}/${result?.groups?.rest}`;
};
