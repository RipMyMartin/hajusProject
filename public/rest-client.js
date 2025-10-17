const vue = Vue.createApp({
    data() {
        return { selectedGame: { name: null }, games: [] };
    },
    async created() {
        this.games = await (await fetch('/games')).json();
    },
    methods: {
        getGame: async function (id) {
            this.selectedGame = await (await fetch(`/games/${id}`)).json();
            let gameInfoModal = new bootstrap.Modal(document.getElementById('gameInfoModal'));
            gameInfoModal.show();
        }
    }
}).mount('#app');