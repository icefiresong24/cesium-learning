<script lang="ts" setup>
import { defineComponent, onMounted, ref } from 'vue';
import * as Cesium from 'cesium';
onMounted(() => {
  //   let defaultAccessToken = "";
  // Cesium.Ion.defaultAccessToken = defaultAccessToken;
  let viewer = new Cesium.Viewer("map", {
    imageryProvider : new Cesium.ArcGisMapServerImageryProvider({
    //url : 'http://192.168.0.205:6080/arcgis/rest/services/GDSTXF/QGSLT_3857/MapServer',//矢量
    // 	url: "//services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
    //url:"http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer"//午夜蓝
    url:"https://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}"
     }),
    //baseLayerPicker: false, //关闭图层选择器
    //放大镜图标，查找位置工具，查找到之后会将镜头对准找到的地址，默认使用bing地图
    //geocoder: false,
    //房子图标，视角返回初始位置
    //homeButton: false,
    //经纬网图标，选择视角的模式，有三种：3D，2D，哥伦布视图（2.5D)
    //sceneModePicker: false,
    //地图图标，图层选择器，选择要显示的地图服务和地形服务,默认会用到cesium.ion
    baseLayerPicker: false,
    //问号图标，导航帮助按钮，显示默认的地图控制帮助
    navigationHelpButton: false,
    animation: false, //动画器件，显示当前时间，允许跳转特定时间
    timeline: false, //时间轴
    //全屏图标，全屏按钮
    fullscreenButton: false,
    //虚拟现实
    //vrButton: true,
    //阴影
    shadows: true,
    //点击后显示详细信息
    //infoBox: true,
    //展示数据版权属性
    // CreditsDisplay: false,
    //terrainExaggeration: 3.0, //地形夸大
    shouldAnimate: true,
  });

  (function () {
    (viewer.cesiumWidget.creditContainer as any).style.display = "none"; //隐藏版本信息
    //viewer.scene.debugShowFramesPerSecond = true; //显示帧率,帧率与显示流畅度有关，或说与显卡有关
    viewer.scene.skyBox.show = true; //是否显示星空
    //viewer.scene.backgroundColor = Cesium.Color.BLUE;//地球背景颜色
    viewer.scene.sun.show = true; //是否显示太阳
    viewer.scene.moon.show = true; //是否显示有月亮
    viewer.scene.skyAtmosphere.show = true; //是否隐藏大气圈
    viewer.scene.globe.show = true; //是否显示地球
    //Rectangle(west, south, east, north)
    var lon = 100.48;
    var lat = 30;
    Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(lon, lat, lon + 1, lat + 1);
    Cesium.Camera.DEFAULT_VIEW_FACTOR = 2.8;
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(lon, lat, 19000000.0),
      orientation: {
        //此视角为观察者/相机
        heading: 0, //Cesium.Math.toRadians(0),//偏航
        pitch: Cesium.Math.toRadians(-90.0), //俯仰，人如果在赤道上空，俯仰角为0可见地球。如果在北纬，俯仰角为负才能见地球
        roll: 0.0, //翻滚
      },
    });
  })();

  let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function (event: any) {
    let cartesian = viewer.camera.pickEllipsoid(event.position);
    let cartographic = Cesium.Cartographic.fromCartesian(cartesian as any);
    let lng = Cesium.Math.toDegrees(cartographic.longitude); // 经度
    let lat = Cesium.Math.toDegrees(cartographic.latitude); // 纬度
    let alt = cartographic.height; // 高度，椭球面height永远等于0
    let coordinate = {
      longitude: Number(lng.toFixed(6)),
      latitude: Number(lat.toFixed(6)),
      altitude: Number(alt.toFixed(2)),
    };
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(coordinate.longitude, coordinate.latitude, 0),
      point: {
        color: Cesium.Color.RED,
        pixelSize: 24,
      },
    });
    console.log(coordinate);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  var tilesetModel = new Cesium.Cesium3DTileset({
    url: "/models/bridge/tileset.json",
  });
  viewer.scene.primitives.add(tilesetModel);
  tilesetModel.readyPromise.then(function (currentModel) {
    var scene = viewer.scene;
    var globe = scene.globe;
    //开启地下可视化
    scene.screenSpaceCameraController.enableCollisionDetection = false;
    globe.translucency.frontFaceAlphaByDistance = new Cesium.NearFarScalar(1000.0, 0.0, 2000.0, 1.0);
    globe.translucency.enabled = true;
    (window as any).tileModel = currentModel;
    scene.globe.depthTestAgainstTerrain = true;
    viewer.zoomTo(currentModel, new Cesium.HeadingPitchRange(-0.5, -0.5, 800));
    var boundingSphere = currentModel.boundingSphere;
    var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
    //获取模型中心点经纬度坐标
    // that.tileModelTool.longitude =
    //   (cartographic.longitude / Math.PI) * 180;
    // that.tileModelTool.latitude =
    //   (cartographic.latitude / Math.PI) * 180;
    // that.tileModelTool.height = cartographic.height;

    // //修改3dtiles位置，input，range组件的change事件绑定此函数
    // that.update3dtilesMaxtrix();

    // //模型点击事件
    // attachTileset(viewer, currentModel);
    // that.tileModelToolVisiable = true; //显示3dtiles调整工具
  });
});
</script>
<template>
  <div id="map"></div>
</template>
<style scoped lang="scss"></style>
