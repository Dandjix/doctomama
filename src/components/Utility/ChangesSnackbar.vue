<template>
    <v-snackbar
        v-model="snackbar"
        :timeout="timeout"
        @input="updateValue"
    >
        {{ message }}
    </v-snackbar>
</template>

<script>
export default {
    name: "Changes-Snackbar",
    props: {
        value: {
            type: Boolean,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        timeout: {
            type: Number,
            default: 3000 // Set a default timeout value if needed
        }
    },
    data() {
        return {
            snackbar: this.value
        };
    },
    watch: {
        value(newVal) {
            this.snackbar = newVal;
        }
    },
    methods: {
        updateValue(val) {
            this.$emit('input', val);
        }
    }
}
</script>
