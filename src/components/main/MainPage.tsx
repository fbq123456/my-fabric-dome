import { defineComponent, reactive, ref } from "vue"
import { Button, Breadcrumb } from "ant-design-vue"

export default defineComponent({
  name: "ChildProps",
  setup(props) {
    const obj = reactive({ name: "123123" })
    return () => (
      <>
        <div>-----------ChildProps 组件---------</div>
        {/* Number 的写法 */}
        <div>{obj.name}</div>
        <Button type='primary'>Primary Button</Button>
        <Button>Default Button</Button>
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href=''>Application Center</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <a href=''>Application List</a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>An Application</Breadcrumb.Item>
        </Breadcrumb>
        <div>-----------ChildProps 组件---------</div>
      </>
    )
  }
})
