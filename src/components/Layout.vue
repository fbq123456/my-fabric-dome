<script setup lang="ts">
import { ref, onMounted } from "vue"
import FabricPage from "./FabricPage.vue"
import icon from "../assets/logo.png"
import images from "../assets/t.png"
import Bg from "../assets/b.png"
let BgWidth = ref(452)
let BgHeight = ref(548)
let BoxWidth = ref(200)
let BoxHeight = ref(400)
let BgColor = ref("#ffff")
let list = ref()
const image = images
const fabricRef = ref<InstanceType<typeof FabricPage>>()
const addIma = () => {
  // fabricRef.value?.addClipPath(list.value)

  fabricRef.value?.addImage(canvasDom, icon)
}
const addIcon = () => {
  fabricRef.value?.addImage(canvasDom, "http://localhost:3000/00bdbb0d-7067-460f-9fb2-85101e61ba37")
}
const addIcons = () => {
  fabricRef.value?.addImage(canvasDom, icon)
}
const preservation = () => {
  // console.log(fabricRef.value?.exportImage())
}

const backChange = (e: any) => {
  BgColor.value = e.target.value
}
let canvasDom: any = null
const getCanvas = (value: any) => {
  canvasDom = value
}

let canvas: any = null
const getCanvaslist = (value: any) => {
  canvas = value
}

const notifyMe = () => {
  // 发出通知
  new Notification("数据已更新，请立即查看", {
    body: "具体信息。。。",
    icon: "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png",
    requireInteraction: true,
    image: "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
  })
}

onMounted(() => {
  notifyMe()
})
</script>

<template>
  <select id="tshirt-color" @change="backChange">
    <option value="#fff">White</option>
    <option value="#000">Black</option>
    <option value="#f00">Red</option>
    <option value="#008000">Green</option>
    <option value="#ff0">Yellow</option>
  </select>
  <button @click="addIma">ASDADS</button>
  <button @click="addIcon">图案</button>
  <button @click="addIcons">图案2</button>
  <button @click="preservation">保存</button>
  <div style="display: flex; justify-content: center">
    <FabricPage
      id="fabric-div-canvas"
      :image="image"
      ref="fabricRef"
      :bgColor="BgColor"
      :bgWidth="BgWidth"
      :bgHeight="BgHeight"
      :boxHeight="BoxHeight"
      :boxWidth="BoxWidth"
      :editPattern="true"
      :left="26"
      :top="126"
      @addCanvas="getCanvas"
    />
    <!-- <FabricPage
      id="fabric-div-canvas-asd"
      :image="image"
      ref="fabricRefasd"
      :bgColor="BgColor"
      :bgWidth="BgWidth"
      :bgHeight="BgHeight"
      :boxHeight="BoxHeight"
      :boxWidth="BoxWidth"
      :left="26"
      :top="126"
      :editPattern="true"
      @addCanvas="getCanvaslist"
    /> -->
  </div>
</template>

<style></style>
