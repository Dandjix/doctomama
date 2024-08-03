<template>
    <v-sheet class="mx-auto" width="400">
        <v-spacer></v-spacer>
        <v-text-field label="Email" prepend-inner-icon="mdi-magnify" v-model="patern" @input="updateValue"></v-text-field>
        <v-spacer></v-spacer>
    </v-sheet>
</template>

<script>
    export default{
        name:'emailSearch',
        data(){
            return {
                patern:''
            }
        },
        props:{
            modelValue:
            {
                type:String,
                default:''
            }
        },
        watch:{
            modelValue(newVal){
                this.patern = newVal
            }
        },
        methods:{
            updateValue()
            {
                this.$emit('update:modelValue',this.patern)
            }
        }
    }
</script>