<template>
  <div
    id="fabric-div"
    :style="{
      backgroundColor: bgColor,
      width: `${bgWidth}px`,
      height: `${bgHeight}px`
    }"
  >
    <img
      v-if="image"
      id="fabric-div-BackgroundPicture"
      :style="{
        width: `${bgWidth}px`,
        height: `${bgHeight}px`
      }"
      :src="image"
    />
    <canvas :id="id" style="position: absolute; left: 0; top: 0"></canvas>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive } from "vue"
import { fabric } from "fabric"
import deleteIcon from "../assets/delete.svg"
import mtr from "../assets/mtr.svg"
export interface Props {
  /**
   *画布唯一id
   */
  id: string
  /**
   *衣服颜色
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bgColor?: string
  /**
   *衣服模板
   */
  image?: string
  /**
   *画布宽度，衣服宽度
   */
  bgWidth: number
  /**
   *画布高度，衣服高度
   */
  bgHeight: number
  /**
   *可编辑区域宽度
   */
  boxWidth: number
  /**
   *可编辑区域高度
   */
  boxHeight: number
  /**
   *编辑框的x轴
   */
  left: number
  /**
   *编辑框的y轴
   */
  top: number
  /**
   *编辑模式，true 衣服编辑模式，false图片展示模式,默认true
   */
  editPattern: boolean
  /**
   *缩放
   */
  scale?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  id: "",
  /**
   *衣服颜色
   */
  bgColor: "",
  /**
   *衣服模板
   */
  image: "",
  /**
   *画布宽度，衣服宽度
   */
  bgWidth: 0,
  /**
   *画布高度，衣服高度
   */
  bgHeight: 0,
  /**
   *可编辑区域宽度
   */
  boxWidth: 0,
  /**
   *可编辑区域高度
   */
  boxHeight: 0,
  /**
   *编辑框的x轴
   */
  left: 0,
  /**
   *编辑框的y轴
   */
  top: 0,
  /**
   *编辑模式
   */
  editPattern: true,
  /**
   *缩放
   */
  scale: false
})

const emit = defineEmits(["addCanvas"])

/** 删除图标dom */
let deleteBtn = ref<HTMLImageElement>()
/** 旋转图标dom */
let mtrBtn = ref<HTMLImageElement>()
/** 裁剪框变量 */
// let clipPath = ref<fabric.Rect>()
/** 坐标确认判断 */
interface Coordinate {
  key?: string
  x?: number
  y?: number
}

onMounted(() => {
  deleteBtn.value = document.createElement("img")
  deleteBtn.value.src = deleteIcon
  mtrBtn.value = document.createElement("img")
  mtrBtn.value.src = mtr
  // 初始化画布设置
  init()
})

// 初始化
const init = () => {
  /** canvas实例 */
  let canvas = new fabric.Canvas(props.id, {
    width: props.bgWidth,
    height: props.bgHeight,
    selection: false,
    controlsAboveOverlay: true
  })
  fabric.Object.prototype.transparentCorners = false
  fabric.Object.prototype.controls.mtr.offsetY = -15 // 旋转锚点的距离
  // 旋转图标
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fabrics = fabric as any
  fabric.Object.prototype.controls.mtr = new fabric.Control({
    x: 0,
    y: -0.5,
    offsetY: -20,
    cursorStyle: "pointer",
    actionHandler: fabrics.controlsUtils.rotationWithSnapping,
    actionName: "rotate",
    render: renderIcon(mtrBtn.value) // 图标资源
  })
  // 锚点控制
  fabric.Object.prototype.setControlsVisibility({
    bl: true, // 左下
    br: true, // 右下
    mb: false, // 下中
    ml: false, // 中左
    mr: false, // 中右
    mt: false, // 上中
    tl: true, // 上左
    tr: true, // 上右
    mtr: true // 旋转控制键
  })
  // 判断编辑模式
  if (props.editPattern) {
    eventCore(canvas)
    addLine(canvas)
    addClipPath()
  }
  addIcon(deleteBtn.value)
  emit("addCanvas", canvas)
}
// 事件中心
/**
 *注册画布事件
 */
