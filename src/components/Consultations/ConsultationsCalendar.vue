<template>
    <vue-cal class="calendar" :events="events"></vue-cal>
</template>

<style scoped>
    .calendar{
        height: 500px;
    }
    >>>.vuecal__event.vacation {background-color: rgba(253, 156, 66, 0.9);border: 1px solid rgb(233, 136, 46);color: #fff;}

    >>>.vuecal__event.consultation {
        background-color: green;
        border: 1px solid rgb(5, 99, 0);
        color: white;
    }

    >>>.vuecal__cell-events-count {    background: #fd9c42;}

</style>

<script>
    import VueCal from 'vue-cal';

    export default{
        name:"ConsultationsCalendar",
        components:
        {
            VueCal
        },
        props:
        {
            events:{
                type:[],
                required:true
            }

        }
    }
</script>