<script>
    export default {
        mounted(){
            console.log('fvMain mounted')
        }
    }
</script>

<template lang="pug">
    fv-content.fv-row
        div.fv-col-md-12.fv-col-offset-md-1.fv-col-lg-8.fv-col-offset-lg-2
            p This is main part of framevuerk. The fvHeader, fvSidebar, fvContent and fvFooter components usually uses this container for best styles matching. It`s easy. Look bellow:
            hr
            h3 Props:
            fv-table(local,
                :fields="['name', 'type', 'default', 'description']",
                :footer="false",
                :rows="[{name: 'height', type: 'Number', description: 'Height of viewport'}]")
</template>

<style lang="scss">

</style>