const eventCore = (canvas: fabric.Canvas) => {
  // 选中事件
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canvas.on("selection:created", function (options: any) {
    addCenterCoordinate(options.selected[0])
    addRect(canvas)
  })

  // 取消选中事件
  canvas.on("selection:cleared", function () {
    showGuide()
    deleteRect(canvas)
  })

  // 移动事件
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canvas.on("object:moving", function (e: any) {
    addCenterCoordinate(e.target)
  })

  // 旋转事件
  canvas.on("object:rotating", function () {
    return
  })

  // 缩放事件
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canvas.on("object:scaling", function (e: any) {
    showGuide()
    guidePosition(e.target)
  })

  // 添加事件
  canvas.on("object:added", function () {
    return
  })

  // 键盘按下事件
  fabric.util.addListener(
    document.body,
    "keydown",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function (options: { repeat: any; which: any; keyCode: any }) {
      var key = options.which || options.keyCode // key detection
      switch (key) {
        case 37:
          moveSelected(Direction.LEFT, canvas)
          break
        case 38:
          moveSelected(Direction.UP, canvas)
          break
        case 39:
          moveSelected(Direction.RIGHT, canvas)
          break
        case 40:
          moveSelected(Direction.DOWN, canvas)
          break
        default:
          break
      }
    }
  )

  // 键盘抬起
  fabric.util.addListener(document.body, "keyup", function () {
    return
  })
}

// 裁剪区域
let clipPathList = ref<fabric.Rect[]>([])
/**
 *添加中心裁剪区域
 */
const addClipPath = (
  name?: string
  // left?: number,
  // top?: number,
  // width?: number,
  // height?: number
) => {
  let RectList = new fabric.Rect({
    name: name,
    left: (props.bgWidth - props.boxWidth) / 2,
    top: (props.bgHeight - props.boxHeight) / 2,
    width: props.boxWidth,
    height: props.boxHeight,
    absolutePositioned: true
  })
  // let RectList = new fabric.Rect({
  //   name: name,
  //   left: left,
  //   top: top,
  //   width: width,
  //   height: height,
  //   absolutePositioned: true,
  // })
  clipPathList.value?.push(RectList)
}

// 图标事件区域

/**
 *添加图标
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addIcon = (Icon: any) => {
  fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: 0.55,
    y: -0.55,
    offsetX: 10,
    offsetY: -10,
    cursorStyle: "pointer",
    mouseUpHandler: deleteObject, // 图标事件
    render: renderIcon(Icon) // 图标资源
  })
}
/**
 *图标处理
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderIcon = (Icon: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (ctx: any, left: any, top: any, fabricObject: any) {
    var size = 20
    ctx.save()
    ctx.translate(left, top)
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle))
    ctx.drawImage(Icon, -size / 2, -size / 3, size, size)
    ctx.restore()
  }
}
/**
 *图标删除事件
 */
const deleteObject = (eventData: MouseEvent, transform: fabric.Transform) => {
  var canvasDelete = transform.target.canvas
  var target = transform.target
  canvasDelete?.remove(target)
  canvasDelete?.requestRenderAll()
  return false
}

let activeBorder = ref<fabric.Rect>() // 限制边框
/**
 *添加边框事件
 */
const addRect = (
  canvas: fabric.Canvas
  // left?: number,
  // top?: number,
  // width?: number,
  // height?: number
) => {
  activeBorder.value = new fabric.Rect({
    left: (props.bgWidth - props.boxWidth) / 2,
    top: (props.bgHeight - props.boxHeight) / 2,
    width: props.boxWidth - 1,
    height: props.boxHeight - 1,
    stroke: "#a8a8a8",
    strokeDashArray: [1, 1],
    borderDashArray: [2, 2],
    strokeWidth: 2,
    fill: "rgba(0, 0, 0, 0)",
    objectCaching: true,
    scaleX: 1,
    scaleY: 1,
    padding: 100,
    selectable: false
  })
  canvas.add(activeBorder.value as fabric.Rect)
}
/**
 *删除边框
 */
const deleteRect = (canvas: fabric.Canvas) => {
  canvas.remove(activeBorder.value as fabric.Rect)
}

// 添加图片
/**
 *在画布上添加图片Image: 图片地址
 */
const addImage = (
  canvas: fabric.Canvas,
  Image: string,
  scale?: boolean
  // name: string,
  // width?: number,
  // height?: number,
  // left?: number,
  // top?: number
) => {
  // 判断是否裁剪模式
  // props.editPattern ? addClipPath(name) :null
  fabric.Image.fromURL(Image, function (img: fabric.Image) {
    img.set({
      strokeDashArray: [5, 5],
      borderDashArray: [4, 4],
      cornerColor: "#2c2c2c",
      borderColor: "#2c2c2c",
      cornerStyle: "circle",
      transparentCorners: false,
      cornerSize: 10,
      stroke: "aqua",
      perPixelTargetFind: true,
      visible: true,
      evented: props.editPattern // 无法选中
    })
    if (props.editPattern) {
      if (
        img.getBoundingRect().width > props.boxWidth &&
        img.getBoundingRect().height > props.boxHeight
      ) {
        img.set({
          scaleX: 0.3,
          scaleY: 0.3
        })
      }
    } else {
      if (scale) {
        img.set({
          scaleX: props.boxWidth / img.getBoundingRect().width,
          scaleY: props.boxHeight / img.getBoundingRect().height
        })
      } else {
        img.set({
          scaleX: props.bgWidth / img.getBoundingRect().width,
          scaleY: props.bgHeight / img.getBoundingRect().height
        })
      }
    }
    // img.set({
    //   scaleX: 0.5,
    //   scaleY: 0.5,
    // })

    // 循环裁剪框变量 key值相同，添加到同一裁剪框内
    clipPathList.value.forEach(element => {
      // if (element.name === name) {
      img.clipPath = element
      // }
    })
    canvas.add(img)
    canvas.centerObject(img)

    // 获取中心点坐标
    let images: Coordinate = { key: img.cacheKey, x: img.left, y: img.top }
    centerCoordinate.push(images)
  })
}

