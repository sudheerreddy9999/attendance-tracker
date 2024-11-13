export const token = () => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("authToken");
    return token;
  }else{
    return null;
  }
};
