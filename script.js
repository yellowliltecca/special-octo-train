(() => {
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector("#main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Открыть меню" : "Закрыть меню");
      mainNav.classList.toggle("is-open", !isOpen);
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Открыть меню");
        mainNav.classList.remove("is-open");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Открыть меню");
        mainNav.classList.remove("is-open");
      }
    });
  }

  const cards = Array.from(document.querySelectorAll(".category-card"));
  const filterButtons = Array.from(document.querySelectorAll(".filter-chip"));
  const searchInput = document.querySelector("#catalog-search");
  const emptyState = document.querySelector("#empty-state");
  let activeFilter = "all";

  function applyCatalogFilter() {
    const query = (searchInput?.value || "").trim().toLocaleLowerCase("ru");
    let visibleCount = 0;

    cards.forEach((card) => {
      const category = card.dataset.category || "";
      const searchText = `${card.dataset.search || ""} ${card.textContent || ""}`.toLocaleLowerCase("ru");
      const matchesCategory = activeFilter === "all" || category === activeFilter;
      const matchesQuery = !query || searchText.includes(query);
      const visible = matchesCategory && matchesQuery;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (emptyState) emptyState.hidden = visibleCount !== 0;
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      applyCatalogFilter();
    });
  });

  searchInput?.addEventListener("input", applyCatalogFilter);

  const modal = document.querySelector("#category-modal");
  const modalTitle = document.querySelector("#modal-title");
  const modalDescription = document.querySelector("#modal-description");
  const closeButtons = modal ? modal.querySelectorAll(".modal-close, .modal-text-close") : [];
  let lastFocusedElement = null;

  function openModal(button) {
    if (!modal || !modalTitle || !modalDescription) return;
    lastFocusedElement = button;
    modalTitle.textContent = button.dataset.title || "Категория";
    modalDescription.textContent = button.dataset.description || "Уточните параметры и наличие по телефону.";
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector(".modal-close")?.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    lastFocusedElement?.focus();
  }

  document.querySelectorAll(".category-open").forEach((button) => {
    button.addEventListener("click", () => openModal(button));
  });

  closeButtons.forEach((button) => button.addEventListener("click", closeModal));
  modal?.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal && !modal.hidden) closeModal();
  });

  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
