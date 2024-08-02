<template>

    <v-col>
        <v-container v-for="timeSlots in timeSlotsPerDay" :key="timeSlots.day">
            <v-row>
                <h3>{{formatDate(timeSlots.date)}}</h3>
            </v-row>
            <v-row class="d-flex justify-space-between">
                <TimeSlotItem :start="timeSlot.start" :duration="duration" v-for="timeSlot in timeSlots.timeSlots" :key="timeSlot.id"></TimeSlotItem>
            </v-row>
        </v-container>
    </v-col>
    <!-- {{ timeSlotsPerDay }} -->
</template>

<script>
    import TimeSlotItem from './TimeSlotItem.vue';

    export default{
        name:"TimeSlotsList",
        components:{
            TimeSlotItem
        },
        props:{
            timeSlots:{
                type:Array,
                required:true
            },
            duration:{
                type:Number,
                required:true
            }
        },
        data(){
            return{

            }
        },
        computed:{
            timeSlotsPerDay()
            {
                var days = []
                // console.log(" just tried to get tspd !");
                for (let i = 0; i < this.timeSlots.length; i++) {
                    const timeSlot = this.timeSlots[i];
                    var dateOfSlot = new Date(timeSlot.start)
                    dateOfSlot.setHours(0,0,0,0)
                    if(!isInArray(days,dateOfSlot))
                    {
                        days.push({date:dateOfSlot, timeSlots:[timeSlot]})
                    }
                    else
                    {
                        const index = indexOfDate(days,dateOfSlot)
                        days[index].timeSlots.push(timeSlot)
                    }
                }
                return days;
                // return [{day:new Date(),timeSlots:this.timeSlots}]
            }
        },
        methods:{
            formatDate(date) {
                // console.log("date : "+JSON.stringify(date));

                // Define arrays for day names and month names in French
                const daysOfWeek = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
                const monthsOfYear = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
                
                // Extract day, month, and year from the date
                const dayOfWeek = daysOfWeek[date.getDay()]; // getDay() returns 0-6 (Sunday-Saturday)
                const day = date.getDate(); // getDate() returns the day of the month
                const month = monthsOfYear[date.getMonth()]; // getMonth() returns 0-11 (January-December)
                const year = date.getFullYear(); // getFullYear() returns the year
                
                // Return the formatted date string
                return `${dayOfWeek} ${day} ${month} ${year}`;
            }
        }
    }
    function isInArray(array, value) {
        return !!array.find(item => {return item.date.getTime() == value.getTime()});
    }       
    function indexOfDate(array,value)
    {
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if(element.date.getTime()==value.getTime())
                return i
        }
        return -1
    }
</script>