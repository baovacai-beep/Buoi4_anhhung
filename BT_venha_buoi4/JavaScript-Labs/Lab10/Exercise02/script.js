$(function () {
  let activeCategory = "all";

  function applyFilter() {
    const query = $("#quickSearch").val().trim().toLowerCase();
    let visibleCount = 0;

    $(".product-card").each(function () {
      const $card = $(this);
      const name = String($card.data("name")).toLowerCase();
      const cat = String($card.data("cat")).toLowerCase();

      const matchQuery = name.includes(query);
      const matchCat = activeCategory === "all" || cat === activeCategory;

      if (matchQuery && matchCat) {
        $card.show();
        visibleCount++;
      } else {
        $card.hide();
      }
    });

    $("#resultCount").text(`Đang hiển thị ${visibleCount} / ${$(".product-card").length} sản phẩm`);
    $("#noResultMsg").prop("hidden", visibleCount > 0);
  }

  // .keyup() trên ô tìm kiếm
  $("#quickSearch").on("keyup", applyFilter);

  // .on('click', ...) trên nút lọc danh mục
  $(".cat-btn").on("click", function () {
    $(".cat-btn").removeClass("is-active");
    $(this).addClass("is-active");
    activeCategory = $(this).data("cat");
    applyFilter();
  });

  // .click() nút Đặt lại
  $("#resetFilterBtn").click(function () {
    $("#quickSearch").val("");
    activeCategory = "all";
    $(".cat-btn").removeClass("is-active").first().addClass("is-active");
    applyFilter();
  });

  // .hover() trên các thẻ sản phẩm
  $(".product-card").hover(
    function () {
      $(this).addClass("is-hovered");
      $("#hoverNotice").text(`Đang xem: ${$(this).data("name")}`);
    },
    function () {
      $(this).removeClass("is-hovered");
      $("#hoverNotice").text("Di chuột lên một thẻ sản phẩm để xem gợi ý nhanh.");
    }
  );

  // .on('click', ...) nút Yêu thích
  $("#productGrid").on("click", ".like-btn", function () {
    const $btn = $(this);
    const liked = $btn.toggleClass("is-liked").hasClass("is-liked");
    $btn.text(liked ? "♥ Đã thích" : "♡ Yêu thích");
  });

  applyFilter();
});
