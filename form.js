const form = document.querySelector(".contact-form");
const fields = [
    document.querySelector("#name"),
    document.querySelector("#email"),
    document.querySelector("#comments")
];

const errorArea = document.querySelector("#form-errors");
const editedFields = new Set();
const checkedFields = new Set();

const comments = document.querySelector("#comments");
const formInfo = document.querySelector("#form-info");
const commentsCount = document.querySelector("#comments-count");
const warningThreshold = 50;

const form_errors = [];
const formErrorsInput = form.querySelector('input[name="form-errors"]');

const requiredMessages = {
    name: "Name: Enter your name.",
    email: "Email: Enter your email address.",
    comments: "Comments: Enter a message."
};

function updateFieldError(field) {
    // Clear any previous custom message before reading the current validity.
    field.setCustomValidity("");

    let message = "";

    if (field.validity.valueMissing) {
        message = requiredMessages[field.id];
    } else if (field.validity.typeMismatch && field.id === "email") {
        message = "Email: Enter an address like student@example.com.";
    } else if (field.validity.tooShort) {
        const label = field.id === "name" ? "Name" : "Comments";
        const unit = field.minLength === 1 ? "character" : "characters";
        message = `${label}: Enter at least ${field.minLength} ${unit}.`;
    }

    field.setCustomValidity(message);

    const error = document.querySelector(`#${field.id}-error`);

    if (error.textContent !== message) {
        error.hidden = !message;
        error.textContent = message;
    }

    if (message) {
        field.setAttribute("aria-invalid", "true");
    } else {
        field.removeAttribute("aria-invalid");
    }
}

for (const field of fields) {
    field.addEventListener("input", () => {
        editedFields.add(field);

        if (checkedFields.has(field)) {
            updateFieldError(field);
        }
    });

    field.addEventListener("blur", () => {
        if (editedFields.has(field)) {
            checkedFields.add(field);
            updateFieldError(field);
        }
    });
}

form.addEventListener("invalid", (event) => {
    const field = event.target;

    checkedFields.add(field);
    updateFieldError(field);

    form_errors.push({
        field: field.name,
        message: field.validationMessage
    });
}, true);

form.addEventListener("submit", () => {
    formErrorsInput.value = JSON.stringify(form_errors);
    formErrorsInput.disabled = false;
});

errorArea.hidden = false;


function updateCommentsCount() {
    const remaining = comments.maxLength - comments.value.length;

    commentsCount.classList.toggle("count-warning", remaining <= warningThreshold);

    if (remaining === 0) {
        commentsCount.textContent = "0 characters remaining. You’ve reached the limit.";
    } else if (remaining <= warningThreshold) {
        commentsCount.textContent = `Approaching the limit. Characters remaining: ${remaining}.`;
    } else {
        commentsCount.textContent = `Characters remaining: ${remaining}.`;
    }
}

comments.addEventListener("input", updateCommentsCount);
updateCommentsCount();
formInfo.hidden = false;