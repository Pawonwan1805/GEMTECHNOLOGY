document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = localStorage.getItem("gemiiLoggedIn");
    const profileLink = document.querySelector(".login-button");


    const nameLabel = document.querySelector(".nav-profile-name");

    if (loggedInUser && profileLink) {
        profileLink.textContent = "ออกจากระบบ";
        if (nameLabel) nameLabel.textContent = loggedInUser;

        profileLink.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("ต้องการออกจากระบบหรือไม่?")) {
                localStorage.removeItem("gemiiLoggedIn");
                window.location.reload();
            }
        });
    }

});