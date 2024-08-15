<template>
    <vue-cal 
    style="height: 500px;" 
    :events="events"
    :time="false"
    ></vue-cal>
</template>

<script>
    import VueCal from 'vue-cal'


    export default{
        name:"TestPage",
        components:{
            VueCal
        },
        data(){
            return{
                events:[
                // {
                //     start:'2024-08-13',
                //     end:'2024-08-13',
                //     title:"timeless",
                //     class:"colored"
                // },
                {
                    start:'2024-08-13',
                    end:'2024-08-13',
                    title: 'Need to go shopping',
                    content: '<i class="icon material-icons">shopping_cart</i>',
                    class: 'leisure'
                },
            ]
            }
        }
    }
</script>

<style>
    .colored{
        background-color: aqua;
        color: black;
    }

    .vuecal__event.leisure {background-color: rgba(253, 156, 66, 0.9);border: 1px solid rgb(233, 136, 46);color: #fff;}
.vuecal__event.sport {background-color: rgba(255, 102, 102, 0.9);border: 1px solid rgb(235, 82, 82);color: #fff;}
</style>