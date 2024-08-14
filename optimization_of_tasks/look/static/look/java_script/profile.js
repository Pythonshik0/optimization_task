const user_id_photo = JSON.parse(document.getElementById('user-id-photo').textContent);

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
// Делаем так чтобы пользователь не мог взаимодействовать с check_box для фото
document.getElementById('profile-photo-checkbox').onclick = function() {
    return false;
};

// Получение элемента (картинка) ______ЗАПОЛНЯЕМ Check Box________
const imageInput = document.querySelector('input[type="file"].image_create_photo');
var profilePhotoCheckbox = document.getElementById('profile-photo-checkbox');
// Обработчик события изменения картинки или загрузки картинки
imageInput.addEventListener('change', function() {
    profilePhotoCheckbox.checked = true;

});

// Загрузка фото в базу + отображение на странице профиля
document.getElementById('uploadButton').addEventListener('click', function() {
    var formData = new FormData();
    var fileInput = document.querySelector('input[type="file"]');
    formData.append(
        'image', fileInput.files[0],
    );

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload_image/', true);

    // Добавляем CSRF токен в заголовок запроса
    xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    xhr.onload = function() {
        if (xhr.status == 200) {
            var PhotoDiv = document.getElementById('images_may_photo');
            var photo = document.createElement('img'); //Кто отправил сообщение
            photo.className = 'image_photo_main';
            // photo.textContent = data.FIO_message;

            var fileExtension = fileInput.files[0].name.split('.').pop();
            var newFileName = user_id_photo + '.' + fileExtension;
            var imagePath = "/media/account_photo/" + newFileName;
            // document.querySelector('.image_photo_main').src = imagePath;
            photo.src = imagePath;
            var images = document.querySelectorAll('.image_photo_main');
            for (var i = 0; i < images.length; i++) {
                images[i].parentNode.removeChild(images[i]);
            }
            PhotoDiv.appendChild(photo);

        }
    };
    xhr.send(formData);
});

//СЧЕТЧИК СИМВОЛОВ В ГРАФЕ О СЕБЕ
document.getElementById('about_you_self').oninput = function() {
    var maxLength = 249;
    var textLength = this.value.length;
    var remainingChars = maxLength - textLength;

    if (remainingChars < 0) {
        this.value = this.value.slice(0, maxLength);
        remainingChars = 0;
    }

    document.getElementById('char-count').textContent = "О себе (" + remainingChars + " символов осталось)";
};

