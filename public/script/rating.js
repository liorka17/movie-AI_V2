document.addEventListener("DOMContentLoaded", () => {
    // הודעת הצלחה נעלמת אחרי 3 שניות
    setTimeout(() => {
        const successMessage = document.querySelector(".success-message");
        if (successMessage) {
            successMessage.style.display = "none";
        }
    }, 3000);
});
