export interface IAuthInfo {
  username: string;
  password: string;
  url: string;
}

export interface IXtreamConfig {
  url: string;
  username: string;
  password: string;
}

export interface ICategory {
  categoryId: string;
  categoryName: string;
  parentId?: string;
}
