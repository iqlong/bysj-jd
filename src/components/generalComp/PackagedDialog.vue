<template>
  <div>
     <!--其实就是将父的props attrs+listener slot class和style从父组件放到子组件  -->
    <el-dialog v-bind=$attrs v-on="$listeners">
      <template v-for="(item,name) in $slots" v-slot:[name]>
        <!-- 还是要避免使用item的vNode再template中 -->
        <slot :name="name" />
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import {Dialog} from 'element-ui'
  export default {
    name: 'PackageDialog',
    mounted() {
      console.log(this.$attrs,Dialog.attrs)
    }
  }
</script>

<style lang="less">

</style>
