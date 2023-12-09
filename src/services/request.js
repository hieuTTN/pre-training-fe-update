var token = localStorage.getItem('token');
async function requestGet(url) {
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        }),
    });
    return response;
};
async function requestPost(url, payload) {
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(payload)
    });
    return response;
};

async function uploadFile(filePath) {
    const formData = new FormData()
    formData.append("file", filePath.files[0])
    var urlUpload = 'http://localhost:8080/api/public/upload-file';
    const res = await fetch(urlUpload, {
        method: 'POST',
        body: formData
    });
    if (res.status < 300) {
        var linkFile = await res.text();
        return linkFile;
    }
    else{
        return null;
    }
};


export {requestGet,uploadFile,requestPost}