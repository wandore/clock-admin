import service from '@/libs/api.request'

export const getRelations = (workflow_id) => {
  const data = {
    'workflow_id': workflow_id
  }

  return service.postreq({
    url: 'relation/get',
    data: data,
    method: 'post'
  })
}

export const addRelation = (data) => {
  return service.request({
    url: 'relation',
    method: 'post',
    data: data
  })
}

export const deleteRelation = (data) => {
  return service.request({
    url: 'relation/' + data,
    method: 'delete'
  })
}
