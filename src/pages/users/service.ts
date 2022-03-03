import { request } from 'umi';

export async function addUser(params: API.User) {
  return request<API.APIResponse>('/api/add', {
    method: 'GET',
    params
  });
}
export async function editUser(
  params:API.User,
) {
  return request<API.APIResponse>(`/api/edit`, {
    method: 'GET',
    params: { ...params },
  });
}

export async function deleteUser( params: { [key: string]: any },) {
  return request<API.APIResponse>(`/api/delete`, {
    method: 'GET',
    params: { ...params },
  });
}
export async function deleteUsers(params: { ids:any }) {
  params.ids=params.ids.join(',')
  return request<API.APIResponse>(`/api/deletes`, {
    method: 'GET',
    params: { ...params },
  });
}
export async function getUsers(
  params: { page:number,pageSize:number }
) {
  return request<API.Response<API.List>>(`/api/users`, {
    method: 'GET',
    params: { ...params }
  });
}