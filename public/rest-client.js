const vue = Vue.createApp({
    data() {
        return {
            selectedGame: { name: null },
            games: [],
            allGames: [],
            searchQuery: '',
            sortField: '',
            sortOrder: 'asc'
        };
    },
    async created() {
        this.allGames = await (await fetch('/games')).json();
        this.games = this.allGames;
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

        searchGames: function () {

            if (this.searchQuery.trim() === '') {
                this.games = this.allGames;
            } else {
                this.games = this.allGames.filter(game =>
                    game.name.toLowerCase().includes(this.searchQuery.toLowerCase())
                );
            }

            if (this.sortField) {
                this.applySorting();
            }
        },

        sortBy: function (field) {

            if (this.sortField === field) {
                this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
            } else {

                this.sortField = field;
                this.sortOrder = 'asc';
            }
            this.applySorting();
        },

        applySorting: function () {
            // Создаём новый отсортированный массив
            this.games = [...this.games].sort((a, b) => {
                let valueA = a[this.sortField];
                let valueB = b[this.sortField];


                if (typeof valueA === 'string') {
                    valueA = valueA.toLowerCase();
                    valueB = valueB.toLowerCase();
                }

                if (valueA < valueB) {
                    return this.sortOrder === 'asc' ? -1 : 1;
                }
                if (valueA > valueB) {
                    return this.sortOrder === 'asc' ? 1 : -1;
                }
                return 0;
            });
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
                    this.allGames = await (await fetch('/games')).json();
                    this.games = this.allGames;
                    this.searchQuery = '';

                    if (this.sortField) {
                        this.applySorting();
                    }
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
                    this.allGames = await (await fetch('/games')).json();
                    this.games = this.allGames;
                    this.searchQuery = '';

                    if (this.sortField) {
                        this.applySorting();
                    }
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
                    this.allGames = await (await fetch('/games')).json();
                    this.games = this.allGames;
                    this.searchQuery = '';

                    if (this.sortField) {
                        this.applySorting();
                    }
                    let addFormModal = bootstrap.Modal.getInstance(document.getElementById('addFormModal'));
                    if (addFormModal) addFormModal.hide();
                }
            } catch (error) {
                console.error('Add Game Error:', error);
            }
        },
    }
}).mount('#app');