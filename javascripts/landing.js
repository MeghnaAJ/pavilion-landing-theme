// Functions

function getElementOffset(el) {
  var elOffset = el.offset().top;
  var elHeight = el.height();
  var windowHeight = $(window).height();
  var offset;

  if (elHeight < windowHeight) {
    offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
  } else {
    offset = elOffset;
  }

  return offset;
}

function getParams() {
  return new URLSearchParams(window.location.search);
}

function buildUrl(params) {
  return window.location.protocol + '//' + window.location.host + window.location.pathname + "?" + params.toString();
}

function getCurrentPage(params) {
  var params = getParams();
  var page = params.get("page");
  if (page === undefined || page === "") {
    page = "0";
  }
  return Number( page );
}

function goToPage(page, goToLast=false) {
  var params = getParams();
  params.set("page", page);

  if (goToLast) {
    params.set('last', true);
  }
  console.log("Going to page: ", params);
  window.location.href = buildUrl(params);
}

// Click Handlers

window.addEventListener('DOMContentLoaded', (event) => {
  $("a.scroll-and-center").on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({
      scrollTop: getElementOffset($(e.target.getAttribute('href')))
    }, 400);
  });

  var $memberList = $('#member-list');
  var $toggleList = $memberList.find('.item-list-toggle');
  var $itemList = $memberList.find('.item-list');

  function handleGroupToggle(group) {
    if (group && group !== 'everyone') {
      $itemList.find(`.item:not(.${group})`).removeClass("show");
      $itemList.find(`.item.${group}`).addClass("show");
    } else {
      $itemList.find('.item').addClass('show');
    }
  }

  handleGroupToggle(window.location.hash.replace(/^#/, ''));

  $memberList.find('a.toggle').on("click", function(e) {
    $toggleList.find('.toggle').removeClass('active');
    $(e.target).addClass('active');
    handleGroupToggle(e.target.getAttribute("data-group"));
  });

  // Blog
  var $blog = $('body.blog, body.blog-post');
  var $articleList = $blog.find(".article-list");

  $blog.find("a.page-first").on('click', function(event) {
    goToPage("0");
  });

  $blog.find("a.page-prev").on('click', function(event) {
    console.log('clicked previous');
    if ($articleList.find('li:first-of-type.active').length) {
      goToPage(Math.max(0, getCurrentPage() - 1), true);
    } else {
      $articleList.find('li.active').prev().find('a').click();
    }
  });

  $blog.find("a.page-next").on('click', function(event) {
    console.log('clicked next');
    if ($articleList.find('li:last-of-type.active').length) {
      goToPage(getCurrentPage() + 1);
    } else {
      $articleList.find('li.active').next().find('a').click();
    }
  });

  var params = getParams();
  if (params.get('last') == "true") {
    $articleList.find('li:last-of-type a').click();
    params.delete('last');
  }

  $blog.find("div.subscribe").on('click', function(e) {
    if ($(this).hasClass('user')) {
      $(".subscribe-modal").addClass("active");
    } else {
      window.location.href = 'https://thepavilion.io/login'
    }
  });

  $blog.find(".subscribe-modal-close, .subscribe-cancel-link").on('click', function(e) {
    $(".subscribe-modal").removeClass("active");
  });
});
