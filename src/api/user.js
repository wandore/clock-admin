import service from '@/libs/api.request'

export const login = ({ userName, password }) => {
  const data = {
    'username': userName,
    'password': password
  }

  return service.postreq({
    url: 'user/login',
    data: data,
    method: 'post'
  })
}
