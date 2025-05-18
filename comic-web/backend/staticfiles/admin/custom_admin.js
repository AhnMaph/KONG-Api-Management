document.addEventListener("DOMContentLoaded", function() {
    const fileInput = document.querySelector("input[type='file'][multiple]");
    
    if (!fileInput) {
        console.warn("Không tìm thấy input file.");
        return;
    }

    const previewContainer = document.createElement("div");
    previewContainer.innerHTML = "<strong>Danh sách ảnh đã chọn:</strong><br>";
    fileInput.parentNode.insertBefore(previewContainer, fileInput.nextSibling);

    fileInput.addEventListener("change", function(event) {
        previewContainer.innerHTML = "<strong>Danh sách ảnh đã chọn:</strong><br>";
        Array.from(event.target.files).forEach((file, index) => {
            const fileUrl = URL.createObjectURL(file);
            previewContainer.innerHTML += `<p><strong>Trang ${index + 1}:</strong> 
                                            <a href="${fileUrl}" target="_blank">${file.name}</a></p>`;
        });
    });
});
