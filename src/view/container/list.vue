<template>
  <div>

    <div>
      <i-form :model="page" inline :label-width="80">
        <form-item label="名字">
          <i-input v-model="page.name" type="text" placeholder="名字">
          </i-input>
        </form-item>
        <form-item label="表达式">
          <i-input v-model="page.expression" type="text" placeholder="表达式">
          </i-input>
        </form-item>
        <form-item label="当前状态">
          <i-select v-model="page.status" style="width:200px">
            <Option value="0">全部</Option>
            <Option value="1">等待</Option>
            <Option value="2">开始</Option>
            <Option value="3">成功</Option>
            <Option value="4">失败</Option>
          </i-select>
        </form-item>
        <i-button type="primary" icon="ios-search" @click="loadPage">查询</i-button> &nbsp;&nbsp;
        <i-button type="success" v-model="showPut" icon="ios-add-circle" @click="windowAddContainer">新增
        </i-button>
      </i-form>
    </div>
    <div>
      <Table border :columns="columns" :data="containers">
        <template slot-scope="{ row }" slot="is_cron">
          <i-switch size="large" v-model="row.is_cron">
          </i-switch>
        </template>
        <template slot-scope="{ row }" slot="action">
          <Button type="info" size="small" @click="viewConfig(row)">配置</Button>
          <Button type="primary" size="small" @click="rowPutContainer(row)">编辑</Button>
          <Button type="error" size="small" @click="confirmRemove(row)">删除</Button>
          <Button type="info" size="small" @click="runContainer(row)">运行</Button>
        </template>
      </Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="page.total" :page-size="page.count" @on-change="changePageIndex"
                @on-page-size-change="changePageSize" show-sizer/>
        </div>
      </div>
    </div>
    <div>
      <Modal v-model="showPut" title="编辑" @on-ok="createContainer">
        <i-form ref="form" :model="container" :label-width="80">
          <FormItem label="工作流名">
            <i-input v-model="container.name"></i-input>
          </FormItem>
          <FormItem label="描述">
            <i-input v-model="container.desc"></i-input>
          </FormItem>
          <FormItem label="是否定时">
            <i-switch v-model="container.is_cron"></i-switch>
          </FormItem>
          <FormItem label="cron表达式">
            <i-input v-model="container.crontab"></i-input>
          </FormItem>
          <FormItem label="并发数">
            <i-input v-model="container.concurrent"></i-input>
          </FormItem>
          <FormItem label="失败限制">
            <i-input v-model="container.failed_limit"></i-input>
          </FormItem>
          <FormItem label="超时控制">
            <i-input v-model="container.timeout"></i-input>
          </FormItem>
        </i-form>
      </Modal>
    </div>
  </div>
</template>

<script>
import { getContainers, putContainer, deleteContainer, runContainer, createWorkflow } from '../../api/container'
import { getDateTimeStr } from '@/libs/util'

export default {
  name: 'ContainerList',
  mounted: function () {
    this.loadPage()
  },

  data () {
    return {
      containers: [],
      showPut: false,
      page: {
        expression: '',
        name: '',
        order: 'workflow_id',
        status: 0,
        total: 0,
        index: 1,
        count: 20
      },
      container: {
        workflow_id: '',
        name: '',
        desc: '',
        status: '',
        type: 0,
        is_cron: false,
        crontab: '',
        concurrent: 1,
        failed_limit: 1,
        timeout: 60
      },
      statusBtn: {
        1: {
          props: {
            type: 'info',
            size: 'small',
            icon: 'md-arrow-down'
          },
          text: '等待'
        },
        2: {
          props: {
            type: 'primary',
            size: 'small',
            loading: true
          },
          text: '进行'
        },
        3: {
          props: {
            type: 'success',
            size: 'small',
            icon: 'md-checkmark'
          },
          text: '成功'
        },
        4: {
          props: {
            size: 'small',
            type: 'error',
            icon: 'md-close'
          },
          text: '失败'
        }
      },
      search: '',
      columns: [
        {
          title: 'ID',
          key: 'workflow_id',
          width: '150',
          tooltip: true
        },
        {
          title: '工作流名',
          key: 'name',
          width: '100',
          tooltip: true
        },
        {
          title: '描述',
          key: 'desc',
          width: '100',
          tooltip: true
        },
        {
          title: '状态',
          key: 'status',
          width: '90'
        },
        {
          title: '创建时间',
          key: 'created_at',
          width: '100',
          render: (h, params) => {
            let status = params.row.created_at
            console.log(status)
            let p = getDateTimeStr(status)
            return h('Span', {}, p)
          }
        },
        {
          title: '是否定时',
          key: 'is_cron',
          slot: 'is_cron',
          width: '100'
        },
        {
          title: 'cron表达式',
          key: 'crontab',
          width: '120'
        },
        {
          title: '并发数',
          key: 'concurrent',
          width: '80'
        },
        {
          title: '失败限制',
          key: 'failed_limit',
          width: '90'
        },
        {
          title: '超时控制',
          key: 'timeout',
          width: '90'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          slot: 'action',
          width: '240'
        }
      ]
    }
  },

  methods: {
    loadPage: function () {
      getContainers().then(data => {
        this.containers = data.data.data
        this.page.total = 20
      })
    },
    loadPageByCondition: function () {
      getContainers(this.page).then(data => {
        this.containers = data.data
        this.page.total = 20
      })
    },
    // 新增or修改任务
    updateContainer: function () {
      putContainer(this.container).then(() => {
        this.$Message.success('操作成功~')
        this.loadPage()
      }
      )
    },
    createContainer: function () {
      createWorkflow(this.container).then(() => {
        this.$Message.success('操作成功~')
        this.loadPage()
      }
      )
    },
    // 行编辑任务
    rowPutContainer: function (row) {
      this.container = row
      this.showPut = true
    },
    windowAddContainer: function () {
      this.container = {
        workflow_id: '',
        name: '',
        desc: '',
        is_cron: false,
        crontab: '',
        concurrent: 1,
        failed_limit: 1,
        timeout: 60
      }
      this.showPut = true
    },
    changePageIndex: function (page) {
      this.page.index = page
      this.loadPage()
    },
    changePageSize: function (size) {
      // 默认页面大小变化切入到第一页
      this.page.index = 1
      this.page.count = size
      this.loadPage()
    },
    runContainer: function (container) {
      this.$Message.info('开启任务')
      runContainer(container).then(() => {
        this.$Message.success('运行成功')
      })
      this.loadPage()
    },
    confirmRemove: function (container) {
      let cur = this
      this.$Modal.confirm({
        title: '确认',
        content: '<p>是否删除当前任务</p>',
        onOk: () => {
          cur.remove(container)
        }
      })
    },
    remove: function (container) {
      deleteContainer(container.workflow_id).then(() => {
        this.$Message.success('删除成功~')
        this.loadPage()
      })
    },
    changeContainer: function (container) {
      putContainer(container).then(() => {
        this.$Message.success('操作成功~')
        this.loadPage()
      }
      )
    },
    viewConfig: function (container) {
      this.$router.push({ name: 'workflow-config', params: { workflow_id: container.workflow_id } })
    }
  }
}
</script>
