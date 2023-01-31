<template>
<button onclick="scale">scale</button>
</template>
<script setup lang='ts'>

const emits=defineEmits(['scale']);
const scale=function () {
    emits('scale');
}

</script>
<style scoped lang='scss'>

</style>


