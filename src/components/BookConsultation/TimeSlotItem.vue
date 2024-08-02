<template>
<v-card>
    <v-row class="d-flex align-center">
        <v-col cols="7">
            <v-card-text>de {{ startHour }} à {{ endHour }}</v-card-text>
        </v-col>
        <v-col cols="5">
            <v-btn small color="primary" @click="">Réserver</v-btn>
        </v-col>
    </v-row>
</v-card>
</template>

<style scoped>
.v-card {
  display: inline-flex;
  align-items: center;
  padding: 8px; /* Optional: adjust padding if needed */
}
</style>

<script>
export default{
    name:"TimeSlotItem",
    data(){
        return{

        }
    },
    computed:{
        startHour(){
            return this.formatTime(this.start)
        },
        endHour(){
            const end = new Date(this.start)
            end.setMinutes(this.start.getMinutes()+this.duration)
            return this.formatTime(end)
        }
    },
    methods:{
        formatTime(time)
        {
            // console.log("time : "+JSON.stringify(time));
            const h = zeroPad(time.getHours())
            const m = zeroPad(time.getMinutes())
            return `${h}:${m}`
        }
    },
    props:{
        title:{
            type:String,
            required:true
        },
        start:{
            type:Date,
            required:true
        },
        duration:{
            type:Number,
            required:true
        }
    }
}

function zeroPad(value)
{
    return String(value).padStart(2,'0')
}


</script>