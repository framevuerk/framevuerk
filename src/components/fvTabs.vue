<script>
    export default {
        data(){
            return {
                selectedTab: null
            }
        },
        props: {
            tabs: {
                type: Array
            }
        },
        computed: {
            pTabs(){
                let ret = [];
                this.tabs.forEach( (value, index)=>{
                    ret.push({
                        index: index,
                        slot: value.slot || value.title || value,
                        icon: value.icon || false,
                        title: value.title || value,
                        disabled: value.disabled || false
                    });
                });
                return ret;
            }
        },
        methods: {
            clickTab(slotName){
                this.selectedTab = slotName;
            }
        },
        mounted(){
            this.selectedTab = this.pTabs[0].slot;
        }
    }
</script>

<template lang="pug">
    fv-main.fv-tabs
            fv-header
                fv-button.fv-tab-button.fv-grow(v-for="tab in pTabs",
                    :key="tab.slot",
                    :class="{'fv-selected': tab.slot == selectedTab}",
                    @click="clickTab(tab.slot)"
                )
                    i(v-if="tab.icon",
                        :class="tab.icon"
                    )
                    span(v-html="tab.title")
            fv-content.no-padding.fv-tab(
                v-for="tab in pTabs",
                :key="tab.slot",
                v-show="tab.slot === selectedTab"
            )
                slot(:name="tab.slot")
</template>

<style lang="scss">
    @import "../styles/variables";
    @import "../styles/functions";
    @import "../styles/mixins";
    .fv-tabs{
        & > .fv-header{
            background: transparent;
            color: inherit;
            & > .fv-tab-button{
                text-align: center;
                cursor: pointer;
                height: 100%;
                background: transparent;
                color: inherit;
                box-shadow: inset 0 0 0 $theme-color;
                transition: all .25s;
                max-width: 70%;
                & i{
                    padding-left: 0.3em;
                }
                &.fv-selected{
                    box-shadow: inset 0 -4px 0 $theme-color;
                    color: $theme-color;
                }
            }
        }
    }
</style>