// 键盘按下移动事件
enum Direction { // 键盘事件变量
  UP,
  DOWN,
  LEFT,
  RIGHT
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const moveSelected = (direction: number, canvas: any) => {
  const value = canvas.getActiveObject()
  switch (direction) {
    case Direction.LEFT:
      canvas.getActiveObject().set({
        left: value.left - 1
      })
      canvas.renderAll()
      break
    case Direction.UP:
      canvas.getActiveObject().set({
        top: value.top - 1
      })
      canvas.renderAll()
      break
    case Direction.RIGHT:
      canvas.getActiveObject().set({
        left: value.left + 1
      })
      canvas.renderAll()
      break
    case Direction.DOWN:
      canvas.getActiveObject().set({
        top: value.top + 1
      })
      canvas.renderAll()
      break
  }
  addCenterCoordinate(canvas.getActiveObject())
}

// 导出编辑内容图片区域
/**
 * exportImage 生成图片地址
 */
const exportImage = (canvas: fabric.Canvas) => {
  if (!props.editPattern) {
    return canvas.toDataURL({
      format: "png",
      // left: props.left,
      // top: props.top,
      width: props.bgWidth,
      height: props.bgHeight,
      quality: 0.8
    })
  }
  deleteRect(canvas)
  showGuide()
  return canvas.toDataURL({
    format: "png",
    left: props.left,
    top: props.top,
    width: props.boxWidth,
    height: props.boxHeight,
    quality: 0.8
  })
}

// 辅助线事件
let tops: fabric.Line // 辅助线top
let lefts: fabric.Line // 辅助线left
let centerCoordinate: Coordinate[] = reactive([])
/**
 *添加辅助线
 */
const addLine = (canvas: fabric.Canvas) => {
  lefts = new fabric.Line([1, 200, 500, 200], {
    strokeWidth: 1,
    fill: "#aaaaaa",
    stroke: "#aaaaaa",
    strokeDashArray: [1, 1],
    borderDashArray: [2, 2],
    objectCaching: true,
    selectable: false,
    visible: false
  })
  canvas.add(lefts)
  canvas.centerObject(lefts)
  tops = new fabric.Line([250, 600, 250, 100], {
    strokeWidth: 1,
    fill: "#aaaaaa",
    stroke: "#aaaaaa",
    strokeDashArray: [1, 1],
    borderDashArray: [2, 2],
    objectCaching: true,
    selectable: false,
    visible: false
  })
  canvas.add(tops)
  canvas.centerObject(tops)
}
/**
 *判断辅助线
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addCenterCoordinate = (options: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  centerCoordinate.forEach((element: any) => {
    if (element.key === options.cacheKey) {
      if (Math.ceil(options.top) === Math.ceil(element.y)) {
        tops.set({ visible: true })
      } else {
        tops.set({ visible: false })
      }
      if (Math.ceil(options.left) === Math.ceil(element.x)) {
        lefts.set({ visible: true })
      } else {
        lefts.set({ visible: false })
      }
    }
  })
}
/**
 *辅助线位置确认
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const guidePosition = (options: any) => {
  centerCoordinate.forEach(element => {
    if (element.key === options.cacheKey) {
      element.x = (props.bgWidth - options.getScaledWidth()) / 2
      element.y = (props.bgHeight - options.getScaledHeight()) / 2
    }
  })
}
/**
 *辅助线全部隐藏
 */
const showGuide = () => {
  tops.set({ visible: false })
  lefts.set({ visible: false })
}
defineExpose({
  /**
   * exportImage 生成图片地址
   */
  exportImage,
  /**
   *在画布上添加图片， Image: 图片地址
   */
  addImage
  /**
   *暴露canvas实例
   */
  // addCanvas,
})
</script>
<style scoped lang="scss">
#fabric-div {
  position: relative;
  backface-visibility: hidden;
  transition: all 0.5s;
}
#fabric-div-BackgroundPicture {
  position: absolute;
  left: 0px;
  top: 0px;
}
</style>
