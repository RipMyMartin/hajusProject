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
        },
        openEditForm: async function (id) {
            let gameInfoModal = bootstrap.Modal.getInstance(document.getElementById('gameInfoModal'));
            if (gameInfoModal) gameInfoModal.hide();

            this.selectedGame = await (await fetch(`/games/${id}`)).json();
            let editFormModal = new bootstrap.Modal(document.getElementById('editFormModal'));
            editFormModal.show();
        },
        openDeleteForm: async function (id) {
            let gameInfoModal = bootstrap.Modal.getInstance(document.getElementById('gameInfoModal'));
            if (gameInfoModal) gameInfoModal.hide();

            this.selectedGame = await (await fetch(`/games/${id}`)).json();
            let deleteFormModal = new bootstrap.Modal(document.getElementById('deleteFormModal'));
            deleteFormModal.show();
        },
        openAddForm: async function () {
            this.selectedGame = { id: null, name: '', price: null };
            let addFormModal = new bootstrap.Modal(document.getElementById('addFormModal'));
            addFormModal.show();
        },

        updateGame: async function () {
            try {
                const response = await fetch(`/games/${this.selectedGame.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: this.selectedGame.name,
                        price: this.selectedGame.price
                    })
                });

                if (response.ok) {
                    this.games = await (await fetch('/games')).json();
                    let editFormModal = bootstrap.Modal.getInstance(document.getElementById('editFormModal'));
                    if (editFormModal) editFormModal.hide();
                }
            } catch (error) {
                console.error('Edit Game Error:', error);
            }
        },
        deleteGame: async function () {
            try {
                const response = await fetch(`/games/${this.selectedGame.id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    this.games = await (await fetch('/games')).json();
                    let deleteFormModal = bootstrap.Modal.getInstance(document.getElementById('deleteFormModal'));
                    if (deleteFormModal) deleteFormModal.hide();
                }
            } catch (error) {
                console.error('Delete Game Error:', error);
            }
        },
        addGame: async function () {
            try {
                const response = await fetch('/games', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: this.selectedGame.name,
                        price: this.selectedGame.price
                    })
                });
                if (response.ok) {
                    this.games = await (await fetch('/games')).json();
                    let addFormModal = bootstrap.Modal.getInstance(document.getElementById('addFormModal'));
                    if (addFormModal) addFormModal.hide();
                }
            } catch (error) {
                console.error('Add Game Error:', error);
            }
        },
    }
}).mount('#app');