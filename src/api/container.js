import service from '@/libs/api.request'

export const getContainers = () => {
  return service.postreq({
    url: 'workflow/list',
    method: 'post'
  })
}

export const putContainer = (data) => {
  return service.request({
    url: 'container',
    method: 'put',
    data: data
  })
}

export const createWorkflow = (data) => {
  if (data.is_cron) {
    data.type = 1
  }
  return service.postreq({
    url: 'workflow/create',
    method: 'post',
    data: data
  })
}

export const deleteContainer = (data) => {
  let url = 'container/' + data
  return service.request({
    url: url,
    method: 'delete'
  })
}

export const runContainer = (data) => {
  return service.request({
    url: 'container/run',
    method: 'get',
    params: { cid: data.cid }
  })
}
