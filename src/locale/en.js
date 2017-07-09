export default {
    ok() {
        return 'OK';
    },
    cancel() {
        return 'Cancel';
    },
    add(item = '') {
        return `Add${item ? ` '${item}'` : ''}`;
    },
    selectNone() {
        return 'Select none';
    },
    notFound() {
        return 'Not found anything!';
    },
    search() {
        return 'Search...';
    },
    momentDisplayFormat() {
        return 'D MMMM YYYY, HH:mm';
    },
    momentFormatPrefix() {
        return '';
    },
    second() {
        return 'Second';
    },
    minute() {
        return 'Minute';
    },
    hour() {
        return 'Hour';
    },
    day() {
        return 'Day';
    },
    week() {
        return 'Week';
    },
    month() {
        return 'Month';
    },
    year() {
        return 'Year';
    },
    browse() {
        return 'Browse...';
    },
    nFileSelected(n = 1) {
        if (n === 1) {
            return '1 file selected!';
        }
        return `${n} files selected!`;
    },
    nextPage() {
        return 'Next page';
    },
    prevPage() {
        return 'Prev page';
    },
    fromN(n = 1) {
        return `from ${n}`;
    }
};
