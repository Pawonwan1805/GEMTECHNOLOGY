/* =====================================================
   BANNER SLIDER
===================================================== */

let currentBanner = 0;


const banners =
    document.querySelectorAll(
        ".banner-slide"
    );


const bannerDots =
    document.querySelectorAll(
        ".banner-dot"
    );


function showBanner(index) {

    if (banners.length === 0) {
        return;
    }


    /* ถ้าเกินจำนวนรูป */
    if (index >= banners.length) {

        currentBanner = 0;

    }


    /* ถ้าน้อยกว่า 0 */
    else if (index < 0) {

        currentBanner =
            banners.length - 1;

    }


    else {

        currentBanner = index;

    }


    /* ซ่อนรูปทั้งหมด */
    banners.forEach((banner) => {

        banner.classList.remove(
            "active"
        );

    });


    /* ปิดจุดทั้งหมด */
    bannerDots.forEach((dot) => {

        dot.classList.remove(
            "active"
        );

    });


    /* แสดงรูปปัจจุบัน */
    banners[currentBanner]
        .classList.add("active");


    /* แสดงจุดปัจจุบัน */
    if (bannerDots[currentBanner]) {

        bannerDots[currentBanner]
            .classList.add("active");

    }

}


/* =====================================================
   CHANGE BANNER
===================================================== */

function changeBanner(direction) {

    showBanner(
        currentBanner + direction
    );

}


/* =====================================================
   AUTO SLIDE
===================================================== */

setInterval(() => {

    changeBanner(1);

}, 5000);


/* =====================================================
   START
===================================================== */