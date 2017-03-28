function MyCalorieClient(serverUrl, callbackAfterListRefresh, dailyLimitInput,
                         calorieDaysDiv,dayTemplateSeletor, entryTemplateSelector,
                         entryContainerSelector) {
    var calorieListApi = MyCalorieListAPI(serverUrl);
    
    var clientFunctions = {
        calorieEntries: [],
        loadCalorieDays: function () {
            var entries = calorieListApi.getEntries();
            this.calorieEntries = entries.sort(this.sortEntries);
            this.showCalorieDays(this.calorieEntries);
            callbackAfterListRefresh();
        },
        initFields: function () {
            var self = this;
            dailyLimitInput.val(calorieListApi.getCalorieLimit())
                            .change(function() {
                                var newLimit = parseInt($(this).val());
                                if (newLimit && newLimit > 0) {
                                    calorieListApi.setCalorieLimit(newLimit);
                                    self.loadCalorieDays();
                                } else {
                                    $(this).val(calorieListApi.getCalorieLimit());
                                    alert('Limit must be positive number!');
                                }
                            });
        },
        showCalorieDays: function (entries) {
            calorieDaysDiv.html('');
            var calorieLimit = calorieListApi.getCalorieLimit();
            var entriesForDay = [];
            var lastDate = '';
            var dailyCalories = 0;

            for (var i = 0; i < entries.length; i++) {
                var currentEntry = entries[i];
                if (entriesForDay.length === 0 || currentEntry.date === lastDate) {
                    // there can be other entries for this date yet
                    entriesForDay.push(currentEntry);
                    dailyCalories += parseInt(currentEntry.calories);
                    lastDate = currentEntry.date;
                } else {
                    // current element has different date than the previous entry
                    this.showDay(entriesForDay, dailyCalories, lastDate, calorieLimit);
                    entriesForDay = [currentEntry];
                    dailyCalories = parseInt(currentEntry.calories);
                    lastDate = currentEntry.date;
                }
            }
            // writes out last day
            if (entriesForDay.length !== 0) {
                this.showDay(entriesForDay, dailyCalories, lastDate, calorieLimit);
            }
        },
        showDay: function (entries, dailyCalories, date, limit) {
            // create day panel from template
            var template = $.templates(dayTemplateSeletor);
            var dayHtmlOutput = template.render({
                aboveLimit: dailyCalories > limit,
                date: date,
                dailyCalories: dailyCalories
            });
            calorieDaysDiv.append(dayHtmlOutput);
            
            // create entries from template
            var template = $.templates(entryTemplateSelector);
            for (var i = 0; i < entries.length; i++) {
                var currentEntry = entries[i];
                var entryHtmlOutput = template.render(currentEntry);
                calorieDaysDiv.find(entryContainerSelector).append(entryHtmlOutput);
            }
        },
        deleteEntry: function (id) {
            var entries = calorieListApi.deleteEntry(id);
            this.loadCalorieDays();
        },
        saveEntry: function (id, date, time, text, numOfCalories) {
            if (id === '') {
                calorieListApi.createEntry(date, time, text, numOfCalories);
            } else {
                calorieListApi.saveEntry(id, date, time, text, numOfCalories);
            }
            this.loadCalorieDays();
        },
        sortEntries(entryLeft, entryRight) {
            var dateLeft = (new Date(entryLeft.date + ' ' + entryLeft.time)).getTime();
            var dateRight = (new Date(entryRight.date + ' ' + entryRight.time)).getTime();
            return dateRight - dateLeft;
        },
    }
    
    return clientFunctions;
}

var calorieList = {};
$(document).ready(function () {
    
    var dailyLimitInput = $('#daily-limit');
    var calorieDaysDiv = $("#calorie-days");
    var dayTemplateSeletor = '#day-template';
    var entryTemplateSelector = '#entry-template';
    var entryContainerSelector = '.entry-container:last';
            
    var entryActionsInit = function() {
        $('.entry-edit').click(function(){
            var rowToEdit = $(this).parents('.row:first');
            var modalForm = $('#edit-modal form');
            
            modalForm.find('#entry-id').val(rowToEdit.find('.entry-id').data('id'));
            modalForm.find('#entry-date').val(rowToEdit.find('.entry-date').data('date'));
            modalForm.find('#entry-time').val(rowToEdit.find('.entry-time').data('time'));
            modalForm.find('#entry-text').val(rowToEdit.find('.entry-text').data('text'));
            modalForm.find('#entry-calories').val(rowToEdit.find('.entry-calories').data('calories'));
            $('#edit-modal').modal();
        });
        $('.entry-delete').click(function(){
            var rowToDelete = $(this).parents('.row:first');
            calorieList.deleteEntry(rowToDelete.find('.entry-id').data('id'));
        });
    }
    
    calorieList = MyCalorieClient('http://127.0.0.1:8081', entryActionsInit, dailyLimitInput,
                                  calorieDaysDiv, dayTemplateSeletor, entryTemplateSelector,
                                  entryContainerSelector);
    calorieList.initFields();
    calorieList.loadCalorieDays();
    
    $('.btn-refresh').click(function(){ calorieList.loadCalorieDays() });
    $('.btn-create').click(function(){
        $('#edit-modal').modal();
    });
    
    
    $('#save-entry').click(function(){
        // saves entry
        var modalForm = $('#edit-modal form');
        var id = modalForm.find('#entry-id').val();
        var date = modalForm.find('#entry-date').val();
        var time = modalForm.find('#entry-time').val();
        var text = modalForm.find('#entry-text').val();
        var calories = modalForm.find('#entry-calories').val();
        if (date !== '' && time !== '' && text !== '' && calories !== '') {
            calorieList.saveEntry(id, date, time, text, calories);
            $('#edit-modal').modal('hide');
        } else {
            alert("Please fill all fields before save!");
        }
    });
    
    $('#edit-modal').on('hidden.bs.modal', function () {
        // empty modal on close
        $(this).find('input, textarea').each(function() {
            $(this).val('');
        });
    })
});