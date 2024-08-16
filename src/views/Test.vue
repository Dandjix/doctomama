<template>
    <vue-cal 
    style="height: 500px;" 
    :events="events"

    :time-from="min"
    :time-to="max"
    :special-hours="specialHours"
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
            const dailyHours = { from: 9 * 60, to: 18 * 60, class: 'business-hours' }


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
                ],
                min:480,
                max:1000,

                specialHours: {
                    1: dailyHours,
                    2: dailyHours,
                    3: [
                        { from: 9 * 60, to: 12 * 60, class: 'business-hours' },
                        { from: 14 * 60, to: 18 * 60, class: 'business-hours' }
                    ],
                    4: dailyHours,
                    5: dailyHours
                }
            }
        }
    }
</script>

<style>
.business-hours {
  background-color: rgba(255, 255, 0, 0.15);
  border: solid rgba(255, 210, 0, 0.3);
  border-width: 2px 0;
}
</style>