import service from '@/libs/api.request'

export const getTasks = (data) => {
  return service.request({
    url: 'task',
    method: 'get',
    params: data
  })
}

export const getTask = (job_id) => {
  const data = {
    'job_id': job_id
  }

  return service.postreq({
    url: 'job/get',
    data: data,
    method: 'post'
  })
  /*
  return service.request({
    url: 'task/' + data,
    method: 'get'
  })
   */
}

export const putTask = (data) => {
  return service.request({
    url: 'task',
    method: 'put',
    data: data
  })
}

export const deleteTask = (data) => {
  let url = 'task/' + data
  return service.request({
    url: url,
    method: 'delete'
  })
}

export const runTask = (data) => {
  return service.request({
    url: 'task/run',
    method: 'get',
    params: { tid: data.tid }
  })
}
