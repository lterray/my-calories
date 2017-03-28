function MyCalorieListAPI(serverApiUrl) {
    var apiFunctions = {
        getOptions: function (callback) {
            var options = {};
            $.ajax({
                dataType: "json",
                url: serverApiUrl + '/options',
                success: function (data) {
                    options = data;
                },
                error: function () {
                    console.log("error during getting options");
                },
                async: false
            });
            return options;
        },
        setOption: function (optionName, value) {
            var options = {};
            $.ajax({
                url: serverApiUrl + '/options/' + optionName + '/' + value,
                type: 'post',
                success: function (data) {
                    console.log(data);
                },
                error: function () {
                    console.log("error during setting option");
                },
                async: false
            });
            return options;
        },
        getCalorieLimit: function () {
            var options = this.getOptions();
            var limit = options.hasOwnProperty('calorie-limit') ? options['calorie-limit'] : 0;
            return limit;
        },
        setCalorieLimit: function (limit) {
            this.setOption('calorie-limit', limit);
        },
        getEntries: function () {
            var entries = [];
            $.ajax({
                dataType: "json",
                url: serverApiUrl + '/calorie-entries',
                success: function (data) {
                    entries = data;
                },
                error: function () {
                    console.log("error during getting entries");
                },
                async: false
            });
            return entries;
        },
        getEntry: function (id) {
            var entry = {};
            $.ajax({
                dataType: "json",
                url: serverApiUrl + '/calorie-entries/' + id,
                success: function (data) {
                    entry = data;
                },
                error: function () {
                    console.log("error during getting entry");
                },
                async: false
            });
            return entry;
        },
        createEntry: function (date, time, text, numOfCalories, callback) {
            $.ajax({
                url: serverApiUrl + '/calorie-entries',
                type: 'put',
                data: {
                    date: date,
                    time: time,
                    text: text,
                    calories: numOfCalories
                },
                success: function (data) {
                    console.log("element has been created");
                },
                error: function () {
                    console.log("error during creation");
                },
                async: false
            });
        },
        saveEntry: function (id, date, time, text, numOfCalories, callback) {
            $.ajax({
                url: serverApiUrl + '/calorie-entries/' + id,
                type: 'post',
                data: {
                    id: id,
                    date: date,
                    time: time,
                    text: text,
                    calories: numOfCalories
                },
                success: function (data) {
                    console.log("element has been edited");
                },
                error: function () {
                    console.log("error during editing");
                },
                async: false
            });
        },
        deleteEntry: function (id) {
            $.ajax({
                url: serverApiUrl + '/calorie-entries/' + id,
                type: 'delete',
                success: function (data) {
                    console.log("element has been deleted");
                },
                error: function () {
                    console.log("error during delete");
                },
                async: false
            });
        }
    }
    return apiFunctions;
}