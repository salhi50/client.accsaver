export const handleUnAuthorizedResponse = function (res: Response) {
  if (res.status === 401) {
    window.location.href = "/";
    throw new Error();
  }
  return res;
};
