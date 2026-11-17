$(function () {
  $("#jqStatus").text(`✓ Đã nạp thành công jQuery phiên bản ${$.fn.jquery} qua CDN HTTPS`);

  const $rows = $("#inventoryTable tbody tr");

  function clearRowStyles() {
    $rows.removeClass("row-even row-odd row-highlight row-dim");
  }

  $(".sel-btn").on("click", function () {
    const mode = $(this).data("mode");
    $(".sel-btn").removeClass("is-active");
    if (mode !== "reset") {
      $(this).addClass("is-active");
    }

    clearRowStyles();

    if (mode === "zebra") {
      const $even = $("#inventoryTable tbody tr:even").addClass("row-even");
      const $odd = $("#inventoryTable tbody tr:odd").addClass("row-odd");
      $("#selectorFeedback").html(
        `Đã thực thi <code>$("tbody tr:even")</code> (${$even.length} dòng) và <code>$("tbody tr:odd")</code> (${$odd.length} dòng).`
      );
    } else if (mode === "phukien") {
      const $matched = $rows.filter('[data-category="phu-kien"]');
      $rows.not($matched).addClass("row-dim");
      $matched.addClass("row-highlight");
      $("#selectorFeedback").html(
        `Bộ chọn <code>$('[data-category="phu-kien"]')</code> khớp <strong>${$matched.length}</strong> sản phẩm UEHMart.`
      );
    } else if (mode === "lowstock") {
      const $matched = $rows.filter('[data-stock="low"]');
      $rows.not($matched).addClass("row-dim");
      $matched.addClass("row-highlight");
      $("#selectorFeedback").html(
        `Bộ chọn <code>$('[data-stock="low"]')</code> phát hiện <strong>${$matched.length}</strong> sản phẩm sắp hết hàng.`
      );
    } else if (mode === "featured") {
      const $matched = $rows.filter('[data-featured="true"]');
      $rows.not($matched).addClass("row-dim");
      $matched.addClass("row-highlight");
      $("#selectorFeedback").html(
        `Bộ chọn <code>$('[data-featured="true"]')</code> chọn được <strong>${$matched.length}</strong> sản phẩm nổi bật.`
      );
    } else {
      $("#selectorFeedback").text("Đã xóa toàn bộ lớp CSS nổi bật trên bảng dữ liệu.");
    }
  });
});
