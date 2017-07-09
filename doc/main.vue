<script>
    export default {
        computed: {
            sidebarItems(){
                const ret = [];
                COMPONENTS.forEach(component=>{
                    ret.push({
                        key: component,
                        icon: 'fa fa-puzzle-piece',
                        text: ` ${component}`,
                        selected: this.$route.name === component,
                        action: ()=>{
                            this.$router.push(`/components/${component}`);
                        }
                    });
                });
                return ret;
            },
            sidebarTabs(){
                return [
                    {title: 'Components', slot: 'components'},
                    {title: 'Directives', slot: 'directives'},
                    {title: 'Styles', slot: 'styles'}
                ]
            }
        }
    }
</script>

<template lang="pug">
    fv-main#app
        fv-header
            fv-button.fv-primary.fv-icon.fv-hide-on-lg(@click="$refs.sidebar.toggle()")
                i.fa.fa-bars
            div.fv-title
                h2 {{$route.name}}
        fv-sidebar.sidebar(:pin="null", ref="sidebar", :width="300")
            fv-header(:height="150")
                div.fv-title.fv-text-center
                    h1 Framevuerk
                    p.fv-word-wrap Awesome fully responsive Vue.js framevuerk!
            fv-tabs(:tabs="sidebarTabs")
                fv-list.no-outline-border(:items="sidebarItems", slot="components")
        router-view
        fv-footer
            div.fv-grow
            a
                i.fa.fa-2x.fa-github
</template>

<style lang="scss">
    #app .sidebar{
        & .fv-header{
            background: #313840;
            & .fv-title h1{
                font-size: 2em;
            }
            & *{
                line-height: 1.3em;
            }
        }
        & .fv-tabs{
            max-height: calc( 100% - 150px);
        }
        & .fv-list{
            & .fa{
                font-size: 1.3em;
                margin-right: 5px;
            }
            & .fv-item.selected{
                background: rgba(255,255,255,0.1);
            }
        }
    }
</style>