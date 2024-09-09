export function blobToBase64(blob) {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

export function openFileInNewTab(blob) {
    const fileURL = window.URL.createObjectURL(blob);
    const tab = window.open();
    tab.location.href = fileURL;
}