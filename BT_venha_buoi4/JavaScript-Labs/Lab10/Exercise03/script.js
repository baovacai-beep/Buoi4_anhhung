$(function () {
  function formatMoney(amount) {
    return `${amount.toLocaleString("vi-VN")} đ`;
  }

  function recalculateCart() {
    let totalCount = 0;
    let totalMoney = 0;
    const $items = $("#cartList .cart-item");

    $items.each(function () {
      const qty = Number($(this).data("qty")) || 0;
      const price = Number($(this).data("price")) || 0;
      totalCount += qty;
      totalMoney += qty * price;
    });

    $("#cartCount").text(totalCount);
    $("#cartTotal").text(formatMoney(totalMoney));
    $("#cartEmpty").prop("hidden", $items.length > 0);
  }

  function createCartItem(id, name, price) {
    const $li = $("<li>")
      .addClass("cart-item is-just-added")
      .attr("data-id", id)
      .data("price", price)
      .data("qty", 1);

    const $info = $("<div>").addClass("cart-item__info");
    $info.append($("<strong>").text(name));
    $info.append($("<span>").addClass("item-sub").text(`${formatMoney(price)} × 1`));

    const $actions = $("<div>").addClass("cart-item__actions");
    $actions.append($("<button>").attr("type", "button").addClass("mini-btn qty-dec").text("−"));
    $actions.append($("<span>").addClass("qty-num").text("1"));
    $actions.append($("<button>").attr("type", "button").addClass("mini-btn qty-inc").text("+"));
    $actions.append($("<button>").attr("type", "button").addClass("mini-btn prio-btn").text("★"));
    $actions.append($("<button>").attr("type", "button").addClass("mini-btn mini-btn--remove remove-btn").text("Xóa"));

    $li.append($info, $actions);
    return $li;
  }

  $(".add-cart-btn").on("click", function () {
    const $box = $(this).closest(".prod-box");
    const id = $box.data("id");
    const name = $box.data("name");
    const price = Number($box.data("price"));
    const usePrepend = $("#prependMode").is(":checked");

    const $existing = $(`#cartList .cart-item[data-id="${id}"]`);
    if ($existing.length > 0) {
      const nextQty = (Number($existing.data("qty")) || 1) + 1;
      $existing.data("qty", nextQty);
      $existing.find(".qty-num").text(nextQty);
      $existing.find(".item-sub").text(`${formatMoney(price)} × ${nextQty}`);
      $existing.addClass("is-just-added");
      $("#domActionNote").text(`Đã tăng số lượng "${name}" lên ${nextQty} và đánh dấu .addClass('is-just-added').`);
    } else {
      const $newItem = createCartItem(id, name, price);
      if (usePrepend) {
        $("#cartList").prepend($newItem);
        $("#domActionNote").text(`Đã dùng .prepend() để chèn "${name}" lên đầu giỏ hàng.`);
      } else {
        $("#cartList").append($newItem);
        $("#domActionNote").text(`Đã dùng .append() để thêm "${name}" vào cuối giỏ hàng.`);
      }
    }

    recalculateCart();
  });

  $("#cartList").on("click", ".qty-inc", function () {
    const $item = $(this).closest(".cart-item");
    const price = Number($item.data("price"));
    const nextQty = (Number($item.data("qty")) || 1) + 1;
    $item.data("qty", nextQty);
    $item.find(".qty-num").text(nextQty);
    $item.find(".item-sub").text(`${formatMoney(price)} × ${nextQty}`);
    recalculateCart();
  });

  $("#cartList").on("click", ".qty-dec", function () {
    const $item = $(this).closest(".cart-item");
    const price = Number($item.data("price"));
    const nextQty = (Number($item.data("qty")) || 1) - 1;
    if (nextQty <= 0) {
      $item.remove();
      $("#domActionNote").text("Số lượng về 0 — đã gọi .remove() để xóa khỏi DOM.");
    } else {
      $item.data("qty", nextQty);
      $item.find(".qty-num").text(nextQty);
      $item.find(".item-sub").text(`${formatMoney(price)} × ${nextQty}`);
    }
    recalculateCart();
  });

  $("#cartList").on("click", ".prio-btn", function () {
    const $item = $(this).closest(".cart-item");
    const active = $item.toggleClass("is-priority").hasClass("is-priority");
    $("#domActionNote").text(`Đã gọi .toggleClass('is-priority') → ${active ? "Bật ưu tiên" : "Tắt ưu tiên"}.`);
  });

  $("#cartList").on("click", ".remove-btn", function () {
    const name = $(this).closest(".cart-item").find("strong").text();
    $(this).closest(".cart-item").remove();
    $("#domActionNote").text(`Đã xóa "${name}" bằng .remove().`);
    recalculateCart();
  });

  $("#toggleCompactBtn").on("click", function () {
    const compact = $("#cartPanel").toggleClass("is-compact").hasClass("is-compact");
    $("#domActionNote").text(`Đã gọi .toggleClass('is-compact') → Chế độ ${compact ? "Thu gọn" : "Đầy đủ"}.`);
  });

  $("#clearCartBtn").on("click", function () {
    $("#cartList .cart-item").remove();
    $("#domActionNote").text("Đã xóa toàn bộ sản phẩm trong giỏ bằng .remove().");
    recalculateCart();
  });

  recalculateCart();
});
