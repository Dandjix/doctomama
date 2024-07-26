
<template>
    <!-- <v-table density="compact"> -->
    <v-table>
        <thead>
            <tr>
                <th>Nom du type de consultation</th>
                <th>Durée (minutes)</th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr
                v-for="consult in consultationTypes"
                :key="consult.name"
            >
                <td>{{ consult.nom }}</td>
                <td>{{ consult.duree_minutes }}</td>
                <td>
                    <v-btn color="secondary" :to="'/consultationTypes/update/'+consult.id">Modifier</v-btn>
                </td>
                <td>
                    <v-btn color="red">Supprimer</v-btn>
                </td>
            </tr>
        </tbody>
    </v-table>
</template>
<script>
import consultationTypesService from '@/services/ConsultationTypesService'
export default{
    name:"ConsultationTypesList",
    data(){
        return{
            consultationTypes:[]
        }
    },
    methods:{

    },
    async mounted()
    {
        this.consultationTypes = await consultationTypesService.getConsultationTypes()
    }
}
</script>