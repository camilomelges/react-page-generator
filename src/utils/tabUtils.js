function firstToUpper(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function firstToLower(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}

export default function getTabValueSeparatedByDot(tab, value) {
    if (!value) {
        value = tab.value;
    } else if(!value.includes(tab.value)) {
        value += `.${tab.value}`;
    }
    
    if (tab.subTabs && tab.subTabs.length) {
        tab = tab.subTabs[0];
        return getTabValueSeparatedByDot(tab, value);
    }
    
    return `${value}`;
}

export function toCamelCase(str) {
    return firstToLower(str.split(".").map(s => firstToUpper(s)).join(""));
}