import { App, defineComponent, getCurrentInstance, h, onBeforeUnmount, onMounted, PropType } from 'vue';
import { bus, startApp } from 'wujie';
import { Props } from './type';

// 1. 定义组件
const Wujie = defineComponent({
  // 2. 定义 props
  props: {
    width: { type: String, default: '' },
    height: { type: String, default: '' },
    name: { type: String, default: '', required: true },
    loading: { type: HTMLElement, default: undefined },
    url: { type: String, default: '', required: true },
    sync: { type: Boolean, default: undefined },
    prefix: { type: Object, default: undefined },
    alive: { type: Boolean, default: undefined },
    props: { type: Object, default: undefined },
    attrs: { type: Object, default: undefined },
    replace: { type: Function as PropType<Props['replace']>, default: undefined },
    fetch: { type: Function as PropType<Props['fetch']>, default: undefined },
    fiber: { type: Boolean, default: undefined },
    degrade: { type: Boolean, default: undefined },
    plugins: { type: Array as PropType<Props['plugins']>, default: null },
    beforeLoad: { type: Function as PropType<Props['beforeLoad']>, default: null },
    beforeMount: { type: Function as PropType<Props['beforeMount']>, default: null },
    afterMount: { type: Function as PropType<Props['afterMount']>, default: null },
    beforeUnmount: { type: Function as PropType<Props['beforeUnmount']>, default: null },
    afterUnmount: { type: Function as PropType<Props['afterUnmount']>, default: null },
    activated: { type: Function as PropType<Props['activated']>, default: null },
    deactivated: { type: Function as PropType<Props['deactivated']>, default: null },
  },
  setup(props, { emit }) {
    const inst = getCurrentInstance();

    const evtHandler = (evtName: string, ...args: any[]) => {
      // 将内部事件发布到组件 emit
      emit(evtName, ...args);
    };

    onMounted(() => {
      // 4.2 事件中转
      bus.$onAll(evtHandler);

      // 4.1 挂载组件后 执行无界的 startApp 方法挂载
      startApp({
        name: props.name,
        url: props.url,
        el: inst?.refs.wujie as HTMLElement, // 需要使用 getCurrentInstance 方法获取组件示例 ref 名称在返回的渲染函数中定义
        loading: props.loading,
        alive: props.alive,
        fetch: props.fetch,
        props: props.props,
        attrs: props.attrs,
        replace: props.replace,
        sync: props.sync,
        prefix: props.prefix,
        fiber: props.fiber,
        degrade: props.degrade,
        plugins: props.plugins,
        beforeLoad: props.beforeLoad,
        beforeMount: props.beforeMount,
        afterMount: props.afterMount,
        beforeUnmount: props.beforeUnmount,
        afterUnmount: props.afterUnmount,
        activated: props.activated,
        deactivated: props.deactivated,
      });
    });

    onBeforeUnmount(() => {
      bus.$offAll(evtHandler);
    })

    // 3. 返回渲染函数
    return () =>
      h('div', {
        style: {
          width: props.width || '200',
          height: props.height || '200',
        },
        ref: 'wujie', // 这步是为了能在上面的 startApp 方法中寻找 el 挂载的元素
      });
  },
});


// 5. 注册 install 方法供 vue 使用
// app.use(...)
Wujie.install = (app: App, options?:{ name: string}) => {
  const compName = options?.name || 'WujieVue';
  app.component(compName, Wujie)
}

export default Wujie;