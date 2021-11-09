export const DateFormat = (input) => {
    if (input === "0000-00-00" || input === "0000-00-00 00:00:00" || input === null ) {
        return ''
    } else {
        const date = new Date(input)
        let format = '';
        (date.getMonth() >= 9 && date.getDate() >= 10) ? format = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            : (date.getMonth() <= 8 && date.getDate() >= 10) ? format = date.getFullYear() + '-0' + (date.getMonth() + 1) + '-' + date.getDate()
                : (date.getMonth() >= 9 && date.getDate() < 10) ? format = date.getFullYear() + '-' + (date.getMonth() + 1) + '-0' + date.getDate()
                    : format = date.getFullYear() + '-0' + (date.getMonth() + 1) + '-0' + date.getDate()
        return format
    }

}