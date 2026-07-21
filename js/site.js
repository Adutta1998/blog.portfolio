(function () {
  "use strict";

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatDate(isoDate) {
    var date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  function renderPosts(posts, listElement, countElement) {
    if (!listElement) {
      return;
    }

    if (!posts.length) {
      listElement.innerHTML = "<li class=\"post-card\"><p>No posts found.</p></li>";
      if (countElement) {
        countElement.textContent = "0 posts";
      }
      return;
    }

    var markup = posts.map(function (post) {
      var tags = Array.isArray(post.tags)
        ? post.tags.map(function (tag) {
          return "<span class=\"tag\">" + escapeHtml(tag) + "</span>";
        }).join("")
        : "";

      var tagMarkup = tags ? "<div class=\"tags\" aria-label=\"Tags\">" + tags + "</div>" : "";

      return "<li class=\"post-card\">" +
        "<h2><a href=\"" + escapeHtml(post.url) + "\">" + escapeHtml(post.title) + "</a></h2>" +
        "<p class=\"meta\">Published " + escapeHtml(formatDate(post.date)) + "</p>" +
        "<p>" + escapeHtml(post.description || "") + "</p>" +
        tagMarkup +
        "</li>";
    }).join("");

    listElement.innerHTML = markup;
    if (countElement) {
      countElement.textContent = posts.length + (posts.length === 1 ? " post" : " posts");
    }
  }

  function initPostSearch() {
    var listElement = document.getElementById("post-list");
    var searchInput = document.getElementById("post-search");
    var countElement = document.getElementById("post-results-count");

    if (!listElement || !searchInput) {
      return;
    }

    fetch("data/posts.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to load posts index");
        }
        return response.json();
      })
      .then(function (posts) {
        if (!Array.isArray(posts)) {
          throw new Error("Unexpected posts format");
        }

        var sorted = posts.slice().sort(function (a, b) {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        function applyFilter() {
          var query = searchInput.value.trim().toLowerCase();
          if (!query) {
            renderPosts(sorted, listElement, countElement);
            return;
          }

          var filtered = sorted.filter(function (post) {
            var haystack = [post.title, post.description, (post.tags || []).join(" ")]
              .join(" ")
              .toLowerCase();
            return haystack.includes(query);
          });

          renderPosts(filtered, listElement, countElement);
        }

        searchInput.addEventListener("input", applyFilter);
        renderPosts(sorted, listElement, countElement);
      })
      .catch(function () {
        listElement.innerHTML = "<li class=\"post-card\"><p>Unable to load posts right now.</p></li>";
      });
  }

  var menuButton = document.querySelector(".menu-toggle");
  var nav = document.getElementById("primary-nav");

  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      var expanded = menuButton.getAttribute("aria-expanded") === "true";
      var next = String(!expanded);
      menuButton.setAttribute("aria-expanded", next);
      nav.setAttribute("data-open", next);
    });
  }

  var yearElement = document.getElementById("copyright-year");
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }

  initPostSearch();
})();