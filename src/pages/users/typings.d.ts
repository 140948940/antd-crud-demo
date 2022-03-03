declare namespace API {
  type User = {
    id: string;
    username?: string;
    address?: string;
    createTime?: string;
    email?: string;
    phone?: string;
    userStatus?: 0|1;
  };
  type Response<T> = {
    code?: number;
    data: T
  };
  type List = {
    total: number,
    list:User[]
  }
  type APIResponse=Response<{message:string}>

}
