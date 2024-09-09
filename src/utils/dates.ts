export const formatDateDDMMYYYY = (date?: string, prefix?: string) => {
    if (!date) return '';
    const pref = prefix || '.';
    const dateFormat = new Date(date);
    let day: string | number = dateFormat.getDate();
    let month: string | number = dateFormat.getMonth() + 1;
    if (day < 10) {
        day = `0${day}`;
    }
    if (month < 10) {
        month = `0${month}`;
    }
    return `${day}${pref}${month}${pref}${dateFormat.getFullYear()}`;
};

export const convertDate = (data) => {
    if (data) {
        const date = new Date(data);
        const weekdayShort = date.toLocaleDateString('ja-JP', { weekday: 'short' });
        return weekdayShort;
    }
    return '';
};

export default undefined;
