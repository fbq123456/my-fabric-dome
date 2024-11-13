<template>
  <label for="tshirt-design">T-Shirt Design:</label>
  <button @click="addfrom">sadad</button>
  <select id="tshirt-design">
    <option value="">Select one of our designs ...</option>
    <option :value="icon">Batman</option>
  </select>

  <label for="tshirt-color">T-Shirt Color:</label>
  <select id="tshirt-color">
    <option value="#fff">White</option>
    <option value="#000">Black</option>
    <option value="#f00">Red</option>
    <option value="#008000">Green</option>
    <option value="#ff0">Yellow</option>
  </select>
  <div
    id="tshirt-div"
    :style="{
      width: `${BgWidth}px`,
      height: `${BgHeight}px`
    }"
  >
    <img id="tshirt-backgroundpicture" :src="imag" />
    <canvas id="tshirt-canvas"></canvas>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue"
import { fabric } from "fabric"
import imag from "../assets/t.png"
import b from "../assets/b.png"
import de from "../assets/delete.svg"
import icon from "../assets/logo.png"
// import { Transform } from 'fabric/fabric-impl'
let canvas: any = null
var deleteBtn: any = null
let areaRect = ref()
let color = ref("red")
let BgWidth = 452
let BgHeight = 548
let BoxWidth = 200
let BoxHeight = 400
let clipPath: any
onMounted(() => {
  canvas = new fabric.Canvas("tshirt-canvas")
  deleteBtn = document.createElement("img")
  deleteBtn.src = de
  canvas.setWidth(BgWidth)
  canvas.setHeight(BgHeight)
  canvas.selection = false
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
  fabric.Object.prototype.set({
    hasRotatingPoint: false //是否显示旋转按钮
  })
  canvas.controlsAboveOverlay = true
  fabric.Object.prototype.padding = 10
  fabric.Object.prototype.borderColor = "dodgerblue"
  fabric.Object.prototype.cornerStyle = "circle"
  fabric.Object.prototype.cornerColor = "white"
  fabric.Object.prototype.cornerSize = 10
  fabric.Object.prototype.transparentCorners = false
  fabric.Object.prototype.cornerStrokeColor = "gray"
  fabric.Object.prototype.controls.mtr.withConnection = false
  fabric.Object.prototype.controls.mtr.offsetY = -20
  fabric.Object.prototype.controls.mtr.cursorStyle = "pointer"
  fabric.Object.prototype.transparentCorners = false
  fabric.Object.prototype.controls.mtr.offsetY = -20
  fabric.Object.prototype.controls.mtr.cursorStyle = "pointer"
  //   left: (props.BgWidth - props.BoxWidth) / 2,
  // top: (props.BgHeight - props.BoxHeight) / 2,
  clipPath = new fabric.Rect({
    width: BoxWidth,
    height: BoxHeight,
    top: (BgHeight - BoxHeight) / 2,
    left: (BgWidth - BoxWidth) / 2,
    absolutePositioned: true
  })
  // var clipPath2 = new fabric.Rect({ width: BoxWidth, height:BoxHeight, top: 0, left: 0, absolutePositioned: true });
  fabric.Image.fromURL(b, function (img) {
    img.clipPath = clipPath
    // img.scaleToWidth(500);
    canvas.add(img)
  })
  // fabric.Object.prototype.controls.extend = new fabric.Control({})
  fabric.Object.prototype.controls.mtr = new fabric.Control({
    x: 0,
    y: -0.5,
    offsetY: -20,
    cursorStyle: "pointer",
    // actionHandler: fabric.controlsUtils.rotationWithSnapping,
    // actionHandler:addhh,
    actionName: "rotate",
    render: renderIcon // 图标资源
  })
  // 添加图标

  // fabric.Image.fromURL(b, function(img) {
  //   img.clipPath = clipPath2;
  //   img.scaleToWidth(500);
  //   img.top = 250;
  //   canvas.add(img);
  // });
  // init()
  // const list: any = document.getElementById('tshirt-design')
  // list.addEventListener(
  //   'change',
  //   function () {
  //     // updateTshirtImage(canvas)
  //     addfrom()
  //   },
  //   false
  // )
  // document.getElementById('tshirt-color').addEventListener(
  //   'change',
  //   function (e) {
  //     document.getElementById('tshirt-div').style.backgroundColor = this.value
  //     color.value = this.value
  //     // console.log(areaRect.value.set({fill:color.value}));
  //   },
  //   false
  // )
  // init()
})
const renderIcon = (ctx: any, left: any, top: any, fabricObject: any) => {
  var size = 20
  ctx.save()
  ctx.translate(left, top)
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle))
  ctx.drawImage(deleteBtn, -size / 2, -size / 3, size, size)
  ctx.restore()
}
// const addhh = (eventData: MouseEvent, transformData: Transform, x: number, y: number) => {
// console.log(eventData,transformData,x,y);
// var target = transformData.target

//  return true
// }
// 图标删除事件
const deleteObject = (eventData: MouseEvent, transform: fabric.Transform) => {
  var target = transform.target
  canvas.remove(target)
  canvas.requestRenderAll()
  return false
}
const addfrom = () => {
  fabric.Image.fromURL(b, function (img) {
    img.clipPath = clipPath
    // img.scaleToWidth(500);
    canvas.add(img)
  })
  // fabric.Image.fromURL(icon, function (img) {
  //   console.log(img.getBoundingRect().height / 2)
  //   console.log(
  //     img.getBoundingRect().width - (img.getBoundingRect().width - 200)
  //   )
  //   let meWidth: number =
  //     img.getBoundingRect().width - (img.getBoundingRect().width - 200)
  //   img.set({
  //     strokeDashArray: [5, 5],
  //     borderDashArray: [4, 4],
  //     cornerColor: '#000000',
  //     borderColor: '#a9a9a9',
  //     cornerStyle: 'circle',
  //     transparentCorners: false,
  //     cornerSize: 10,
  //     stroke: 'aqua',
  //     perPixelTargetFind: true,
  //     rx: 40,
  //     visible: true,
  //     // globalCompositeOperation: 'xor',
  //   })
  //   if (
  //     img.getBoundingRect().width > 200 &&
  //     img.getBoundingRect().height > 400
  //   ) {
  //     img.set({
  //       scaleX: 0.3,
  //       scaleY: 0.3,
  //     })
  //   }
  //   canvas.add(img)
  //   canvas.centerObject(img)
  // })
}

// function updateTshirtImage(canvas) {
//   init(canvas)
//   // fabric.Image.fromURL(imageURL, function (img) {
//   //   img.scaleToHeight(300)
//   //   img.scaleToWidth(300)
//   //   canvas.centerObject(img)
//   //   canvas.add(img)
//   //   canvas.renderAll()
//   // })
// }
</script>
<style scoped lang="scss">
.drawing-area {
  position: absolute;
  top: 60px;
  left: 122px;
  z-index: 10;
  width: 200px;
  height: 400px;
}

.canvas-container {
  width: 200px;
  height: 400px;
  position: relative;
  user-select: none;
}

#tshirt-div {
  position: relative;
  background-color: #fff;
}

#tshirt-backgroundpicture {
  position: absolute;
  left: 0px;
  top: 0px;
}
#tshirt-canvas {
  position: absolute;
  left: 0px;
  top: 0px;
}
</style>
