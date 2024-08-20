<template>
    <component :is="currentComponent" v-if="currentComponent" v-bind="currentProps" ref="dynamicRef" />
</template>

<script>
import { ref, shallowRef, reactive, defineExpose } from 'vue';

export default {
    setup() {
        const currentComponent = shallowRef(null);
        const currentProps = reactive({});
        const dynamicRef = ref(null);

        const render = (component, props = {}) => {
            component.test3 = 'test4';
            currentComponent.value = component;
            currentComponent.test1 = 'test2';
            Object.assign(currentProps, props);
        };

        const destroy = () => {
            currentComponent.value = null;
            Object.keys(currentProps).forEach(key => delete currentProps[key]);
        };

        const r = dynamicRef.$refs;

        defineExpose({ r, test1 : 'test2' });

        return {
            currentComponent,
            currentProps,
            render,
            destroy,
        };
    }
};
</script>
