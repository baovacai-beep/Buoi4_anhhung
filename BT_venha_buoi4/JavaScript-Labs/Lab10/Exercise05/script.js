$(function () {
  const POSTS_URL = "https://jsonplaceholder.typicode.com/posts?_limit=6";
  const USERS_URL = "https://jsonplaceholder.typicode.com/users?_limit=6";
  const ERROR_URL = "https://jsonplaceholder.typicode.com/invalid-endpoint-404";

  function renderPosts(posts) {
    const $grid = $("#apiResultGrid").empty();
    $.each(posts, function (_, post) {
      const $card = $("<article>").addClass("api-card");
      $card.append($("<span>").addClass("api-id").text(`Post #${post.id}`));
      $card.append($("<h3>").text(post.title));
      $card.append($("<p>").text(post.body));
      $grid.append($card);
    });
  }

  function renderUsers(users) {
    const $grid = $("#apiResultGrid").empty();
    $.each(users, function (_, user) {
      const $card = $("<article>").addClass("api-card");
      $card.append($("<span>").addClass("api-id").text(`User #${user.id}`));
      $card.append($("<h3>").text(user.name));
      $card.append($("<p>").text(`Email: ${user.email} · Công ty: ${user.company.name}`));
      $grid.append($card);
    });
  }

  function fetchWithJqGet(url, type) {
    const startedAt = performance.now();
    $("#loadingIndicator").prop("hidden", false);
    $("#jqxhrMeta")
      .removeClass("is-done is-fail")
      .html(`<strong>Đang gọi:</strong> <code>$.get("${url}")</code>...`);

    const jqXHR = $.get(url);

    jqXHR
      .done(function (data, textStatus, xhr) {
        const elapsed = Math.round(performance.now() - startedAt);
        $("#jqxhrMeta")
          .addClass("is-done")
          .html(
            `<strong>.done() thành công:</strong> HTTP ${xhr.status} (${textStatus}) · Nhận ${data.length} bản ghi trong ${elapsed} ms.`
          );

        if (type === "users") {
          renderUsers(data);
        } else {
          renderPosts(data);
        }
        console.log("[Lab10 Ex05] jqXHR .done():", { status: xhr.status, count: data.length, data });
      })
      .fail(function (xhr, textStatus, errorThrown) {
        const elapsed = Math.round(performance.now() - startedAt);
        $("#jqxhrMeta")
          .addClass("is-fail")
          .html(
            `<strong>.fail() xử lý lỗi:</strong> HTTP ${xhr.status || "Network Error"} (${textStatus}${errorThrown ? ` - ${errorThrown}` : ""}) sau ${elapsed} ms.`
          );

        $("#apiResultGrid").html(`
          <div class="api-card">
            <span class="api-id">jqXHR Error</span>
            <h3>Không thể tải dữ liệu từ Endpoint</h3>
            <p>Callback <code>.fail()</code> đã bắt lỗi an toàn để giao diện không bị treo khi máy chủ trả về lỗi hoặc mất kết nối.</p>
          </div>
        `);
        console.warn("[Lab10 Ex05] jqXHR .fail():", xhr.status, textStatus, errorThrown);
      })
      .always(function () {
        $("#loadingIndicator").prop("hidden", true);
        console.info("[Lab10 Ex05] jqXHR .always(): Đã hoàn tất vòng đời request.");
      });
  }

  $("#btnFetchSuccess").on("click", function () {
    fetchWithJqGet(POSTS_URL, "posts");
  });

  $("#btnFetchUsers").on("click", function () {
    fetchWithJqGet(USERS_URL, "users");
  });

  $("#btnFetchError").on("click", function () {
    fetchWithJqGet(ERROR_URL, "posts");
  });

  // Tự động tải dữ liệu mẫu ngay khi mở trang
  fetchWithJqGet(POSTS_URL, "posts");
});
