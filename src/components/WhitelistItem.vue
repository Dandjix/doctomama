<template>
    <v-card variant="plain">
        <v-row>
            <v-spacer></v-spacer>
            <v-col>
                <v-card-text>{{ email }}</v-card-text>
            </v-col>

            <v-col>
                <v-btn color="red" text="Supprimer" @click="$emit('delete',email)" :disabled="disabled"></v-btn>
            </v-col>
            <v-spacer></v-spacer>
        </v-row>

    </v-card>

</template>

<script>
    export default{
        name:'Whitelist-item',
        props:{
            email:{
                type: String,
                required: true
            },
            disabled:{
                type:Boolean,
                value:false
            }
        }
    }
</script>