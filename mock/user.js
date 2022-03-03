import Mock from 'mockjs'
const param2Obj = url => {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}
let List = []
const count = 60
let typelist = [0,1]
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: Mock.Random.guid(),
    username: Mock.Random.cname(),
    address: Mock.mock('@county(true)'),
    createTime: Mock.Random.datetime(),
    email: Mock.Random.email(),
    'userStatus|1': typelist
  }))
}
export default {
  /* 获取列表*/
  'GET  /api/users': (config, res) => {
    const { name, page = 1, pageSize = 20 } = param2Obj(config.url)
    console.log(param2Obj(config.url))
    console.log(page + "++" + pageSize)
    const mockList = List.filter(user => {
      if (name && user.username.indexOf(name) === -1) return false
      return true
    })
    const pageList = mockList.filter((item, index) => index < pageSize * page && index >= pageSize * (page - 1))
    res.send({
      code: 200,
      data: {
        total: mockList.length,
        list: pageList
      }
    })
  },
  /** 增加一条信息*/
  'GET  /api/add': (config, res) => {
    const { username, address, email, userStatus } = param2Obj(config.url)
    List.unshift({
      id: Mock.Random.guid(),
      username: username,
      address: address,
      createTime: Mock.Random.now(),
      email: email,
      userStatus: userStatus,
    })
    res.send({
      code: 200,
      data: {
        message: '添加成功'
      }
    })
  },
  /*** 删除用户 */
  'GET  /api/delete': (config, res) => {
    const { id } = param2Obj(config.url)
    if (!id) {
      res.send({
        code: -999,
        message: '参数不正确'
      })
    } else {
      List = List.filter(u => u.id !== id)
      res.send({
        code: 200,
        data: {
          message: '删除成功'
        }
      })
    }
  },
  /* 批量删除 */

  'GET  /api/deletes': (config, res) => {
    console.log(config);
    // console.log(param2Obj(config.url));
    let { ids } = param2Obj(config.url)
    console.log(ids);
    ids = ids.split(',')
    List = List.filter(u => !ids.includes(u.id))
    res.send({
      code: 200,
      data: {
        message: '批量删除成功'
      }
    })
  },
  /*修改用户 */
  'GET  /api/edit': (config, res) => {
    const { id, username, address, email, userStatus } = param2Obj(config.url)
    List.some(u => {
      if (u.id === id) {
        u.username = username
        u.address = address
        u.email = email
        u.userStatus = userStatus
        return true
      }
    })
    res.send({
      code: 200,
      data: {
        message: '编辑成功'
      }
    })
  }
}