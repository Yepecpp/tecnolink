export type BaseEntityRoutes = {
  get: string;
  /* add more routes here */
  [key: string]: string | undefined;
};
export interface EntityRoutes extends BaseEntityRoutes {
  post: string;
  put: string;
  delete: string | undefined;
  getOne: string;
}

const apiRoot = "";
const detailDenominator = "/detail";

const authRoot = "/auth";
export const authRoutes: BaseEntityRoutes & { loginPost: string } = {
  get: `${apiRoot}${authRoot}`,
  loginPost: `${apiRoot}${authRoot}/login`,
};

const userRoot = "/users";
export const userRoutes: EntityRoutes & {
  getProfile: string;
  changePassword: string;
} = {
  getOne: `${apiRoot}${userRoot}${detailDenominator}`,
  getProfile: `${apiRoot}${userRoot}/profile`,
  changePassword: `${apiRoot}${userRoot}/password`,
  get: `${apiRoot}${userRoot}`,
  post: `${apiRoot}${userRoot}/register`,
  put: `${apiRoot}${userRoot}`,
  delete: `${apiRoot}${userRoot}`,
};

const clientRoot = "/clients";
export const clientRoutes: EntityRoutes = {
  getOne: `${apiRoot}${clientRoot}${detailDenominator}`,
  get: `${apiRoot}${clientRoot}`,
  post: `${apiRoot}${clientRoot}`,
  put: `${apiRoot}${clientRoot}`,
  delete: `${apiRoot}${clientRoot}`,
};
