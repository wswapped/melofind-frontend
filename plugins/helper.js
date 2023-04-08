export function generateUrlParams(paramsArray) {
    const params = new URLSearchParams();
    Object.keys(paramsArray).forEach(key => {
        let value = paramsArray[key]
        if (value !== null) {
            params.append(key, value);
        }
    });
    return params.toString();
}