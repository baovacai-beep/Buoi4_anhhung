$(function () {
  // Mở sẵn câu FAQ đầu tiên
  $(".faq-item").first().find(".faq-a").show();
  $(".faq-item").first().find(".faq-q span").text("−");

  // 1. .slideToggle() cho FAQ Accordion
  $(".faq-q").on("click", function () {
    const $item = $(this).closest(".faq-item");
    const $answer = $item.find(".faq-a");
    const $icon = $(this).find("span");

    $answer.stop(true, true).slideToggle(240, function () {
      $icon.text($answer.is(":visible") ? "−" : "+");
    });
  });

  $("#expandAllFaq").on("click", function () {
    $(".faq-a").stop(true, true).slideDown(220);
    $(".faq-q span").text("−");
  });

  $("#collapseAllFaq").on("click", function () {
    $(".faq-a").stop(true, true).slideUp(220);
    $(".faq-q span").text("+");
  });

  // 2. .fadeOut() / .fadeIn() cho thẻ ưu đãi
  $("#btnFadeOut").on("click", function () {
    $("#promoBox").stop(true, true).fadeOut(320);
  });

  $("#btnFadeIn").on("click", function () {
    $("#promoBox").stop(true, true).fadeIn(320);
  });

  // 3. .animate() mở rộng & thu nhỏ mượt mà
  $("#btnAnimateGrow").on("click", function () {
    $("#promoBox")
      .stop(true, true)
      .fadeIn(150)
      .animate(
        {
          width: "100%",
          paddingLeft: "24px",
          paddingTop: "18px",
          paddingBottom: "18px",
          opacity: 0.96
        },
        450
      );
  });

  $("#btnAnimateReset").on("click", function () {
    $("#promoBox")
      .stop(true, true)
      .fadeIn(150)
      .animate(
        {
          width: "72%",
          paddingLeft: "14px",
          paddingTop: "12px",
          paddingBottom: "12px",
          opacity: 1
        },
        350
      );
  });

  // 4. Quick-view popup dùng .fadeIn() / .fadeOut()
  $(".quick-view-btn").on("click", function () {
    const title = $(this).data("title");
    const detail = $(this).data("detail");
    $("#toastTitle").text(title);
    $("#toastBody").text(detail);
    $("#quickToast").stop(true, true).fadeIn(220);
  });

  $("#closeToastBtn").on("click", function () {
    $("#quickToast").stop(true, true).fadeOut(200);
  });
});
